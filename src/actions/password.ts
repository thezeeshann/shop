"use server";
import { newPasswordSchema } from "@/lib/validations/password";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./token";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

const action = createSafeActionClient();

export const newPassword = action
  .schema(newPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    if (!token) {
      return {
        error: "Token is missing",
      };
    }
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return {
        error: "Token not found",
      };
    }
    const hashExpired = new Date(existingToken.expires) < new Date();
    if (hashExpired) {
      return {
        error: "Token has expires",
      };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: existingToken.email,
      },
    });

    if (!existingUser) {
      return {
        error: "User  not found",
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingUser.id },
        data: { password: hashPassword },
      });

      await tx.passwordResetToken.delete({
        where: { id: existingToken.id },
      });
    });

    return {
      success: "password updated",
    };
  });
