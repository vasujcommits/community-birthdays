"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

export async function createPerson(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const userId = await requireUser();

  const name = (formData.get("name") as string)?.trim();
  const birthday = formData.get("birthday") as string;
  const relationship = (formData.get("relationship") as string)?.trim() || null;

  if (!name) return { error: "Name is required." };
  if (!birthday) return { error: "Birthday is required." };

  let created = false;
  try {
    await prisma.person.create({
      data: { name, birthday: new Date(birthday), relationship, userId },
    });
    created = true;
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  if (created) {
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }
  return {};
}

export async function updatePerson(
  id: string,
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const userId = await requireUser();

  const name = (formData.get("name") as string)?.trim();
  const birthday = formData.get("birthday") as string;
  const relationship = (formData.get("relationship") as string)?.trim() || null;

  if (!name) return { error: "Name is required." };
  if (!birthday) return { error: "Birthday is required." };

  let updated = false;
  try {
    await prisma.person.update({
      where: { id, userId },
      data: { name, birthday: new Date(birthday), relationship },
    });
    updated = true;
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  if (updated) {
    revalidatePath("/dashboard");
    revalidatePath(`/people/${id}`);
    redirect(`/people/${id}`);
  }
  return {};
}

export async function deletePerson(formData: FormData) {
  const userId = await requireUser();
  const id = formData.get("id") as string;

  await prisma.person.delete({ where: { id, userId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
