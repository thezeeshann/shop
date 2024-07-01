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
import { resetSchema } from "@/lib/validations/reset";
import { reset } from "@/actions/reset-pasword";

const ResetForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { status, execute } = useAction(reset, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data.error);
      if (data.data?.success) setSuccess(data.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof resetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} type="email" />
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

export default ResetForm;
