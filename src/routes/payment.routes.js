import { Router } from "express";
import { cashfreeWebhook } from "../controllers/payment.controller.js";
import express from "express"

const paymentRouter = Router();

paymentRouter.get("/return",(req,res) => {
    console.log("FULL QUERY:", req.query);
    const {order_id} = req.query;

    res.send(
        `<h2>Payment Successful</h2>
        <p> OrderID : ${order_id}</p>`
    )
})

paymentRouter.post("/webhook",express.json(),cashfreeWebhook)

export default paymentRouter