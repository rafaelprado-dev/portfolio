import { z } from "zod";

z.config({ jitless: true });

const normalizeInlineText = (value: string) =>
  value.replace(/\s+/g, " ").trim();
const normalizeMessage = (value: string) =>
  value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const inlineTextSchema = (minimum: number, maximum: number) =>
  z
    .string()
    .regex(/^[^<>\u0000-\u001f\u007f]+$/, "O campo contém caracteres inválidos")
    .transform(normalizeInlineText)
    .pipe(
      z
        .string()
        .min(minimum, `Use pelo menos ${minimum} caracteres`)
        .max(maximum, `Use no máximo ${maximum} caracteres`),
    );

export const contactInputLimits = {
  name: 80,
  email: 254,
  subject: 120,
  message: 2_000,
} as const;

export const contactInputSchema = z.object({
  name: inlineTextSchema(2, contactInputLimits.name),
  email: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .max(contactInputLimits.email, "O e-mail informado é muito longo")
        .email("Informe um e-mail válido"),
    ),
  subject: inlineTextSchema(4, contactInputLimits.subject),
  message: z
    .string()
    .transform(normalizeMessage)
    .pipe(
      z
        .string()
        .min(20, "Escreva uma mensagem com pelo menos 20 caracteres")
        .max(
          contactInputLimits.message,
          `Use no máximo ${contactInputLimits.message} caracteres`,
        )
        .regex(
          /^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/,
          "A mensagem contém caracteres inválidos",
        ),
    ),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
export type ContactField = keyof ContactInput;
