"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordReset } from "@/app/actions/password-reset";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Sending…" : "Send reset link"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordReset, {});

  if (state?.success) {
    return (
      <div>
        <p className="text-[14px] font-light leading-relaxed text-black/70">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </p>
        <Link href="/login" className="inline-block mt-8 text-[12px] text-black/40 hover:text-black transition-colors">
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="text-[12px] text-red-600">{state.error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
          Email address
        </label>
        <input
          id="email" name="email" type="email" placeholder="you@example.com" required
          className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>

      <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
        <SubmitButton />
        <Link href="/login" className="text-[12px] text-black/40 hover:text-black transition-colors">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
