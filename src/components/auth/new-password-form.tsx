"use client";

import React, { useState } from "react";
import AuthCard from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import Link from "next/link";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { newPasswordSchema } from "@/lib/validations/password";
import { newPassword } from "@/actions/password";
import { useSearchParams } from "next/navigation";

const NewPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { status, execute } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    execute({...values,token});
  };

  return (
    <AuthCard
      cardTitle="Enter a new passwrod!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormSuccess message={success} />
              <FormError message={error} />

              <Button size={"sm"} className="px-0" variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              size={"sm"}
              className={cn(
                "w-full my-4",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default NewPasswordForm;
