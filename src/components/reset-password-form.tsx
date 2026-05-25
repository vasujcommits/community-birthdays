"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPassword } from "@/app/actions/password-reset";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Saving…" : "Set new password"}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const action = resetPassword.bind(null, token);
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <p className="text-[12px] text-red-600">{state.error}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
          New password
        </label>
        <input
          id="password" name="password" type="password" placeholder="At least 8 characters" required
          className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
          Confirm password
        </label>
        <input
          id="confirm" name="confirm" type="password" placeholder="Same password again" required
          className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
