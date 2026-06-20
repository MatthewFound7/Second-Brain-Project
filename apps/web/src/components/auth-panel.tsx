"use client";

import { useState } from "react";

type AuthPanelProps = {
    onLogin: (payload: { email: string; password: string }) => Promise<void>;
    onRegister: (payload: { email: string; password: string }) => Promise<void>;
    isLoading: boolean;
};

export function AuthPanel({
    onLogin,
    onRegister,
    isLoading,
}: AuthPanelProps): React.ReactElement {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mode, setMode] = useState<"login" | "register">("login");

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (mode === "login") {
            await onLogin({ email, password });
            return;
        }

        await onRegister({ email, password });
    }

    return (
        <div className="mx-auto max-w-md rounded border bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold">
                {mode === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="mb-6 text-sm text-gray-600">
                {mode === "login"
                    ? "Sign in to manage your private pages."
                    : "Create an account to start managing pages."}
            </p>

            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full rounded border px-3 py-2"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded border px-3 py-2"
                        autoComplete={
                            mode === "login" ? "current-password" : "new-password"
                        }
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading
                        ? "Please wait..."
                        : mode === "login"
                            ? "Sign in"
                            : "Create account"}
                </button>
            </form>

            <button
                type="button"
                onClick={() =>
                    setMode((currentMode) =>
                        currentMode === "login" ? "register" : "login",
                    )
                }
                className="mt-4 text-sm text-blue-600 underline"
            >
                {mode === "login"
                    ? "Need an account? Register"
                    : "Already have an account? Sign in"}
            </button>
        </div>
    );
}