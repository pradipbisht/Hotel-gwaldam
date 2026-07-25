import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : undefined;

export async function sendEmailOtp(params: {
  to: string;
  otp: string;
  type:
    | "email-verification"
    | "sign-in"
    | "forget-password"
    | "change-email";
}) {
  const { to, otp, type } = params;

  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email provider not configured");
    }

    console.info(`[dev:email-otp] to=${to} type=${type} otp=${otp}`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Hotel Booking code (${type})`,
    text: `Your code is ${otp}. Expires in 10 minutes.`,
  });
}
