import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { birthday: true, wishes: true, name: true, email: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/dashboard" className="text-[13px] text-black/40 hover:text-black transition-colors">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-[13px] font-medium tracking-widest uppercase">My Profile</span>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-8 py-16 max-w-xl mx-auto w-full">
        <div className="mb-12">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-4">Your birthday profile</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em] mb-6">
            {user.name}
          </h1>
          <p className="text-[14px] text-black/50 font-light leading-relaxed">
            When friends who track you import their contacts, your birthday and wishes will
            automatically appear in their tracker.
          </p>
        </div>

        <ProfileForm
          initialBirthday={user.birthday ? user.birthday.toISOString().split("T")[0] : ""}
          initialWishes={user.wishes ?? ""}
        />
      </main>
    </div>
  );
}
