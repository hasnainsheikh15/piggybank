import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    userData: {
        name: { type: String },
        phone: { type: String },
        dob: { type: String },
        password: { type: String }   // hashed later by User model or stored raw and hashed on create
    }
}, { timestamps: true });

export const OtpStore = mongoose.model("OtpStore", otpSchema);
