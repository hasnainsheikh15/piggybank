import { Router } from "express";

const paymentRouter = Router();

paymentRouter.get("/return",(req,res) => {
    console.log("FULL QUERY:", req.query);
    const {order_id} = req.query;

    res.send(
        `<h2>Payment Successful</h2>
        <p> OrderID : ${order_id}</p>`
    )
})

export default paymentRouter