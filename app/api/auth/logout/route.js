import { connectDB } from "@/lib/databaseConnection";
import { catchError, response1 } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request){
    try {
        await connectDB();
        //get cookies
        const cookieStore = await cookies();
        cookieStore.delete('access_token')
        return response1(true,200,'Logout successfully')
    } catch (error) {
        catchError(error)
    }
}