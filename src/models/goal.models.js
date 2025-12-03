import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

goalSchema.methods.isGoalAchieved = function() {
    return this.currentAmount >= this.targetAmount;
}

goalSchema.statics.getActiveGoals = function(userId) {
    return this.find({user : userId , status : "active"});
}

goalSchema.index({user : 1})

// for pagination of the goal list
goalSchema.plugin(mongoosePaginate)


export const Goal = mongoose.model("Goal", goalSchema)