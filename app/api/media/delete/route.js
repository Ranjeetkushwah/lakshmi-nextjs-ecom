import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response1 } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

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

        if (!['SD', 'RSD'].includes(deleteType)) {
            return response1(false, 400, "Invalid deleteType. Use 'SD' for soft delete or 'RSD' for restore soft delete.")
        }

        if (deleteType === 'SD') {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: new Date().toISOString() } })
        } else {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deletedAt: null } })
        }

        return response1(true, 200, deleteType === 'SD' ? "Media move to trash successfully." : "Media restored successfully.");

    } catch (error) {
        return catchError(error)
    }
}


export async function DELETE(request) {

    const session = await mongoose.startSession();
    session.startTransaction();

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

        const media = await MediaModel.find({ _id: { $in: ids } }).session(session).lean()
        if (!media.length) {
            return response1(false, 404, "No media found for the provided ids.")
        }

        if (!deleteType === 'PD') {
            return response1(false, 400, "Invalid deleteType. Use 'PD' for permanent delete.")
        }

        await MediaModel.deleteMany({ _id: { $in: ids } }).session(session)

        //delete all media form cloudinary
        const publicIds = media.map(m => m.public_id)

        try {
            await cloudinary.api.delete_resources(publicIds)
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
        }

        await session.commitTransaction();
        session.endSession();

        return response1(true, 200, "Media deleted permanently successfully.")
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return catchError(error)
    }
}