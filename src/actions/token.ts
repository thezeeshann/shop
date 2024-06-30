"use server"

import prisma from "@/lib/db";

export const getVerficatonTokenByEmail = async (token: string) => {
  try {
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token:token
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
