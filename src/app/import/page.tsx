import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ContactsImport } from "@/components/contacts-import";

export default async function ImportPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/dashboard" className="text-[13px] text-black/40 hover:text-black transition-colors">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-[13px] font-medium tracking-widest uppercase">Import Contacts</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-8 py-16 max-w-2xl mx-auto w-full">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-4">Google Contacts</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em] mb-6">
            Import your contacts.
          </h1>
          <p className="text-[14px] text-black/50 font-light leading-relaxed max-w-prose">
            Select the people you want to track. If any of them already have a Community Birthdays
            account, their birthday and gift wishes will be pulled in automatically.
          </p>
        </div>

        <ContactsImport />
      </main>
    </div>
  );
}
