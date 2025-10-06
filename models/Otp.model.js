import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expireAt:{
        type:Date,
        required:true,
        default: ()=> new Date(Date.now()+ 10*60*1000)
    }
},{timestamps:true})

otpSchema.index({expireAt:1},{expireAfterSeconds:0})

const OTPModel = mongoose.models.Otp || mongoose.model('Otp', otpSchema, 'otps')
export default OTPModel;


