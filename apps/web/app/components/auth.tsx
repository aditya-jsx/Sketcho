"use client";

import { authClient } from "../lib/auth-client";
// import { Button } from "@repo/ui/button";
// import { Card } from "@repo/ui/card";

export const AuthScreen = () => {
    const handleSignIn = async (provider: "github" | "google") => {
        await authClient.signIn.social({
            provider,
            callbackURL: "/home",
        });
    };

    return (
        <div className="p-6 flex flex-col gap-4 w-full max-w-md">
            <h1 className="text-2xl font-bold text-center">Welcome to Sketcho</h1>
            <p className="text-muted-foreground text-center">Choose a provider to continue</p>
            
            <button 
                className="w-full" 
                onClick={() => handleSignIn("github")}
            >
                Continue with GitHub
            </button>

            <button 
                className="w-full border-1 border-red-900" 
                // variant="outline" 
                onClick={() => handleSignIn("google")}
            >
                Continue with Google
            </button>
        </div>
    );
};