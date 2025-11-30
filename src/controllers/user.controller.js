import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { OtpStore } from "../models/otpStore.models.js";
import sendOtpEmail from "../utils/emailOtp.js";
import ApiResponse from "../utils/ApiResponse.js";


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

export { sendSignUpOtp, verifyOtp };