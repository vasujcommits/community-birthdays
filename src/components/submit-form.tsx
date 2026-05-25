"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitBirthday } from "@/app/actions/submit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Sending…" : "Submit my birthday"}
    </button>
  );
}

export function SubmitForm({ token }: { token: string }) {
  const action = submitBirthday.bind(null, token);
  const [state, formAction] = useFormState(action, {});

  return (
    <>
      {state?.error && (
        <p className="text-[12px] text-red-600 mb-6">{state.error}</p>
      )}
      <form action={formAction} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Your name
          </label>
          <input
            id="name" name="name" type="text" placeholder="Alex Johnson" required
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthday" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Your birthday
          </label>
          <input
            id="birthday" name="birthday" type="date" required
            className="border-b border-black/20 py-3 text-[15px] font-light focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Your email{" "}
            <span className="normal-case tracking-normal">(optional — links to your profile)</span>
          </label>
          <input
            id="email" name="email" type="email" placeholder="you@example.com"
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="wishes" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            A few things you'd love as a gift{" "}
            <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <textarea
            id="wishes" name="wishes" rows={3}
            placeholder="e.g. Books, candles, anything coffee-related…"
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
