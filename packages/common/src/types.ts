import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string().min(3).max(100),
    username: z.string().min(5).max(10),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
})

export const SignInSchema = z.object({
    username: z.string().min(5).max(10),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(10),
})