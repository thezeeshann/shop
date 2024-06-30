import React from "react";
import { auth } from "@/lib/auth";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import Logo from "./logo";

const nav = async () => {
  const session = await auth();

  return (
    <header className="py-4">
      <nav>
        <ul className="items-center  flex flex-row justify-between">
          <li>
          <Link href="/" >
            <Logo/>
          </Link>
          </li>
          {!session ? (
            <Button asChild size={"sm"}>
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
