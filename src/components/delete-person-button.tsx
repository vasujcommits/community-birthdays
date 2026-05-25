"use client";

import { useRef } from "react";
import { deletePerson } from "@/app/actions/people";

export function DeletePersonButton({ personId, personName }: { personId: string; personName: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleClick() {
    if (confirm(`Remove ${personName}?`)) {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form ref={formRef} action={deletePerson}>
      <input type="hidden" name="id" value={personId} />
      <button
        type="button"
        onClick={handleClick}
        className="text-[11px] tracking-widest uppercase text-black/30 hover:text-black transition-colors"
      >
        Remove {personName}
      </button>
    </form>
  );
}
