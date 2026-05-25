import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PersonForm } from "@/components/person-form";
import { createPerson } from "@/app/actions/people";

export default async function NewPersonPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[13px] font-medium tracking-widest uppercase">BirthdayTracker</span>
        <Link href="/dashboard" className="text-[13px] text-black/40 hover:text-black transition-colors">
          ← Dashboard
        </Link>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">Add person</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] mb-12">
            Who are you<br />remembering?
          </h1>
          <PersonForm action={createPerson} cancelHref="/dashboard" submitLabel="Save person" />
        </div>

        <div className="hidden lg:flex flex-1 border-l border-black/10 items-end p-16 bg-[#f5f5f3]">
          <p className="text-[clamp(1.8rem,3vw,3rem)] font-light leading-[1.1] tracking-[-0.03em] text-black/30 max-w-sm">
            "Every birthday is a chance to make someone feel seen."
          </p>
        </div>
      </div>
    </div>
  );
}
