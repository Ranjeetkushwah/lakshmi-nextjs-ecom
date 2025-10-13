import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response1 } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function PUT(request) {
    try {
        const Auth = await isAuthenticated('admin')
        if (!Auth.isAuth) {
            return response1(false, 403, "Unauthorized Access")
        }
        await connectDB();
        const payload = await request.json();
        const ids = payload.ids || []
        const deleteType = payload.deleteType
        if (!Array.isArray(ids) || ids.length === 0) {
            return response1(false, 400, "Invalid or empty ids list provided.")
        }

        const media = await MediaModel.find({ _id: { $in: ids } }).lean()
        if (!media.length) {
            return response1(false, 404, "No media found for the provided ids.")
        }

        if(!['SD','RSD'].includes(deleteType)){
            return response1(false, 400, "Invalid deleteType. Use 'SD' for soft delete or 'RSD' for restore soft delete.")
        }

        if(deleteType==='SD'){
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        }else{
              await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }

    } catch (error) {
        return catchError(error)
    }
}