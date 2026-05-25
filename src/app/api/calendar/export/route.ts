import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateICS } from "@/lib/ics";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const personId = searchParams.get("personId");

  if (personId) {
    // Single person — always include 1-week reminder
    const person = await prisma.person.findFirst({
      where: { id: personId, userId: session.user.id },
    });
    if (!person) return new NextResponse("Not found", { status: 404 });

    if (!person.birthday) return new NextResponse("No birthday set", { status: 400 });

    const ics = generateICS(
      [{ ...person, birthday: person.birthday, withReminder: true }],
      `${person.name}'s Birthday`
    );

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${person.name.replace(/\s+/g, "_")}_birthday.ics"`,
      },
    });
  }

  // All birthdays — include 1-week reminders for everyone
  const people = await prisma.person.findMany({
    where: { userId: session.user.id },
    orderBy: { birthday: "asc" },
  });

  if (people.length === 0) {
    return new NextResponse("No birthdays to export", { status: 404 });
  }

  const ics = generateICS(
    people
      .filter((p): p is typeof p & { birthday: Date } => p.birthday !== null)
      .map((p) => ({ ...p, withReminder: true })),
    "Birthdays"
  );

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="birthdays.ics"',
    },
  });
}
