import { connectDB } from "@/lib/databaseConnection";
import { catchError, response1 } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json();
        const validationSchema = zSchema.pick({ otp: true, email: true })

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData) {
            return response1(false, 401, "Invalid or missing input field.", validatedData.error)
        }

        //get email and otp
        const { email, otp } = validatedData.data;

        const getOtpData = await OTPModel.findOne({ email, otp });
        if (!getOtpData) {
            return response1(false, 404, "Invalid or expire otp")
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean()
        if (!getUser) {
            return response1(false, 404, "user not found")
        }

        //remove old otp after validation
        await getOtpData.deleteOne()

        return response1(true, 200, "OTP verified");
     
    } catch (error) {
        return catchError(error)
    }

}