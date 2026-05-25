"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signUp(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "All fields are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists." };

  const hashed = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({ data: { name, email, password: hashed } });

  // Auto-link any Person records that used this email (e.g. imported contacts)
  await prisma.person.updateMany({
    where: { email, profileUserId: null },
    data: { profileUserId: newUser.id },
  });

  redirect("/login?welcome=1");
}
