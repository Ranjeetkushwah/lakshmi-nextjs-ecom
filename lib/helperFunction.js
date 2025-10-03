import { NextResponse } from "next/server";

export const response1 = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success, statusCode, message, data 
    })
}


export const catchError = (error, customMessage) => {
    if (error.name === 'CastError') {
        error.message = `Resource not found. Invalid: ${error.path}`
        error.code = 400
    }

    //handelling duplicate key error
    if (error.code === 11000) {
        const keys = Object.keys(error.keyValue)
        error.message = `Duplicate fields: ${keys}. These fields value must be unique.`
        error.code = 409
    }

    let errorObj = {}
    if (process.env.NODE_ENV === 'development') {
        errorObj = {
            message: error.message,
            error: error.stack
        }
    } else {
        errorObj = {
            message: customMessage || 'Internal Server Error',
        }
    }

    // Ensure we have a status code
    const statusCode = error.code || 500
    return response1(false, statusCode, errorObj.message, ...errorObj)
}