"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import OpenAI from "openai";
import { AnswerSection, type StoredValue } from "@/components/AnswerSection";
import { PromptForm } from "@/components/PromptForm";

export default function Home() {
  const [storedValues, setStoredValues] = useState<Array<StoredValue>>([]);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION,
    dangerouslyAllowBrowser: true,
  });

  const generateResponse = async (
    newQuestion: string,
    setNewQuestion: Dispatch<SetStateAction<string>>
  ) => {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        model: "gpt-3.5-turbo",
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["/"],
        messages: [
          { role: "system", content: "Sistema de gerenciamento da vida do Sotero" },
        ],
      };

    const completeOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        ...params,
        messages: [...params.messages, { role: "user", content: newQuestion }],
      };

    const chatCompletion = await openai.chat.completions.create(
      completeOptions
    );

    console.log(chatCompletion);

    if (chatCompletion.choices) {
      setStoredValues([
        ...storedValues,
        {
          id: chatCompletion.id,
          answeredIn: chatCompletion.created,
          question: newQuestion,
          answer: chatCompletion.choices[0].message.content,
        },
      ]);

      setNewQuestion("");
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-12 lg:p-24">
      <div className="prose text-center my-8 m-auto">
        <h1>🤖 POC GPT 🤖</h1>
        <h3>Seu assistente personal virtual</h3>
      </div>
      <AnswerSection storedValues={storedValues} />
      <div className="divider">Tire suas dúvidas ⬇️</div>
      <PromptForm generateResponse={generateResponse} />
    </main>
  );
}
