"use client";

import React, { useState } from "react";
import AuthCard from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "@/lib/validations/register";
import { z } from "zod";
import { Button } from "../ui/button";
import { Link } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { emailRegister } from "@/actions/register";
import { cn } from "@/lib/utils";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { status, execute } = useAction(emailRegister, {
    onSuccess(data) {
      if (data.data?.error) setError(data.data?.error);
      if (data.data?.success) setSuccess(data.data?.success);
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Create an account"
      backButtonHref="/auth/login"
      backButtonLabel="Alredy have an account? Login Here"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} type="text" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forgot password</Link>
              </Button>
            </div>
            {/* <Button size={"sm"} className="w-full" type="submit">
              Register
            </Button> */}
              <Button
              type="submit"
              className={cn(
                "w-full",
                status === "executing" ? "animate-pulse" : ""
              )}
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default RegisterForm;
