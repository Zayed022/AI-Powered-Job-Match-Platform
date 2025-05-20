import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req,_res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        //console.log(token)
        if(!token) {
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access Token")
    }
})

export const verifyJWTAdmin = asyncHandler(async(req,_res,next)=>{
    try {
        //console.log(req.cookies)
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        //console.log(token)
        if(!token) {
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
        if(!admin){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.admin=admin;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message||"Invalid access Token")
    }
})

