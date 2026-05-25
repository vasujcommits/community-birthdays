import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: "Community Birthdays <onboarding@resend.dev>",
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; color: #000;">
        <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 32px;">
          Community Birthdays
        </p>
        <h1 style="font-size: 28px; font-weight: 300; margin: 0 0 16px;">Reset your password</h1>
        <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 32px;">
          Click the button below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; font-size: 13px; font-weight: 500; letter-spacing: 0.1em;
                  text-transform: uppercase; border: 1px solid #000; padding: 12px 32px;
                  text-decoration: none; color: #000;">
          Reset password →
        </a>
        <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
