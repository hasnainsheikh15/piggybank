import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended : true ,limit : "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import the routes
import userRouter from "./routes/user.routes.js";

// use the routes 

app.use("/api/v1/pb/users",userRouter)

export { app }; 