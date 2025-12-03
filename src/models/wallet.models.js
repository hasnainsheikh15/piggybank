import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
    }
}, { timestamps: true })

walletSchema.methods.deposit = function(amount) {
    this.balance += amount;
    return this.save();
}

walletSchema.methods.withdraw = function(amount) {
    if(amount > this.balance) {
        throw new Error("Insufficient balance");
    }
    this.balance -= amount;
    return this.save();
}


walletSchema.statics.getWalletByGoalId = function(goalId) {
    return this.findOne({goal : goalId})
}

walletSchema.index({user : 1});
walletSchema.index({goal : 1});
export const Wallet = mongoose.model("Wallet", walletSchema);