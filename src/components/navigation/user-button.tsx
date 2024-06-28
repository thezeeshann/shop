"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const UserButton = ({ user }: Session) => {
  return (
    <div>
      <p>{user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default UserButton;
