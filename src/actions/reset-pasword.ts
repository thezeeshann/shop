"use server";

import { resetSchema } from "@/lib/validations/reset";
import { createSafeActionClient } from "next-safe-action";
import { generatePasswordResetToken } from "./token";
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from "./email";

const action = createSafeActionClient();

export const reset = action
  .schema(resetSchema)
  .action(async ({ parsedInput: { email } }) => {
    if (!email) {
      return {
        error: "Email is missing",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return {
        error: "User not found",
      };
    }

    const passwordRestToken = await generatePasswordResetToken(email);
    const { email: tokenEmail, token } = passwordRestToken;
    await sendPasswordResetEmail(tokenEmail, token);

    return {
      success: "Reset email send",
    };
  });
