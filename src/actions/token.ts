"use server";

import prisma from "@/lib/db";
import { PasswordResetToken } from "@prisma/client";
import crypto from "crypto";

export const getVerficatonTokenByEmail = async (token: string) => {
  try {
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token: token,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerficatonTokenByEmail(email);

  if (existingToken) {
    await prisma.emailVerificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const verifiyEmailToken = async (token: string) => {
  const existingToken = await getVerficatonTokenByEmail(token);
  if (!existingToken) {
    return {
      error: "Token not found",
    };
  }
  const hashExpired = new Date(existingToken.expires) < new Date();
  if (hashExpired) return { error: "Token has expired" };

  const existingUser = await prisma.user.findFirst({
    where: {
      email: existingToken.email,
    },
  });
  if (!existingUser) return { error: "Email does not exist" };

  await prisma.user.update({
    where: {
      email: existingUser.email,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.emailVerificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified successfully" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });
    return passwordResetToken;
  } catch (error) {
    return {
      error: "Token not found",
    };
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });

    return passwordResetToken;
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const generatePasswordResetToken = async (
  email: string
): Promise<PasswordResetToken | Error> => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await prisma.passwordResetToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        email: email,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
      where: {
        token: token,
      },
    });

    return twoFactorToken;
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
      await prisma.twoFactorToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        email,
        expires,
        token,
        userId: user.id,
      },
    });
    return twoFactorToken;
  } catch (e) {
    return null;
  }
};
