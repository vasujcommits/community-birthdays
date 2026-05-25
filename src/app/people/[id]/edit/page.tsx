import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PersonForm } from "@/components/person-form";
import { updatePerson } from "@/app/actions/people";

export default async function EditPersonPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const person = await prisma.person.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!person) notFound();

  const updateWithId = updatePerson.bind(null, person.id);

  const birthdayValue = person.birthday ? person.birthday.toISOString().split("T")[0] : "";

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-black/10">
        <span className="text-[13px] font-medium tracking-widest uppercase">BirthdayTracker</span>
        <Link href={`/people/${person.id}`} className="text-[13px] text-black/40 hover:text-black transition-colors">
          ← Back
        </Link>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-20 py-20 max-w-xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-black/40 mb-8">Edit person</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05] tracking-[-0.03em] mb-12">
            {person.name}
          </h1>
          <PersonForm
            action={updateWithId}
            cancelHref={`/people/${person.id}`}
            submitLabel="Save changes"
            defaultValues={{
              name: person.name,
              birthday: birthdayValue,
              relationship: person.relationship ?? "",
            }}
          />
        </div>

        <div className="hidden lg:flex flex-1 border-l border-black/10 items-end p-16 bg-[#f5f5f3]" />
      </div>
    </div>
  );
}
