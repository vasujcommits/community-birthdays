"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { importContacts } from "@/app/actions/contacts";
import type { GoogleContact } from "@/app/api/contacts/route";

function ImportButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-40"
    >
      {pending ? "Importing…" : "Import selected"}
    </button>
  );
}

export function ContactsImport() {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [noToken, setNoToken] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [state, formAction] = useFormState(importContacts, {});

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => {
        if (data.error === "no_token") {
          setNoToken(true);
        } else {
          setContacts(data.contacts ?? []);
          // Pre-select everyone by default
          setSelected(new Set((data.contacts ?? []).map((c: GoogleContact) => c.resourceName)));
        }
      })
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  function toggle(resourceName: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(resourceName) ? next.delete(resourceName) : next.add(resourceName);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(contacts.map((c) => c.resourceName)));
  }

  function selectNone() {
    setSelected(new Set());
  }

  const selectedContacts = contacts.filter((c) => selected.has(c.resourceName));

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-[13px] text-black/40 font-light">Loading contacts…</p>
      </div>
    );
  }

  if (noToken) {
    return (
      <div className="py-20 max-w-md">
        <p className="text-[13px] text-black/60 font-light leading-relaxed mb-6">
          To import Google Contacts you must sign in with Google. Email/password accounts don't have
          access to your contacts.
        </p>
        <a
          href="/api/auth/signin/google"
          className="text-[13px] font-medium tracking-widest uppercase border border-black px-8 py-3 inline-block hover:bg-black hover:text-white transition-colors duration-200"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="py-20">
        <p className="text-[13px] text-black/40 font-light">No contacts found in your Google account.</p>
      </div>
    );
  }

  return (
    <div>
      {state?.error && (
        <p className="text-[12px] text-red-600 mb-6">{state.error}</p>
      )}

      <div className="flex items-center gap-6 mb-8">
        <span className="text-[13px] text-black/50 font-light">
          {selected.size} of {contacts.length} selected
        </span>
        <button
          type="button"
          onClick={selectAll}
          className="text-[11px] tracking-widest uppercase text-black/40 hover:text-black transition-colors"
        >
          Select all
        </button>
        <button
          type="button"
          onClick={selectNone}
          className="text-[11px] tracking-widest uppercase text-black/40 hover:text-black transition-colors"
        >
          Deselect all
        </button>
      </div>

      <div className="border-t border-black/10 mb-10 max-h-[60vh] overflow-y-auto">
        {contacts.map((c) => (
          <label
            key={c.resourceName}
            className="flex items-center justify-between py-4 border-b border-black/10 cursor-pointer group hover:bg-black/[0.02] -mx-4 px-4 transition-colors"
          >
            <div className="flex items-center gap-5">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
                checked={selected.has(c.resourceName)}
                onChange={() => toggle(c.resourceName)}
              />
              <div>
                <p className="text-[15px] font-light">{c.name}</p>
                {c.email && (
                  <p className="text-[12px] text-black/40">{c.email}</p>
                )}
              </div>
            </div>
            <div className="text-right shrink-0 ml-6">
              {c.birthday ? (
                <p className="text-[12px] text-black/40 font-light">
                  {new Date(c.birthday).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                </p>
              ) : (
                <p className="text-[11px] tracking-widest uppercase text-black/25">No birthday</p>
              )}
            </div>
          </label>
        ))}
      </div>

      <form action={formAction}>
        <input
          type="hidden"
          name="contacts"
          value={JSON.stringify(selectedContacts)}
        />
        <ImportButton />
      </form>
    </div>
  );
}
