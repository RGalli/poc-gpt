"use client";

import { AnswerSection, type StoredValue } from "@/components/AnswerSection";
import { PromptForm } from "@/components/PromptForm";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export default function Home() {
  const [storedValues, setStoredValues] = useState<Array<StoredValue>>([]);

  const chatOpenAi = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.1,
    modelName: "gpt-3.5-turbo",
    maxTokens: 1000,
  });

  const generateResponse = async (
    newQuestion: string,
    persona: string,
    setNewQuestion: Dispatch<SetStateAction<string>>,
    setNewPersona: Dispatch<SetStateAction<string>>
  ) => {
    // const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    //   {
    //     model: "gpt-3.5-turbo",
    //     temperature: 0,
    //     max_tokens: 1000,
    //     top_p: 1,
    //     frequency_penalty: 0.0,
    //     presence_penalty: 0.0,
    //     stop: ["/"],
    //     messages: [
    //       { role: "system", content: persona || "Atendente de chat" },
    //     ],
    //   };

    // const completeOptions: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
    //   {
    //     ...params,
    //     messages: [{ role: "system", content: persona || "Atendente de chat" }, { role: "user", content: newQuestion }],
    //   };
    const question = newQuestion;
    const template = "Você é um(a) {persona}.";
    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
    const humanTemplate = "{question}";
    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

    const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);

    const chain = new LLMChain({
      llm: chatOpenAi,
      prompt: chatPrompt,
    });

    const result = await chain.call({
      persona: persona,
      question: question,
    });

    console.log(result);

    if (result.text) {
      setStoredValues([
        ...storedValues,
        {
          id: "1",
          answeredIn: Date.now(),
          question: newQuestion,
          answer: result.text,
        },
      ]);

      setNewQuestion("");
      setNewPersona(persona);
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
