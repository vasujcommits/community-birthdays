"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const form = e.currentTarget;
    const result = await signIn("credentials", {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password.");
      setPending(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <>
      {error && <p className="text-[12px] text-red-600 mb-6">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Email
          </label>
          <input
            id="email" name="email" type="email" placeholder="alex@example.com" required
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Password
          </label>
          <input
            id="password" name="password" type="password" placeholder="Your password" required
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
          <button
            type="submit"
            disabled={pending}
            className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
          <div className="flex flex-col items-end gap-2">
            <Link href="/signup" className="text-[12px] text-black/40 hover:text-black transition-colors">
              Create an account
            </Link>
            <Link href="/forgot-password" className="text-[12px] text-black/30 hover:text-black transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-black/10">
        <p className="text-[11px] tracking-[0.15em] uppercase text-black/40 mb-4">Or continue with</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="text-[13px] font-medium tracking-widest uppercase border border-black/20 px-8 py-3 hover:border-black transition-colors duration-200 w-full"
        >
          Google
        </button>
      </div>
    </>
  );
}
