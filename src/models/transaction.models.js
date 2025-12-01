import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["credit", "deposit"]
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }


}, { timestamps: true })

export const Transaction = mongoose.model("Transaction", transactionSchema);