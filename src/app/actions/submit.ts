"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitBirthday(
  token: string,
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const name = (formData.get("name") as string)?.trim();
  const birthday = formData.get("birthday") as string;

  if (!name) return { error: "Please enter your name." };
  if (!birthday) return { error: "Please enter your birthday." };

  const user = await prisma.user.findUnique({ where: { shareToken: token } });
  if (!user) return { error: "This link is invalid or has expired." };

  const wishes = (formData.get("wishes") as string)?.trim() || null;

  const email = (formData.get("email") as string)?.trim().toLowerCase() || null;

  // Check if this email belongs to a registered user
  let profileUserId: string | null = null;
  if (email) {
    const linkedUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, birthday: true, wishes: true },
    });
    if (linkedUser) {
      profileUserId = linkedUser.id;
      // If they have a profile birthday, use that instead
      if (linkedUser.birthday && !birthday) {
        // birthday already required by form, just note the link
      }
    }
  }

  let created = false;
  try {
    const person = await prisma.person.create({
      data: {
        name,
        birthday: new Date(birthday),
        email,
        profileUserId,
        userId: user.id,
      },
    });

    const allWishes = [
      wishes,
    ].filter(Boolean).join("\n");

    if (allWishes) {
      await prisma.note.create({
        data: { content: `🎁 Gift wishes: ${allWishes}`, personId: person.id },
      });
    }

    created = true;
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  if (created) {
    revalidatePath("/dashboard");
    redirect(`/submit/${token}?success=1`);
  }
  return {};
}
