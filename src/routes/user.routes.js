import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken,  resendOtp,  sendSignUpOtp , verifyOtp } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/send-signup-otp", sendSignUpOtp)
userRouter.post("/resend-otp",resendOtp)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)
userRouter.post("/refreshToken",refreshAccessToken)

export default userRouter