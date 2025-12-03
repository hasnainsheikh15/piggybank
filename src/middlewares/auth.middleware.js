import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req,_,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token) {
        throw new ApiError(401,"Unauthorized request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken.userId).select("-password")

    if(!user) {
        throw new ApiError(401,"Unauthorized request")
    }

    req.user = user
    next();
})

export default verifyJWT