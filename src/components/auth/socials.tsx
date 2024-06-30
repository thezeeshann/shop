"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

const Socials = () => {
  return (
    <Button
      className="w-full"
      variant={"outline"}
      size={"sm"}
      onClick={() =>
        signIn("google", {
          redirect: false,
          callbackUrl: "/",
        })
      }
    >
      <div className="flex flex-row gap-x-1 items-center">
        <p>Sign in Google</p>
        <FcGoogle className="w-5 h-5" />
      </div>
    </Button>
  );
};

export default Socials;
