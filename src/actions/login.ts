"use server";

import prisma from "@/lib/db";
import { loginSchema } from "@/lib/validations/login";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {

    const existUser = await prisma.user.findFirst({
      where:{
        email:email 
      }
    })

    if(existUser?.email !== email){
      return {
        error:"Email not found"
      }
    }

    console.log(email, password);
  });
