"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { AnswerSection, type StoredValue } from "@/components/AnswerSection";
import { PromptForm } from "@/components/PromptForm";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default function Home() {
  const [storedValues, setStoredValues] = useState<Array<StoredValue>>([]);

  const chatOpenAI = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0.1,
    maxTokens: 1000,
  });

  const generateResponse = async (
    newQuestion: string,
    setNewQuestion: Dispatch<SetStateAction<string>>,
    persona: string,
    files: Array<File>
  ) => {
    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }));

    for (const file of files) {
      const loader = new WebPDFLoader(file);
      const docs = await loader.load();

      console.log({ docs });

      await vectorStore.addDocuments(docs);
    }

    const question = newQuestion;
    const template = "Você é um(a) {persona}.";
    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
    const humanTemplate = "{question}";
    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(humanTemplate);

    const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);

    //const chain = new LLMChain({ llm: chatOpenAI, prompt: chatPrompt });
    const chain = RetrievalQAChain.fromLLM(chatOpenAI, vectorStore.asRetriever(), { prompt: chatPrompt });

    const result = await chain.call({ query: question, persona: persona, question: question });

    console.log(result);

    if (result.text) {
      setStoredValues([
        ...storedValues,
        {
          answeredIn: Date.now(),
          question: newQuestion,
          answer: result.text,
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
