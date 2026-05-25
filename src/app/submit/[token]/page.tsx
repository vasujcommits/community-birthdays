import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SubmitForm } from "@/components/submit-form";

export default async function SubmitPage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { success?: string };
}) {
  const user = await prisma.user.findUnique({
    where: { shareToken: params.token },
    select: { name: true },
  });

  if (!user) notFound();

  const ownerName = user.name?.split(" ")[0] ?? "Someone";

  if (searchParams.success) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-8">
        <div className="max-w-md w-full text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-6">All done</p>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em] mb-6">
            Birthday received.
          </h1>
          <p className="text-[14px] text-black/50 font-light leading-relaxed">
            {ownerName} will be reminded when your birthday comes around.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[13px] font-medium tracking-widest uppercase">BirthdayTracker</span>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">
            {ownerName}'s birthday tracker
          </p>

          <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-light leading-[1.05] tracking-[-0.03em] mb-4">
            Share your<br />birthday with<br />{ownerName}.
          </h1>

          <p className="text-[13px] text-black/50 font-light mb-12 leading-relaxed">
            {ownerName} uses BirthdayTracker to remember the people they care about.
            Enter your details below and they'll never forget your birthday again.
          </p>

          <SubmitForm token={params.token} />
        </div>

        <div className="hidden lg:flex flex-1 border-l border-black/10 items-end p-16 bg-[#f5f5f3]">
          <p className="text-[clamp(1.8rem,3vw,3rem)] font-light leading-[1.1] tracking-[-0.03em] text-black/30 max-w-sm">
            "Being remembered on your birthday is one of life's small joys."
          </p>
        </div>
      </div>
    </div>
  );
}
