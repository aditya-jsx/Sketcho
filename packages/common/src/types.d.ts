import { z } from "zod";
export declare const SignUpSchema: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const SignInSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=types.d.ts.map