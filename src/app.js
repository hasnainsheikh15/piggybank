import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended : true ,limit : "20kb"}))
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser())
app.use(cors())


//import the routes
import userRouter from "./routes/user.routes.js";
import goalRouter from "./routes/goal.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// use the routes 

app.use("/api/v1/pb/users",userRouter)
app.use("/api/v1/pb/goal",goalRouter)
app.use("/api/payment",paymentRouter)
app.use("/api/dashboard",dashboardRouter)


// app.post("/payment/callback", (req,res) => {
//     return res.send("Payment completed, you can close this tab..")
// })

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./public" });
});
export { app }; 