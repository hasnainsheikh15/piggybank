import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended : true ,limit : "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import the routes
import userRouter from "./routes/user.routes.js";
import goalRouter from "./routes/goal.routes.js";
import paymentRouter from "./routes/payment.routes.js";

// use the routes 

app.use("/api/v1/pb/users",userRouter)
app.use("/api/v1/pb/goal",goalRouter)
app.use("/api/payment",paymentRouter)

app.post("/payment/callback", (req,res) => {
    return res.send("Payment completed, you can close this tab..")
})
export { app }; 