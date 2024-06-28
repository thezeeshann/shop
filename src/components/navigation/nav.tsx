import React from "react";
import { auth } from "@/lib/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import Logo from "@/public/logo.svg";

const nav = async () => {
  const session = await auth();

  return (
    <header>
      <nav>
        <ul className="border-2 border-red-500 flex flex-row justify-between">
          <li>Logo</li>
          {!session ? (
            <Button asChild>
              <Link href="/auth/login">
                {" "}
                <span>Login</span>
              </Link>
            </Button>
          ) : (
            <li>
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default nav;
