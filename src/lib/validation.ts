import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome").max(60).optional(),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres").max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const onboardingSchema = z.object({
  instrument: z.enum(["GUITAR", "BASS"]),
  handedness: z.enum(["LEFT", "RIGHT"]),
  numStrings: z.coerce.number().int().min(4).max(6),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const settingsSchema = z.object({
  dailyGoalXp: z.coerce.number().int().min(10).max(500),
  reminders: z.coerce.boolean(),
  metronome: z.coerce.boolean(),
  waitMode: z.coerce.boolean(),
  camera: z.coerce.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
