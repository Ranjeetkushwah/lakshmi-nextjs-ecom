import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response1 } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { generalDecrypt } from "jose";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json();
        const validationSchema = zSchema.pick({email:true})
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response1(false,401,"Invalid or missing fields")
        }

        const {email} = validatedData.data
        
        const getUser = await UserModel.findOne({email})
        if(!getUser){
            return response1(false, 404,"User not found")
        }

        //remove old otps 
        await OTPModel.deleteMany({email})
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email, otp
        })

        await newOtpData.save()

        const otpSendStatus = await sendMail("Your login verfication code.",email, otpEmail(otp))
        if(!otpSendStatus.success){
            return response1(false, 400, 'Failed to resend otp.')
        }

          return response1(true, 200, 'OTP Resend Successfully.')

    } catch (error) {
        return catchError(error)  
    }
    
}