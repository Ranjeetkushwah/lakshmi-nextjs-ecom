import { NextResponse } from "next/server";

export const response =(success, statusCode, message , data={})=>{
    return NextResponse.json({
        success, statusCode, message, data 
    })
}