import {z} from 'zod';

export const zSchema = z.object({
    email:z
    .string()
    .email({message:"Invalid email address"}),
    
    password:z
    .string()
    .min(6,{message:"Password must be at least 6 characters long"})
    .max(64,{message:"Password must be at most 64 characters long"})
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }),
    
    name:z
    .string()
    .min(2, {message:"Name must be at least 2 character"})
    .max(50,{message:"Name must be at most 50 character"})
    .regex(/^[a-zA-Z\s]+$/, {message:"Name can only contain letters and spaces"}),

    otp: z.string().regex(/^\d{6}$/,{
        message: "OTP must be a 6-digit number",
    })
})
