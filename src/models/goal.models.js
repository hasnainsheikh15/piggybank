import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },

    targetAmount: {
        type: Number,
        required: true,
        min: 1
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "completed", "cancelled"],
        default: "active"
    },

    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true
    }
}, { timestamps: true })

export const Goal = mongoose.model("Goal", goalSchema)