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



const depositMoney = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { goalId } = req.params;
    const { amount } = req.body;




    if (!amount || amount <= 0) {
        throw new ApiError(401, "Valid Amount is needed")
    }

    const goal = await Goal.findOne({ _id: goalId, user: userId })

    if (!goal) throw new ApiError(404, "Goal not found");

    const wallet = await Wallet.findOne({ goal: goalId })
    if (!wallet) {
        throw new ApiError(404, "No wallet found for this Goal")
    }

    const orderId = "order_" + Date.now()

    const request = {
        "order_id": orderId,
        "order_currency": "INR",
        "order_amount": amount,
        "customer_details": {
            "customer_name": req.user.name,
            "customer_id": userId.toString(),
            "customer_phone": "9999999999",
            "customer_email": req.user?.email
        }
        ,
        "order_meta": {
            "return_url": `http://localhost:3000/api/payment/return?order_id=${orderId}`,
            "notify_url": "https://cbeca72d34e8.ngrok-free.app/api/payment/webhook",
            "payment_methods": "cc,dc,upi"
        }

    }

    let response;
    try {
        response = await cashfree.PGCreateOrder(request)
    } catch (error) {
        console.log("Cashfree Error:", error.response?.data || error)
        throw new ApiError(
            error.response?.status || 500,
            error.response?.data?.message || "Error creating the order"
        )
    }

    const paymentSessionId = response.data.payment_session_id

    await Transaction.create({
        user: userId,
        wallet: wallet._id,
        goal: goalId,
        transactionId: "txn" + Date.now(),
        type: "deposit",
        amount,
        status: "pending",
        description: `Transaction for the gaol : ${goal.title}`,
        date: Date.now(),
        orderId
    })
    return res.status(200).json(
        new ApiResponse(200, "Order created successfully", {
            orderId,
            paymentSessionId
        })
    )
})

const cashfreeWebhook = asyncHandler(async (req, res) => {
    const event = req.body;

    //   console.log("Webhook Received:", JSON.stringify(event, null, 2));

    const eventType = event?.type;
    const orderId = event?.data?.order?.order_id;
    const paymentStatus = event?.data?.payment?.payment_status;
    const amountRaw = event?.data?.order?.order_amount;
    const amount = Number(amountRaw);

    //   console.log("Parsed webhook =>", {
    //     eventType,
    //     orderId,
    //     paymentStatus,
    //     amountRaw,
    //     amountType: typeof amount,
    //   });

    // 1: Only process PAYMENT_SUCCESS_WEBHOOK
    if (eventType !== "PAYMENT_SUCCESS_WEBHOOK") {
        console.log("Skipping event because type is not PAYMENT_SUCCESS_WEBHOOK:", eventType);
        return res.status(200).json({ message: "Ignored: not success event type" });
    }

    // 2: Only process SUCCESS status
    if (paymentStatus !== "SUCCESS") {
        console.log("Skipping event because paymentStatus is not SUCCESS:", paymentStatus);
        return res.status(200).json({ message: "Ignored: status not success" });
    }

    if (!orderId) {
        console.log("Missing orderId in webhook");
        return res.status(200).json({ message: "Missing order id" });
    }

    //   console.log("Finding pending transaction for order:", orderId);

    // 3: ATOMICALLY mark transaction as completed (idempotent)
    const trx = await Transaction.findOneAndUpdate(
        { orderId, status: "pending" },
        { status: "completed" },
        { new: true }
    );

    //   console.log("Transaction matched & updated:", trx);

    // If trx is null → nothing pending → already processed or wrong orderId
    if (!trx) {
        console.log("No pending transaction found for order:", orderId);
        return res.status(200).json({ message: "Already processed or no pending transaction" });
    }

    // 4: Update wallet & goal ONLY ONCE
    //   console.log("Updating wallet and goal for trx:", {
    //     trxId: trx._id,
    //     walletId: trx.wallet,
    //     goalId: trx.goal,
    //     amount,
    //   });

    const walletBefore = await Wallet.findById(trx.wallet);
    //   console.log("Wallet before update:", walletBefore && walletBefore.balance);

    const walletAfter = await Wallet.findByIdAndUpdate(
        trx.wallet,
        { $inc: { balance: amount } },
        { new: true }
    );
    //   console.log("Wallet after update:", walletAfter && walletAfter.balance);

    //   const goalBefore = await Goal.findById(trx.goal);
    //   console.log("Goal currentAmount before update:", goalBefore && goalBefore.currentAmount);

    const goalAfter = await Goal.findByIdAndUpdate(
        trx.goal,
        { $inc: { currentAmount: amount } },
        { new: true }
    );
    //   console.log("Goal currentAmount after update:", goalAfter && goalAfter.currentAmount);

    return res.status(200).json({ message: "Processed successfully" });
});


export { depositMoney, cashfreeWebhook }