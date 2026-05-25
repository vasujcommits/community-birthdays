"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

type Action = (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>;

interface PersonFormProps {
  action: Action;
  defaultValues?: { name?: string; birthday?: string; relationship?: string };
  cancelHref: string;
  submitLabel: string;
}

const relationships = ["Family", "Friend", "Partner", "Colleague", "Other"];

export function PersonForm({ action, defaultValues, cancelHref, submitLabel }: PersonFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <>
      {state?.error && (
        <p className="text-[12px] text-red-600 mb-6">{state.error}</p>
      )}

      <form action={formAction} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Full name
          </label>
          <input
            id="name" name="name" type="text" placeholder="Alex Johnson" required
            defaultValue={defaultValues?.name}
            className="border-b border-black/20 py-3 text-[15px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthday" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Birthday
          </label>
          <input
            id="birthday" name="birthday" type="date" required
            defaultValue={defaultValues?.birthday}
            className="border-b border-black/20 py-3 text-[15px] font-light focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="relationship" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            Relationship <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <select
            id="relationship" name="relationship"
            defaultValue={defaultValues?.relationship ?? ""}
            className="border-b border-black/20 py-3 text-[15px] font-light focus:outline-none focus:border-black transition-colors bg-transparent appearance-none"
          >
            <option value="">Select…</option>
            {relationships.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex items-center justify-between flex-wrap gap-4">
          <SubmitButton label={submitLabel} />
          <Link href={cancelHref} className="text-[12px] text-black/40 hover:text-black transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
