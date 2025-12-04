import dotenv from "dotenv";
dotenv.config();
import { Cashfree } from "cashfree-pg";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Goal } from "../models/goal.models.js";
import { Wallet } from "../models/wallet.models.js";
import { Transaction } from "../models/transaction.models.js";

const cashfree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
)



const depositMoney = asyncHandler(async(req,res) => {
        const userId = req.user._id;
        const {goalId} = req.params;
        const {amount} = req.body;
        

      

        if(!amount || amount <= 0) {
         throw new ApiError(401,"Valid Amount is needed")
        }

        const goal = await Goal.findOne({_id : goalId , user : userId})

        if(!goal) throw new ApiError(404,"Goal not found");

        const wallet = await Wallet.findOne({goal : goalId})
        if(!wallet) {
            throw new ApiError(404,"No wallet found for this Goal")
        }

        const orderId = "order_" + Date.now()
        
        const request = {
            "order_id" : orderId,
            "order_currency" : "INR",
            "order_amount" : amount,
            "customer_details" : {
                "customer_name" : req.user.name,
                "customer_id" : userId.toString(),
                "customer_phone" : "9999999999",
                "customer_email" : req.user?.email
            }
            ,
            "order_meta" : {
                "return_url":  `http://localhost:3000/api/payment/return?order_id=${orderId}`,
                "notify_url" : "https://bac457abf34e.ngrok-free.app/api/payment/webhook",
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

        const paymentSessionId = response.data.payment_session_id

        await Transaction.create({
            user : userId,
            wallet : wallet._id,
            goal : goalId,
            transactionId : "txn" + Date.now(),
            type : "deposit",
            amount,
            status : "pending",
            description : `Transaction for the gaol : ${goal.title}`,
            date : Date.now(),
            orderId 
        })
        return res.status(200).json(
            new ApiResponse(200, "Order created successfully",{
                orderId,
                paymentSessionId
            })
        )
})

const cashfreeWebhook = asyncHandler(async (req, res) => {
    const event = req.body;

    console.log("Webhook Received:", JSON.stringify(event, null, 2));

    const orderId = event?.data?.order?.order_id;
    const status = event?.data?.payment?.payment_status;
    const amount = event?.data?.order?.order_amount;

    if (!orderId) return res.status(400).send("Missing order_id");

    const trx = await Transaction.findOne({ orderId });

    if (!trx) return res.status(404).send("Transaction not found");

    // Payment failed
    if (status !== "SUCCESS") {
        trx.status = "failed";
        await trx.save();
        return res.status(200).send("OK");
    }

    // Payment succeeded → Update wallet
    await Wallet.findByIdAndUpdate(trx.wallet, {
        $inc: { balance: amount }
    });

    // Update goal progress
    await Goal.findByIdAndUpdate(trx.goal, {
        $inc: { currentAmount: amount }
    });

    // Mark transaction completed
    trx.status = "completed";
    await trx.save();

    return res.status(200).send("OK");
});

export {depositMoney , cashfreeWebhook}