import { z } from "zod";
import { communityAvatarCount } from "@/lib/community/avatars";

const normalizeInlineText = (value: string) =>
  value.replace(/\s+/g, " ").trim();
const normalizeMessage = (value: string) =>
  value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const publicNameSchema = z
  .string()
  .transform(normalizeInlineText)
  .pipe(
    z
      .string()
      .min(2, "Informe um nome com pelo menos 2 caracteres")
      .max(32, "Use no máximo 32 caracteres")
      .regex(
        /^[^<>\u0000-\u001f\u007f]+$/,
        "O nome contém caracteres inválidos",
      ),
  );

export const feedbackInputSchema = z.object({
  avatarId: z
    .number()
    .int()
    .min(1)
    .max(communityAvatarCount, "Escolha uma imagem de perfil válida"),
  name: publicNameSchema,
  message: z
    .string()
    .transform(normalizeMessage)
    .pipe(
      z
        .string()
        .min(10, "Escreva uma mensagem com pelo menos 10 caracteres")
        .max(500, "Use no máximo 500 caracteres")
        .regex(
          /^[^<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+$/,
          "A mensagem contém caracteres inválidos",
        ),
    ),
});

export const snakeScoreInputSchema = z.object({
  name: publicNameSchema.catch("Visitante"),
  score: z.number().int().min(10).max(2_220).multipleOf(10),
});

export const doomPlaytimeInputSchema = z.object({
  name: publicNameSchema.catch("Visitante"),
  seconds: z.number().int().min(5).max(60),
});

export type FeedbackInput = z.infer<typeof feedbackInputSchema>;

export type CommunityMessage = {
  id: string;
  avatarId: number;
  name: string;
  message: string;
  createdAt: string;
  status: "approved" | "pending";
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  value: number;
  updatedAt: string;
};

export type CommunitySnapshot = {
  feedback: CommunityMessage[];
  visitorCount: number;
  snakeLeaderboard: LeaderboardEntry[];
  doomLeaderboard: LeaderboardEntry[];
};

export type GameSubmissionResult = {
  entry: LeaderboardEntry;
};
