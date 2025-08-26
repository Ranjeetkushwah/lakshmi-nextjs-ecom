"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black-ecom.png";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import z from "zod";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WedsitePanelRoutes";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().nonempty({ message: "Password is required" }),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (value) => {
    console.log("value of this is ", value);
  };

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo}
            width={Logo.width}
            height={Logo.height}
            alt="Logo_store"
            className="max-w-[150px]"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login into account</h1>
          <p>login into your account by filling out the form below</p>
          <div className="mt-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLoginSubmit)}
                className="space-y-8"
              >
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "password" : "text"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute top-1/2 right-2 cursor-pointer"
                        >
                          {showPassword ? (
                            <FaRegEyeSlash
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <FaRegEye
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )}
                        </button>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <div className="mb-3">
                  <ButtonLoading
                    type="submit"
                    text="Login"
                    loading={loading}
                    className="w-full cursor-pointer"
                  />
                </div>
                <div className="text-center">
                  <div className="flex justify-center items-center gap-1">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-blue-500 hover:underline"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link
                      href=""
                      className="mt-3 text-blue-500 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
