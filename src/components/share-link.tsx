"use client";

import { useState } from "react";

export function ShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border border-black/10 p-6">
      <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-3">
        Your share link
      </p>
      <p className="text-[13px] font-light text-black/60 mb-4 break-all">{url}</p>
      <button
        onClick={copy}
        className="text-[11px] tracking-widest uppercase border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors duration-200"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <p className="text-[11px] text-black/30 mt-3 leading-relaxed">
        Share this with friends and family — they can enter their birthday and it will appear in your dashboard.
      </p>
    </div>
  );
}
