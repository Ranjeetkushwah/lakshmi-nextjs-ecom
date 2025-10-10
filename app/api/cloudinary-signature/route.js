import cloudinary from "@/lib/cloudinary";
import { catchError, response1 } from "@/lib/helperFunction";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const payload = await request.json();
        const {paramsToSign} = payload;
        
        //generate signature 
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_SECRET_KEY)
        console.log("cloudinary-signature -payload", payload)
     
        return NextResponse.json({ signature })

    } catch (error) {
        return catchError(error)
    }
}