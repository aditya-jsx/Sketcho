"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SignInSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(100),
    username: zod_1.z.string().min(5).max(10),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
});
exports.SignInSchema = zod_1.z.object({
    username: zod_1.z.string().min(5).max(10),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character"),
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(10),
});
