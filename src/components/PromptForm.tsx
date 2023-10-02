"use client";

import { useState } from "react";
import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";

type PromptFormProps = {
  generateResponse: (
    newQuestion: string,
    setNewQuestion: Dispatch<SetStateAction<string>>,
    persona: string,
    files: Array<File>
  ) => Promise<void>;
};

export const PromptForm = ({ generateResponse }: PromptFormProps) => {
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [persona, setNewPersona] = useState<string>("");
  const [files, setFiles] = useState<Array<File>>([]);

  const handleButtonClick = () => {
    generateResponse(newQuestion, setNewQuestion, persona, files);
  };

  const handleChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList = event.target.files!;
    const newFiles: Array<File> = [];

    for (let index = 0; index < fileList.length; index++) {
      newFiles.push(fileList.item(index)!);
    }

    setFiles(newFiles);
  };

  return (
    <section aria-label="prompt-form" className="form-control gap-4">
      <div className="form-control">
        <label htmlFor="persona-input" className="label label-text">
          Persona:
        </label>
        <div className="join join-vertical md:join-horizontal">
          <input
            id="persona-input"
            type="text"
            placeholder="Atendente de chat"
            className="join-item input input-secondary md:w-3/5"
            onChange={(e) => setNewPersona(e.target.value)}
            value={persona}
          />
          <input
            type="file"
            multiple
            className="join-item file-input file-input-secondary md:w-2/5"
            accept=".pdf"
            onChange={handleChangeFile}
          />
        </div>
      </div>

      <textarea
        rows={4}
        className="textarea textarea-primary"
        placeholder="Pergunte o que quiser..."
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleButtonClick}>
        Gerar resposta 🤖
      </button>
    </section>
  );
};
