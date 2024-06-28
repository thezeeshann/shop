"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

const Socials = () => {
  return (
    <div>
      <Button
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        Sign in Google
      </Button>
    </div>
  );
};

export default Socials;
