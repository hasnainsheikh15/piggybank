import mongoose from "mongoose";

const otpStoreSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true },
  },
  { timestamps: true }
);

otpStoreSchema.index({ email: 1 }, { unique: true });

export const OtpStore = mongoose.model("OtpStore", otpStoreSchema);
