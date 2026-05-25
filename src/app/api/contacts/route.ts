import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface GoogleContact {
  resourceName: string;
  name: string;
  email: string | null;
  birthday: string | null; // "YYYY-MM-DD" or null
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const token = session.accessToken;
  if (!token) {
    return NextResponse.json({ error: "no_token", contacts: [] });
  }

  try {
    const res = await fetch(
      "https://people.googleapis.com/v1/people/me/connections" +
        "?personFields=names,emailAddresses,birthdays&pageSize=500&sortOrder=LAST_NAME_ASCENDING",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("People API error:", res.status, text);
      return NextResponse.json({ error: "api_error", contacts: [] });
    }

    const data = await res.json();
    const connections: GoogleContact[] = (data.connections ?? [])
      .map((c: any) => {
        const name =
          c.names?.[0]?.displayName ??
          [c.names?.[0]?.givenName, c.names?.[0]?.familyName].filter(Boolean).join(" ");
        if (!name) return null;

        const email = c.emailAddresses?.[0]?.value ?? null;

        let birthday: string | null = null;
        const bd = c.birthdays?.[0]?.date;
        if (bd?.year && bd?.month && bd?.day) {
          const m = String(bd.month).padStart(2, "0");
          const d = String(bd.day).padStart(2, "0");
          birthday = `${bd.year}-${m}-${d}`;
        } else if (bd?.month && bd?.day) {
          // No year — use 2000 as placeholder
          const m = String(bd.month).padStart(2, "0");
          const d = String(bd.day).padStart(2, "0");
          birthday = `2000-${m}-${d}`;
        }

        return { resourceName: c.resourceName, name, email, birthday } as GoogleContact;
      })
      .filter(Boolean);

    return NextResponse.json({ contacts: connections });
  } catch (err) {
    console.error("Contacts fetch error:", err);
    return NextResponse.json({ error: "fetch_error", contacts: [] });
  }
}
