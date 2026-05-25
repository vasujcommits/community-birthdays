import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { ShareLink } from "@/components/share-link";
import { ExportForGoogleButton, ExportForOutlookButton } from "@/components/calendar-buttons";
import { daysUntilBirthday, formatBirthday } from "@/lib/utils";
import { randomBytes } from "crypto";

async function getOrCreateShareToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { shareToken: true },
  });

  if (user?.shareToken) return user.shareToken;

  const token = randomBytes(8).toString("hex");
  await prisma.user.update({ where: { id: userId }, data: { shareToken: token } });
  return token;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { imported?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [people, shareToken] = await Promise.all([
    prisma.person.findMany({
      where: { userId: session.user.id },
      orderBy: { birthday: "asc" },
    }),
    getOrCreateShareToken(session.user.id),
  ]);

  const importedCount = searchParams?.imported ? parseInt(searchParams.imported) : null;

  const withKnownBirthday = people.filter((p) => p.birthday !== null);
  const withoutBirthday = people.filter((p) => p.birthday === null);

  const sorted = withKnownBirthday
    .map((p) => ({ ...p, daysUntil: daysUntilBirthday(p.birthday) }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const shareUrl = `${process.env.NEXTAUTH_URL}/submit/${shareToken}`;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[13px] font-medium tracking-widest uppercase">BirthdayTracker</span>
        <div className="flex items-center gap-6">
          <Link href="/profile" className="text-[13px] text-black/40 hover:text-black transition-colors hidden sm:block">
            {session.user.name}
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-8 py-16 max-w-4xl mx-auto w-full">
        {/* Import success toast */}
        {importedCount !== null && (
          <div className="mb-8 border border-black/10 px-6 py-4 text-[13px] text-black/60 font-light">
            {importedCount === 0
              ? "No new contacts imported (all already tracked)."
              : `${importedCount} contact${importedCount === 1 ? "" : "s"} imported successfully.`}
          </div>
        )}

        {/* Header row */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-3">Upcoming</p>
            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[-0.03em] leading-tight">
              Birthdays
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Link
              href="/import"
              className="text-[13px] font-medium tracking-widest uppercase border border-black/30 px-6 py-2.5 hover:border-black transition-colors duration-200"
            >
              Import contacts
            </Link>
            <ExportForGoogleButton disabled={sorted.length === 0} />
            <ExportForOutlookButton disabled={sorted.length === 0} />
            <Link
              href="/people/new"
              className="text-[13px] font-medium tracking-widest uppercase border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
            >
              + Add person
            </Link>
          </div>
        </div>

        {/* Share link */}
        <div className="mb-16">
          <ShareLink url={shareUrl} />
        </div>

        {/* Birthday list */}
        {sorted.length === 0 && withoutBirthday.length === 0 ? (
          <div className="border-t border-black/10 pt-16 text-center">
            <p className="text-black/40 text-[15px] font-light mb-6">No birthdays yet.</p>
            <p className="text-[13px] text-black/30 font-light">
              Share your link above,{" "}
              <Link href="/import" className="underline underline-offset-4 hover:text-black transition-colors">
                import contacts
              </Link>
              , or{" "}
              <Link href="/people/new" className="underline underline-offset-4 hover:text-black transition-colors">
                add someone manually
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-black/10 border-t border-black/10">
              {sorted.map((person, i) => (
                <Link
                  key={person.id}
                  href={`/people/${person.id}`}
                  className="group flex items-center justify-between py-6 hover:bg-black/[0.02] transition-colors -mx-4 px-4"
                >
                  <div className="flex items-center gap-8">
                    <span className="text-[11px] tracking-widest text-black/30 w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[16px] font-medium mb-0.5">{person.name}</p>
                      <p className="text-[13px] text-black/40 font-light">
                        {formatBirthday(person.birthday)}
                        {person.relationship && (
                          <span className="ml-3 text-[11px] tracking-widest uppercase">
                            {person.relationship}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className={`text-[13px] font-light ${person.daysUntil <= 7 ? "text-black font-medium" : "text-black/40"}`}>
                      {person.daysUntil === 0
                        ? "Today 🎂"
                        : person.daysUntil === 1
                        ? "Tomorrow"
                        : `in ${person.daysUntil} days`}
                    </span>
                    <span className="text-black/20 group-hover:text-black transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pending — imported contacts with no birthday yet */}
            {withoutBirthday.length > 0 && (
              <div className="mt-16">
                <p className="text-[11px] tracking-[0.2em] uppercase text-black/30 mb-6">
                  Awaiting birthday
                </p>
                <div className="divide-y divide-black/10 border-t border-black/10">
                  {withoutBirthday.map((person) => (
                    <Link
                      key={person.id}
                      href={`/people/${person.id}`}
                      className="group flex items-center justify-between py-5 hover:bg-black/[0.02] transition-colors -mx-4 px-4"
                    >
                      <div>
                        <p className="text-[15px] font-light">{person.name}</p>
                        {person.email && (
                          <p className="text-[12px] text-black/30">{person.email}</p>
                        )}
                      </div>
                      <span className="text-[11px] tracking-widest uppercase text-black/25 group-hover:text-black transition-colors">
                        Invite →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
