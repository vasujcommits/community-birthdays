"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ContactInput {
  name: string;
  email: string | null;
  birthday: string | null;
}

export async function importContacts(
  _prevState: { error?: string; imported?: number },
  formData: FormData
): Promise<{ error?: string; imported?: number }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated." };

  const raw = formData.get("contacts") as string;
  let contacts: ContactInput[] = [];
  try {
    contacts = JSON.parse(raw);
  } catch {
    return { error: "Invalid contact data." };
  }

  if (contacts.length === 0) return { error: "No contacts selected." };

  let imported = 0;

  for (const c of contacts) {
    // Skip if we already track this person (same email or same name+owner)
    if (c.email) {
      const existing = await prisma.person.findFirst({
        where: { userId: session.user.id, email: c.email },
      });
      if (existing) continue;
    }

    // Check if this email belongs to a registered user (for auto-linking)
    let profileUserId: string | null = null;
    if (c.email) {
      const linkedUser = await prisma.user.findUnique({
        where: { email: c.email },
        select: { id: true, birthday: true, wishes: true },
      });
      if (linkedUser) {
        profileUserId = linkedUser.id;
      }
    }

    await prisma.person.create({
      data: {
        name: c.name,
        email: c.email,
        birthday: c.birthday ? new Date(c.birthday) : null,
        userId: session.user.id,
        profileUserId,
      },
    });

    imported++;
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?imported=${imported}`);
}
