"use server";

import { createSafeActionClient } from "next-safe-action";
import { settingsSchema } from "@/lib/validations/settings";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action
  .schema(settingsSchema)
  .action(
    async ({
      parsedInput: {
        email,
        password,
        newPassword,
        isTwoFactorEnabled,
        name,
        image,
      },
    }) => {
      const user = await auth();
      if (!user) {
        return {
          error: "user not found",
        };
      }

      const dbUser = await prisma.user.findFirst({
        where: {
          id: user.user.id,
        },
      });
      if (!dbUser) {
        return {
          error: "user not found",
        };
      }

      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }

      if (password && newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
          return { error: "Password does not match" };
        }
        const samePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (samePassword) {
          return { error: "New password is the same as the old password" };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }

      await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          twoFactorEnabled: isTwoFactorEnabled,
          name: name,
          email: email,
          password: password,
          image: image,
        },
      });

      revalidatePath("/dashboard/settings");
      return { success: "Settings updated" };
    }
  );
