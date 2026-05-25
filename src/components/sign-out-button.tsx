"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-[13px] text-black/40 hover:text-black transition-colors"
    >
      Sign out
    </button>
  );
}
