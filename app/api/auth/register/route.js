import { emailVerificationLink } from "@/email/emailVerification";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function POST(request){
    try {
        await connectDB()
        const validationSchema= zSchema.pick({
            name:true, email:true, password:true 
        }) 
        const payload = await request.json()
        const validatedData=validationSchema.safeParse(payload)

        if(!validatedData.success){
            return response(false, 401, 'Invalid or missing input field.', validatedData.error)
        }
        // check already registered users
        const checkUser = await UserModel.exists({email})
        if (checkUser){
            return response(true, 409, 'User already registered.')
        }
        // new registration 
        const NewRegistration = new UserModel({
            name, email, password 
        })

        await NewRegistration.save()

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)

        const token = await new SignJWT({userId:NewRegistration._id})
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({alg:'HS256'})
        .sign(secret)

        await sendMail('Email Verification request form  Developer Ranjeet',
            email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`)
        )
 
        return response(true, 200, 'Registration success, please verify your email address.')

    } catch (error) {
        
    }
}