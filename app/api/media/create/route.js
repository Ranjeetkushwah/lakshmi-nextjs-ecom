import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response1 } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(request) {
    const payload = await request.json();
    try {
        const auth = await isAuthenticated('admin')
        console.log("auth", auth)
        if (!auth.isAuth) {
            return response1(false, 403, "Unauthorized.")
        }

        await connectDB();
        const newMedia = await MediaModel.insertMany(payload);
        return response1(true, 200, 'Media uploaded successfully', newMedia)

    } catch (error) {
        if (payload && payload.length > 0) {
            const publicIds = payload.map(data => data.public_id)
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return catchError(error)
    }
}