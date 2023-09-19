import { z } from "zod";

export const signupInput = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username cannot be empty",
    })
    .max(20, {
      message: "Username must be 20 characters or less",
    })
    .regex(/^[a-zA-Z0-9_]*$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z.string().min(8, {
    message: "Password should be at least 8 characters",
  }),
});

export type SignupParams = z.infer<typeof signupInput>;
