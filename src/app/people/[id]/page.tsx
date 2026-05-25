import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";
import { NoteForm } from "@/components/note-form";
import { DeletePersonButton } from "@/components/delete-person-button";
import { ReminderButton } from "@/components/calendar-buttons";
import { deleteNote } from "@/app/actions/notes";
import { daysUntilBirthday, formatFullBirthday, googleCalendarUrl } from "@/lib/utils";

export default async function PersonPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const person = await prisma.person.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      profileUser: { select: { birthday: true, wishes: true } },
    },
  });

  if (!person) notFound();

  const days = daysUntilBirthday(person.birthday);
  const calUrl = googleCalendarUrl(person.name, person.birthday);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <Link href="/dashboard" className="text-[13px] text-black/40 hover:text-black transition-colors">
          ← Dashboard
        </Link>
        <div className="flex items-center gap-6">
          <Link href={`/people/${person.id}/edit`} className="text-[13px] tracking-widest uppercase hover:text-black/50 transition-colors">
            Edit
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 px-8 py-16 max-w-2xl mx-auto w-full">
        {/* Person header */}
        <div className="mb-16">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-6">
            {person.relationship ?? "Person"}
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-light leading-[1.0] tracking-[-0.03em] mb-8">
            {person.name}
          </h1>

          <div className="grid grid-cols-2 gap-8 border-t border-black/10 pt-8">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2">Birthday</p>
              <p className="text-[16px] font-light">{formatFullBirthday(person.birthday)}</p>
            </div>
            {person.birthday && (
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-black/40 mb-2">Next birthday</p>
                <p className={`text-[16px] font-light ${days <= 7 ? "text-black font-medium" : ""}`}>
                  {days === 0 ? "Today 🎂" : days === 1 ? "Tomorrow" : `in ${days} days`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar actions — only shown when birthday is known */}
        {person.birthday && calUrl && (
          <div className="mb-16 flex flex-col sm:flex-row gap-6">
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-[13px] font-medium tracking-widest uppercase border-b border-black/20 pb-1 hover:border-black transition-colors duration-200"
            >
              Add to Google Calendar
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            <ReminderButton personId={person.id} personName={person.name} />
          </div>
        )}

        {/* Profile wishes (from their Community Birthdays account) */}
        {person.profileUser?.wishes && (
          <div className="mb-16 border border-black/10 px-8 py-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-3">
              From their profile
            </p>
            <p className="text-[14px] font-light leading-relaxed whitespace-pre-line">
              {person.profileUser.wishes}
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="border-t border-black/10 pt-10">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">Gift ideas & notes</p>

          <NoteForm personId={person.id} />

          {person.notes.length > 0 && (
            <div className="mt-8 divide-y divide-black/10">
              {person.notes.map((note, i) => (
                <div key={note.id} className="flex items-start justify-between gap-4 py-5 group">
                  <div className="flex items-start gap-6">
                    <span className="text-[11px] tracking-widest text-black/30 mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14px] font-light leading-relaxed">{note.content}</p>
                  </div>
                  <form action={deleteNote} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="hidden" name="noteId" value={note.id} />
                    <input type="hidden" name="personId" value={person.id} />
                    <button type="submit" className="text-[11px] text-black/30 hover:text-black transition-colors tracking-widest uppercase">
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete person */}
        <div className="mt-20 pt-10 border-t border-black/10">
          <DeletePersonButton personId={person.id} personName={person.name} />
        </div>
      </main>
    </div>
  );
}
