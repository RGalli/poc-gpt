import { ClipboardIcon } from "@heroicons/react/24/outline";

export type StoredValue = {
  id: string;
  question: string;
  answer: string | null;
  answeredIn: number;
};

type AnswerSectionProps = { storedValues: Array<StoredValue> };

export const AnswerSection = ({ storedValues }: AnswerSectionProps) => {
  const copyText = (text: string | null) => {
    if (text) navigator.clipboard.writeText(text.trim());
  };

  return (
    <section aria-label="answer-container">
      {storedValues.map((value) => (
        <div key={value.id} className="my-8 relative">
          <h1 className="bg-accent text-accent-content p-5">
            {value.question}
          </h1>
          <article className="p-5 bg-base-200 text-base-content prose max-w-none">
            {value.answer}
            <p className="text-sm text-secondary-content text-end pr-6">
              {new Intl.DateTimeFormat(undefined, {
                timeStyle: "long",
                dateStyle: "long",
              }).format(new Date(value.answeredIn * 1000))}
            </p>
          </article>
          <button
            className="btn btn-square btn-neutral text-neutral-content absolute -bottom-3 -right-3"
            onClick={() => copyText(value.answer)}
          >
            <ClipboardIcon className="w-6 h-6" />
          </button>
        </div>
      ))}
    </section>
  );
};
