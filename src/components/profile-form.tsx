"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile } from "@/app/actions/profile";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Saving…" : "Save profile"}
    </button>
  );
}

interface Props {
  initialBirthday: string;
  initialWishes: string;
}

export function ProfileForm({ initialBirthday, initialWishes }: Props) {
  const [state, formAction] = useFormState(updateProfile, {});

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state?.error && (
        <p className="text-[12px] text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-[12px] text-green-700 tracking-wide">Profile saved.</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthday" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
          Your birthday
        </label>
        <input
          id="birthday"
          name="birthday"
          type="date"
          defaultValue={initialBirthday}
          className="border-b border-black/20 py-3 text-[15px] font-light focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="wishes" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
          Gift wishes{" "}
          <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          id="wishes"
          name="wishes"
          rows={4}
          defaultValue={initialWishes}
          placeholder="e.g. Books, candles, anything coffee-related…"
          className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent resize-none leading-relaxed"
        />
      </div>

      <div className="pt-2">
        <SaveButton />
      </div>
    </form>
  );
}
