import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { createGoal, deleteGoal, getGoals } from "../controllers/goal.controller.js";
import { depositMoney } from "../controllers/payment.controller.js";



const goalRouter = Router()

goalRouter.post("/createGoal",verifyJWT,createGoal)
goalRouter.get("/getGoals",verifyJWT,getGoals)
goalRouter.delete("/deletGoal/:goalId",verifyJWT,deleteGoal)
goalRouter.post("/deposit",verifyJWT,depositMoney)

export default goalRouter