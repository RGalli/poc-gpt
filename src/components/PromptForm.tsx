"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type PromptFormProps = {
  generateResponse: (
    newQuestion: string,
    setNewQuestion: Dispatch<SetStateAction<string>>
  ) => void;
};

export const PromptForm = ({ generateResponse }: PromptFormProps) => {
  const [newQuestion, setNewQuestion] = useState<string>("");

  return (
    <section aria-label="prompt-form" className="form-control gap-4">
      <textarea
        rows={4}
        className="textarea textarea-bordered"
        placeholder="Pergunte o que quiser..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => generateResponse(newQuestion, setNewQuestion)}
      >
        Gerar resposta 🤖
      </button>
    </section>
  );
};
