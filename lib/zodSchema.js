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
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })  
})
