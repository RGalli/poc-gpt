"use client";

import { AnswerSection, type StoredValue } from "@/components/AnswerSection";
import { PromptForm } from "@/components/PromptForm";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export default function Home() {
  const [storedValues, setStoredValues] = useState<Array<StoredValue>>([]);

  const chatOpenAi = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    maxTokens: 4000,
  });

  const generateResponse = async (
    newQuestion: string,
    persona: string,
    setNewQuestion: Dispatch<SetStateAction<string>>,
    setNewPersona: Dispatch<SetStateAction<string>>
  ) => {

    const loader = new CheerioWebBaseLoader("/cv-linkedin.txt");
    const docs = await loader.load();

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }));


    const question = newQuestion;
    const template = "Você é um(a) {persona}.";
    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
    const humanTemplate = "{question}";
    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

    const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);

    const chain = RetrievalQAChain.fromLLM(chatOpenAi, vectorStore.asRetriever(), {
      prompt: chatPrompt
    });

    const result = await chain.call({
      query: question,
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
          question: question,
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
