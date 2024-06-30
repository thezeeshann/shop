"use server";

import prisma from "@/lib/db";
import { createSafeActionClient } from "next-safe-action";
import { registerSchema } from "@/lib/validations/register";
import bcrypt from "bcrypt";
import { generateEmailVerificationToken } from "./token";
import { sendVerificationEmail } from "./email";

const action = createSafeActionClient();

export const emailRegister = action
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existUser) {
      if (!existUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        const { email: tokenEmail, token } = verificationToken;
        await sendVerificationEmail(tokenEmail, token);
        return { success: "Email Confirmation resent" };
      }
      return {
        error: "Email alredy used",
      };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateEmailVerificationToken(email);
    const { email: tokenEmail, token } = verificationToken;
    await sendVerificationEmail(tokenEmail, token);

    return { success: "Confirmation Email Sent!" };
  });
