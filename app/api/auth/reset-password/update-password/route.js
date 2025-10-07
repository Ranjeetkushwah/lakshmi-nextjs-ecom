import { connectDB } from "@/lib/databaseConnection";
import { catchError, response1 } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PATCH(request) {
    try {
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({ email: true, password: true });
        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response1(false, 401, "Invalid or missing input fields ", validatedData.error)
        }

        const { email, password } = validatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")
        if (!getUser) {
            return response1(false, 404, "User not found")
        }
         getUser.password = password
        await getUser.save()

        return response1(true, 200, "Password updated successfull")
        
    } catch (error) {
        catchError(error)
    }
}