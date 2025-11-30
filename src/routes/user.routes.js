import { Router } from "express";
import { sendSignUpOtp, verifyOtp } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/sendSignUpOtp", sendSignUpOtp)
userRouter.post("/verifyOtp", verifyOtp)

export default userRouter