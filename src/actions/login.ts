"use server";

import prisma from "@/lib/db";
import { loginSchema } from "@/lib/validations/login";
import { createSafeActionClient } from "next-safe-action";
import { generateEmailVerificationToken } from "./token";
import { sendVerificationEmail } from "./email";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existUser = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (existUser?.email !== email) {
        return {
          error: "Email not found",
        };
      }

      if (!existUser?.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existUser.email
        );
        const { token, email } = verificationToken;
        await sendVerificationEmail(email, token);
        return {
          success: "Confirmation email send",
        };
      }

      const passwordMatch = await bcrypt.compare(password, existUser.password);
      if (!passwordMatch) {
        return {
          error: "Email or Password Incorrect",
        };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "User Signed In!" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: error.message };
        }
      }
      throw error;
    }
  });
