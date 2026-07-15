"use client";

import { cn } from "@/lib/utils";

const emoticons = [
  { label: "Animação", value: ":)" },
  { label: "Extremamente animado kk", value: ":D" },
  { label: "Humm, porque tá piscado?", value: ";)" },
  { label: "Eita, fiz algo?", value: ":|" },
  { label: "Triste porque estou com chapéu inverso", value: ">:(" },
  { label: "Triste porque o chapéu caiu quando tentei inverter", value: ":(" },
  { label: "Óculos, Infinito, Questão numero 8 ou Olhos?", value: "8)" },
  { label: "Amor é bom demais", value: "<3" },
];

type TextEmoticonPickerProps = {
  className?: string;
  onSelect: (value: string) => void;
};

export function TextEmoticonPicker({
  className,
  onSelect,
}: TextEmoticonPickerProps) {
  return (
    <div
      className={cn("text-emoticon-picker", className)}
      aria-label="Emoticons de texto"
      role="toolbar"
    >
      {emoticons.map((emoticon) => (
        <button
          aria-label={`Inserir ${emoticon.label}`}
          key={emoticon.value}
          title={emoticon.label}
          type="button"
          onClick={() => onSelect(emoticon.value)}
        >
          {emoticon.value}
        </button>
      ))}
    </div>
  );
}
