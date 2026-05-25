import Link from "next/link";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/" className="text-[13px] font-medium tracking-widest uppercase hover:text-black/50 transition-colors">
          Community Birthdays
        </Link>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">Reset password</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] mb-4">
            Forgot your<br />password?
          </h1>
          <p className="text-[13px] text-black/50 font-light mb-10 leading-relaxed">
            Enter your email and we'll send you a link to set a new one.
          </p>
          <ForgotPasswordForm />
        </div>

        <div className="hidden lg:flex flex-1 border-l border-black/10 items-end p-16 bg-[#f5f5f3]">
          <p className="text-[clamp(1.8rem,3vw,3rem)] font-light leading-[1.1] tracking-[-0.03em] text-black/30 max-w-sm">
            "The people who matter most deserve to be remembered."
          </p>
        </div>
      </div>
    </div>
  );
}
