import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { OtpStore } from "../models/otpStore.models.js";
import sendOtpEmail from "../utils/emailOtp.js";
import ApiResponse from "../utils/ApiResponse.js";
import { RefreshToken } from "../models/refreshToken.models.js";
import crypto from "crypto";


const sendSignUpOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required to send OTP");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await OtpStore.findOneAndDelete({ email });

    await OtpStore.create({ email, otp, expiry })

    await sendOtpEmail(email, otp);

    return res.status(200).json(new ApiResponse(200, "OTP sent successfully to email", { email }));

})

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp, name, phone, dob, password } = req.body;

    if (!email || !otp || !name || !phone || !dob || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const otpData = await OtpStore.findOne({ email });

    if (!otpData) {
        throw new ApiError(400, "No OTP request found for this email");
    }

    if (otpData.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (otpData.expiry < new Date()) {
        throw new ApiError(400, "OTP has expired");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        phone,
        dob,
        password,
        isEmailVerified: true
    })

    await OtpStore.findOneAndDelete({ email });

    return res.status(201).json(new ApiResponse(201, "User registered successfully", { userId: user._id }));

})

const generateAccessandRefreshToken = async (userId,req) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        await RefreshToken.create({
            user: user._id,
            hashToken: hashedToken,
            device: req.headers["user-agent"] || "Unknown Device",
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        return { accessToken, refreshToken };
    } catch (error) {

        if (error instanceof ApiError) {
            throw error;
        }
        console.error("Error generating tokens", error);
        throw new ApiError(500, "Error generating the refresh and access tokens");

    }

}

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id,req);

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, "User logged in successfully", {
            user: loggedInUser,
            accessToken,
            refreshToken
        }))
})

const logoutUser = asyncHandler(async (req,res) => {

    const token = req.cookies?.refreshToken;

    if(!token) {
        throw new ApiError(400,"Refresh token not found in cookies");
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex")

    await RefreshToken.findOneAndDelete({hashToken : hash})

    const options = {
        httpOnly : true,
        secure : true
    }
    res.status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,"User logged out successfully"))
})

const refreshAccessToken = asyncHandler (async (req,res) => {
    const token = req.cookies?.refreshToken;
    console.log("Refresh token from cookies:", token);
    if(!token) {
        throw new ApiError(400,"Refresh token not found in cookies");
    }

    const hash = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed refresh token:", hash);

    const storedToken = await RefreshToken.findOne({hashToken : hash});
    console.log("Stored token from database:", storedToken);
    if(!storedToken) { 
        throw new ApiError(401,"Invalid refresh token");
     }

    if(storedToken.expiresAt < new Date()) {
        await storedToken.deleteOne();
        throw new ApiError(401,"Refresh token has expired");
    }

    const user = await User.findById(storedToken.user);
    if(!user) {
        await storedToken.deleteOne();
        throw new ApiError(404,"User not found for this refresh token");
    }

    await storedToken.deleteOne();

    const {accessToken, refreshToken : newRefreshToken} = await generateAccessandRefreshToken (user._id,req);

    // const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    // await RefreshToken.create({
    //     user : user._id,
    //     hashToken : newHashedToken,
    //     device : req.headers["user-agent"] || "Unknown Device",
    //     ipAddress : req.ip,
    //     expiresAt : new Date(Date.now() + 7*24*60*60*1000),
    //     isRevoked : false

    // })

    const options = {
        httpOnly : true,
        secure : false   
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(new ApiResponse(200,"Access token refreshed successfully",{
        accessToken,
        refreshToken : newRefreshToken
    }))
    


})
export { sendSignUpOtp, verifyOtp , loginUser , logoutUser ,refreshAccessToken };