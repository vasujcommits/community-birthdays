import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/components/reset-password-form";

export default async function ResetPasswordPage({ params }: { params: { token: string } }) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: params.token },
  });

  if (!record || record.expires < new Date()) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
          <Link href="/" className="text-[13px] font-medium tracking-widest uppercase hover:text-black/50 transition-colors">
            Community Birthdays
          </Link>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-6">Link expired</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] mb-6">
            This link has expired.
          </h1>
          <Link href="/forgot-password" className="text-[13px] font-medium tracking-widest uppercase border-b border-black pb-1 hover:border-black/30 transition-colors">
            Request a new one →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/" className="text-[13px] font-medium tracking-widest uppercase hover:text-black/50 transition-colors">
          Community Birthdays
        </Link>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">New password</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] mb-12">
            Set a new<br />password.
          </h1>
          <ResetPasswordForm token={params.token} />
        </div>

        <div className="hidden lg:flex flex-1 border-l border-black/10 items-end p-16 bg-[#f5f5f3]" />
      </div>
    </div>
  );
}
