"use client";
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zSchema } from '@/lib/zodSchema'
import { FaRegEyeSlash } from "react-icons/fa"
import { FaRegEye } from "react-icons/fa6"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'
import z  from 'zod'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/routes/WedsitePanelRoutes'

const UpdatePassword = ({ email }) => {

    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

    const formSchema = zSchema.pick({
     email:true, password: true
    }).extend({
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Password and confirm password must be same.',
        path: ['confirmPassword']
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email:email,
            password: '',
            confirmPassword: '',
        }
    })

    const handleUpdatePassword = async (values) => {
        try {
            setLoading(true);
            const { data: updatePasswordResponse } = await axios.patch('/api/auth/reset-password/update-password', values)
            if (!updatePasswordResponse.success) {
                throw new Error(updatePasswordResponse.message)
            }
            form.reset()
            showToast("success", updatePasswordResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast("error", error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
            <>
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold'>Update Password</h1>
                    <p>Create new password by filling out the form below</p>
                    <div className='mt-3'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdatePassword)} className='space-y-8'>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="enter your password" {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >
                                    </FormField>
                                </div>
                                <div className='mb-5'>
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className='relative'>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type={showPassword ? "password" : "text"} placeholder="enter your confirm password" {...field} />
                                                </FormControl>
                                                <button type="button" className='absolute top-8 right-2 cursor-pointer'>
                                                    {showPassword ? <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} /> : <FaRegEye onClick={() => setShowPassword(!showPassword)} />}
                                                </button>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    >
                                    </FormField>
                                </div>
                                <div className='mb-3'>
                                    <ButtonLoading type="submit" text="Update Password" loading={loading} className="w-full cursor-pointer" />
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </>
    )
}

export default UpdatePassword;