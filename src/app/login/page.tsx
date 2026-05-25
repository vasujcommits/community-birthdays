import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/" className="text-[13px] font-medium tracking-widest uppercase hover:text-black/50 transition-colors">
          BirthdayTracker
        </Link>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">Sign in</p>

          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] mb-4">
            Welcome back.
          </h1>

          {searchParams.welcome && (
            <p className="text-[13px] text-black/50 mb-8">
              Account created — sign in to get started.
            </p>
          )}

          <div className="mt-6">
            <LoginForm />
          </div>
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
