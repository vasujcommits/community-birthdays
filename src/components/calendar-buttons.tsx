"use client";

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

export function ExportForGoogleButton({ disabled }: { disabled?: boolean }) {
  function handle() {
    triggerDownload("/api/calendar/export", "birthdays.ics");
    setTimeout(() => {
      window.open("https://calendar.google.com/calendar/r/settings/export", "_blank");
    }, 600);
  }

  return (
    <button
      onClick={handle}
      disabled={disabled}
      className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-widest uppercase border border-black/20 px-6 py-2.5 hover:border-black transition-colors duration-200 disabled:opacity-30"
    >
      Export for Google Calendar
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </button>
  );
}

export function ExportForOutlookButton({ disabled }: { disabled?: boolean }) {
  return (
    <a
      href="/api/calendar/export"
      aria-disabled={disabled}
      className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-widest uppercase border border-black/20 px-6 py-2.5 hover:border-black transition-colors duration-200 aria-disabled:opacity-30 aria-disabled:pointer-events-none"
    >
      Export for Outlook
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">↓</span>
    </a>
  );
}

export function ReminderButton({ personId, personName }: { personId: string; personName: string }) {
  function handle() {
    triggerDownload(`/api/calendar/export?personId=${personId}`, `${personName.replace(/\s+/g, "_")}_birthday.ics`);
    setTimeout(() => {
      window.open("https://calendar.google.com/calendar/r/settings/export", "_blank");
    }, 600);
  }

  return (
    <button
      onClick={handle}
      className="group inline-flex items-center gap-3 text-[13px] font-medium tracking-widest uppercase border-b border-black/20 pb-1 hover:border-black transition-colors duration-200"
    >
      Add 1-week reminder to Google Calendar
      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
    </button>
  );
}
