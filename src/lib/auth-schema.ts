import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.")
  .transform((value) => value.toLowerCase());

export const registerSchema = z.object({
  name: z.string().optional(),
  email: emailSchema,
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export function firstZodErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}
