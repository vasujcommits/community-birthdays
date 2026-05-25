"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Creating…" : label}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUp, {});

  return (
    <>
      {state?.error && (
        <p className="text-[12px] text-red-600 mb-6">{state.error}</p>
      )}

      <form action={formAction} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Full name
          </label>
          <input
            id="name" name="name" type="text" placeholder="Alex Johnson" required
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

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
            id="password" name="password" type="password" placeholder="At least 8 characters" required
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
          <SubmitButton label="Create account" />
          <Link href="/login" className="text-[12px] text-black/40 hover:text-black transition-colors">
            Already have an account?
          </Link>
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
