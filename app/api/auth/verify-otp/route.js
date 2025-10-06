import { connectDB } from "@/lib/databaseConnection";
import { catchError, response1 } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";


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

        const loggedInUserData ={
            _id: getUser._id,
            role:getUser.role,
            name:getUser.name,
            avatar:getUser.avatar,
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const token = await new SignJWT(loggedInUserData)
        .setIssuedAt()
        .setExpirationTime('24h')
        .setProtectedHeader({alg:'HS256'})
        .sign(secret)

        const cookieStore = await cookies()

        cookieStore.set({
            name:'access_token',
            value:token,
            httpOnly: process.env.NODE_ENV === "production",
            path:'/',
            secure: process.env.NODE_ENV === "production",
            sameSite:'lax',
        })

        //remove otp after validation
        await getOtpData.deleteOne()

        return response1(true, 200, "Login successful",loggedInUserData);
     
    } catch (error) {
        return catchError(error)
    }

}