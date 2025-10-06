import { emailVerificationLink } from "@/email/emailVerification";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response1 } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();

        const validationSchema = zSchema.pick({ email : true })
            .extend({
                password: z.string()
            })

        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response1(false, 401, 'invalid data or missing fields', validatedData.error)
        }
        const { email, password } = validatedData.data

        //get user data
        const getUser = await UserModel.findOne({ email, deletedAt: null }).select('+password')
        if (!getUser) {
            return response1(false, 404, "Invalid user credentials")
        }

        // resend verification email if not verified
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const token = await new SignJWT({ userId: getUser._id.toString() })
                .setIssuedAt()
                .setExpirationTime('1h')
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret)

            await sendMail('Email Verification request from Developer Ranjeet',
                email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
            )

        return response1(false, 401, "email is not verified, verification email link sent again to your registered email address" )
        }

        // verify password
        const isPasswordValid = await getUser.comparePasswords(password)
        if (!isPasswordValid) {
            return response1(false, 400, "Invalid user credentials")
        }

        //otp generation 
        await OTPModel.deleteMany({email}) //delete old otp for this email

        const otp = generateOTP()

        //store otp in db
        const newOtpData = new OTPModel({email,otp})
        await newOtpData.save();

        const otpEmailStatus = await sendMail("Your login verification code", email, otpEmail(otp))
        if(!otpEmailStatus.success){
              return response1(false, 401, "Failed to send OTP, please try again")
        }
         return response1(true, 200, "Please verify your device by entering the otp sent to your email")

    } catch (error) {
        return catchError(error)
    }
}