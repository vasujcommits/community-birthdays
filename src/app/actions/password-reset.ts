"use server";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

export async function requestPasswordReset(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "Please enter your email address." };

  const user = await prisma.user.findUnique({ where: { email } });

  // Always show success to prevent email enumeration
  if (!user || !user.password) {
    return { success: true };
  }

  // Delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expires },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
  await sendPasswordResetEmail(email, resetUrl);

  return { success: true };
}

export async function resetPassword(
  token: string,
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirm)
    return { error: "Passwords don't match." };

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record || record.expires < new Date()) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  redirect("/login?reset=1");
}
