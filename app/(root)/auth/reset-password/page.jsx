"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black-ecom.png";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
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
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WedsitePanelRoutes";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import OTPVerification from "@/components/Application/OTPVerification";
import UpdatePassword from "@/components/Application/UpdatePassword";

function ResetPassword() {

  const [emailVerificationLoading, setEmailVerificatioLoading] = useState(false)
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const formSchema = zSchema.pick({ email: true })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  })

  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificatioLoading(true);
      const { data: sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp', values)
      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message)
      }
      setOtpEmail(values.email)
      showToast("success", sendOtpResponse.message)
    } catch (error) {
      showToast("error", error.message)
    } finally {
      setEmailVerificatioLoading(false)
    }

  }

  // otp verification 
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: verifyOtpResponse } = await axios.post('/api/auth/reset-password/verify-otp', values)
      if (!verifyOtpResponse.success) {
        throw new Error(verifyOtpResponse.message)
      }
      showToast("success", verifyOtpResponse.message)
      setIsOtpVerified(true)
    } catch (error) {
      showToast("error", error.message)
    } finally {
      setOtpVerificationLoading(false)
    }
  }

  return (
    <>
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
          {
            !otpEmail ?
              <>
                <div className="text-center">
                  <h1 className="text-2xl font-semibold">Reset Password</h1>
                  <p>Enter Your Email For Reset Password</p>
                  <div className="mt-3">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleEmailVerification)}
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
                        <div className="mb-3">
                          <ButtonLoading
                            type="submit"
                            text="Send OTP"
                            loading={emailVerificationLoading}
                            className="w-full cursor-pointer"
                          />
                        </div>
                        <div className="text-center">
                          <div className="flex justify-center items-center gap-1">
                            <Link
                              href={WEBSITE_LOGIN}
                              className="text-blue-500 hover:underline"
                            >
                              Back to login
                            </Link>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </>
              :
              <>
                {
                  !isOtpVerified ?
                    <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                    :
                    <UpdatePassword  email={otpEmail}/>
                }
              </>
          }
        </CardContent>
      </Card>
    </>
  )
}

export default ResetPassword