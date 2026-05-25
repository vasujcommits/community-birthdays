import Link from "next/link";

const features = [
  {
    index: "01",
    title: "Reminders",
    description:
      "Notified days before every birthday. Enough time to find something meaningful.",
  },
  {
    index: "02",
    title: "Everyone",
    description:
      "Family, friends, colleagues — all in one place. Instantly searchable.",
  },
  {
    index: "03",
    title: "Gift notes",
    description:
      "Attach ideas to each person. Never blank when it counts.",
  },
  {
    index: "04",
    title: "Calendar",
    description:
      "A clean monthly view. See what's coming before it arrives.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-black bg-white">

      {/* ── Nav ── */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[13px] font-medium tracking-widest uppercase">
          Community Birthdays
        </span>

        <Link
          href="/login"
          className="text-[13px] font-medium tracking-widest uppercase border border-black px-5 py-2 hover:bg-black hover:text-white transition-colors duration-200"
        >
          Sign Up / Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col">

        {/* ── Hero ── */}
        <section className="flex flex-col justify-between px-8 pt-20 pb-16 min-h-[90vh]">
          <div className="max-w-5xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-10">
              Never miss a birthday
            </p>

            <h1 className="text-[clamp(3.2rem,8vw,7.5rem)] font-light leading-[1.02] tracking-[-0.03em] text-black mb-0">
              Remember<br />
              every birthday.<br />
              Always.
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-16 border-t border-black/10 mt-auto">
            <p className="max-w-xs text-[13px] text-black/50 leading-relaxed font-light">
              Community Birthdays keeps every important date in one quiet, organised place.
              Add people, set reminders, and show up — every year.
            </p>

            <Link
              href="/login"
              className="group flex items-center gap-4 text-[13px] font-medium tracking-widest uppercase"
            >
              Get started
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-8 pt-4 pb-32">
          <div className="border-t border-black/10 mb-12" />

          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-12">
            What you get
          </p>

          <div className="divide-y divide-black/10">
            {features.map((f) => (
              <div
                key={f.index}
                className="grid grid-cols-[3rem_1fr_1fr] gap-8 py-8 group"
              >
                <span className="text-[11px] tracking-widest text-black/30 pt-0.5 font-light">
                  {f.index}
                </span>
                <h3 className="text-[15px] font-medium tracking-wide group-hover:text-black/60 transition-colors">
                  {f.title}
                </h3>
                <p className="text-[13px] text-black/50 leading-relaxed font-light max-w-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-black/10 px-8 py-28 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-12">
          <h2 className="text-[clamp(2.2rem,5.5vw,5rem)] font-light leading-[1.05] tracking-[-0.03em] max-w-2xl">
            Show up for the people<br />
            you care about.
          </h2>

          <Link
            href="/login"
            className="group shrink-0 flex items-center gap-4 text-[13px] font-medium tracking-widest uppercase border-b border-black pb-1 hover:border-black/30 transition-colors duration-200"
          >
            Get started
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-black/10 px-8 py-8 flex items-center justify-between text-[12px] text-black/40 font-light">
        <div>
          <p className="text-[11px] tracking-widest uppercase text-black mb-1">Community Birthdays</p>
          <p>Never miss a birthday.</p>
        </div>
        <p>© {new Date().getFullYear()} Community Birthdays</p>
      </footer>
    </div>
  );
}
