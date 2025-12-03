import dotenv from "dotenv";
dotenv.config();
import { Cashfree } from "cashfree-pg";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const cashfree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
)



const depositMoney = asyncHandler(async(req,res) => {
        const {amount} = req.body;

        if(!amount || amount <= 0) {
         throw new ApiError(401,"Valid Amount is needed")
        }

        const orderId = "order_" + Date.now()
        
        const request = {
            "order_id" : orderId,
            "order_currency" : "INR",
            "order_amount" : amount,
            "customer_details" : {
                "customer_name" : req.user.name,
                "customer_id" : req.user._id,
                "customer_phone" : "9999999999"
            }
            ,
            "order_meta" : {
                "return_url":  `http://localhost:3000/api/payment/return?order_id=${orderId}`,
                "payment_methods": "cc,dc,upi"
            }

        }

        let response;
        try {
            response = await cashfree.PGCreateOrder(request)
        } catch (error) {
            console.log("Cashfree Error:",error.response?.data || error)
            throw new ApiError(
                error.response?.status || 500,
                error.response?.data?.message || "Error creating the order"
            )
        }

        return res.status(200).json(
            new ApiResponse(200, "Order created successfully",{
                orderId,
                paymentSessionId : response.data.payment_session_id
            })
        )
})

export {depositMoney}