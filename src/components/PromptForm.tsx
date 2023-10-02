"use client";

import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type PromptFormProps = {
  generateResponse: (
    newQuestion: string,
    persona: string,
    setNewQuestion: Dispatch<SetStateAction<string>>,
    setNewPersona: Dispatch<SetStateAction<string>>,
  ) => void;
};

export const PromptForm = ({ generateResponse }: PromptFormProps) => {
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [persona, setNewPersona] = useState<string>("");

  return (
    <section aria-label="prompt-form" className="form-control gap-4">
      <label>Persona: </label>
      <input
        id="persona-input"
        type="text"
        placeholder="Atendente de chat"
        className="input-group-sm input-bordered"
        onChange={(e) => setNewPersona(e.target.value)}
        value={persona}>
      </input>
      <textarea
        rows={4}
        className="textarea textarea-bordered"
        placeholder="Pergunte o que quiser..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => generateResponse(newQuestion, persona, setNewQuestion, setNewPersona)}
      >
        Gerar resposta 🤖
      </button>
    </section>
  );
};
