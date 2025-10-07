import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response1 } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({email: true })
        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response1(false, 401, "Invalid or missing input fields", validatedData.error)
        }

        const { email } = validatedData.data;

        //check user is exsist
        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
        if (!getUser) {
            return response1(false, 404, "User not found")
        }

        //remove old otps 
        await OTPModel.deleteMany({ email })
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email, otp
        })

        await newOtpData.save()

        const otpSendStatus = await sendMail("Your login verfication code.", email, otpEmail(otp))
        if (!otpSendStatus.success) {
            return response1(false, 400, 'Failed to resend otp.')
        }

        return response1(true, 200, 'Please verify your device.')

    } catch (error) {
        catchError(error)
    }
}