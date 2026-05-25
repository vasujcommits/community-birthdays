"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addNote } from "@/app/actions/notes";
import { useRef } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[11px] tracking-widest uppercase border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40 shrink-0"
    >
      {pending ? "Adding…" : "Add"}
    </button>
  );
}

export function NoteForm({ personId }: { personId: string }) {
  const [state, formAction] = useFormState(addNote, {});
  const ref = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    const result = await addNote({}, formData);
    if (!result?.error) ref.current?.reset();
    return result;
  }

  return (
    <div>
      {state?.error && (
        <p className="text-[12px] text-red-600 mb-3">{state.error}</p>
      )}
      <form ref={ref} action={formAction} className="flex gap-4 items-end">
        <input type="hidden" name="personId" value={personId} />
        <div className="flex-1 flex flex-col gap-1.5">
          <label htmlFor="content" className="text-[11px] tracking-[0.15em] uppercase text-black/40">
            New note
          </label>
          <input
            id="content" name="content" type="text"
            placeholder="e.g. Likes cooking, got a book last year…"
            className="border-b border-black/20 py-2 text-[14px] font-light placeholder-black/25 focus:outline-none focus:border-black transition-colors bg-transparent"
          />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
