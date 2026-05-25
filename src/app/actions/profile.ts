"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Not authenticated." };

  const birthday = formData.get("birthday") as string;
  const wishes = (formData.get("wishes") as string)?.trim() || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      birthday: birthday ? new Date(birthday) : null,
      wishes,
    },
  });

  // Cascade birthday/wishes to all Person records that link to this user
  if (birthday || wishes !== null) {
    const linkedPeople = await prisma.person.findMany({
      where: { profileUserId: session.user.id },
    });

    for (const p of linkedPeople) {
      await prisma.person.update({
        where: { id: p.id },
        data: {
          birthday: birthday ? new Date(birthday) : p.birthday,
          ...(wishes !== null && { /* wishes live on User, not Person */ }),
        },
      });
    }
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true };
}
