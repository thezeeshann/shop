"use server";
import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const doamin = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${doamin}/auth/new-verification?token=${token}`;
  console.log(confirmLink)
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Hello world", 
    html: `<p>Click to ${confirmLink} confirm email</p>`,
  });

  if (error) return error;
  if (data) return data;
};


export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${doamin}/auth/new-password?token=${token}`;
  console.log(confirmLink)
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Hello world", 
    html: `<p>Click to ${confirmLink} reset your password</p>`,
  });

  if (error) return error;
  if (data) return data;
};
