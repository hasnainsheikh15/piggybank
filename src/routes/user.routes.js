import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, sendSignUpOtp, verifyOtp } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/sendSignUpOtp", sendSignUpOtp)
userRouter.post("/verifyOtp", verifyOtp)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logoutUser)
userRouter.post("/refreshToken",refreshAccessToken)

export default userRouter