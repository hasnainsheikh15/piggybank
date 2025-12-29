import { Router } from "express";
import { getUserData } from "../controllers/dashboard.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/getUserData",verifyJWT,getUserData)

export default dashboardRouter;
