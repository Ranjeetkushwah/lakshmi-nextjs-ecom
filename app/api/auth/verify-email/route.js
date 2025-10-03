import { connectDB } from "@/lib/databaseConnection";
import { catchError, response1 } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request){
    try {
        await connectDB()
        const{token}= await request.json()
        if (!token){
            return response1(false, 400,'Token is missing.')
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const decoded = await jwtVerify(token, secret)
        const userId = decoded.payload.userId
        if(!isValidObjectId(userId)){
            return response1(false, 400,'Invalid user id', userId)
        }

        const user = await UserModel.findById(userId)
        if(!user){
            return response1(false, 400,"user not found")
        }
        user.isEmailVerified = true
        await user.save()

        return response1(true, 200,"Email is verified successfully.")

    } catch (error) {
        return catchError(error)        
    }

}