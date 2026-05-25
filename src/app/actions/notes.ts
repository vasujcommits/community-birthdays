"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function addNote(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const userId = await requireUser();
  if (!userId) return { error: "Not authenticated." };

  const personId = formData.get("personId") as string;
  const content = (formData.get("content") as string)?.trim();

  if (!content) return { error: "Note cannot be empty." };

  const person = await prisma.person.findFirst({ where: { id: personId, userId } });
  if (!person) return { error: "Person not found." };

  await prisma.note.create({ data: { content, personId } });

  revalidatePath(`/people/${personId}`);
  return {};
}

export async function deleteNote(formData: FormData) {
  const userId = await requireUser();
  if (!userId) return;

  const noteId = formData.get("noteId") as string;
  const personId = formData.get("personId") as string;

  await prisma.note.delete({
    where: { id: noteId, person: { userId } },
  });

  revalidatePath(`/people/${personId}`);
}
