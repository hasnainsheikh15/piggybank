import { Goal } from "../models/goal.models.js";
import { Wallet } from "../models/wallet.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createGoal = asyncHandler(async (req, res) => {
    const { title, targetAmount, dueDate } = req.body;

    if (!title || !targetAmount || !dueDate) {
        throw new ApiError(401, "All the fields are required")
    }

    if (targetAmount < 0) {
        throw new ApiError(401, "Target Amount cannot be Zero or should be greater than Zero")
    }

    if (new Date(dueDate) <= new Date()) {
        throw new ApiError(401, "Due date must be a future Date")
    }

    const wallet = await Wallet.create({
        user: req.user._id,
        balance: 0
    })

    const goal = await Goal.create({
        user: req.user._id,
        title,
        targetAmount,
        currentAmount: 0,
        dueDate,
        status: "active",
        wallet : wallet._id
    })

    wallet.goal = goal._id
    await wallet.save();


    return res.status(200).json(
        new ApiResponse(200, "Goal created Successfully", { goal, wallet })
    )

})

const getGoals = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit

    // this goal.find will return an array of the results
    const goals = await Goal.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("wallet")

    const totalGoals = await Goal.countDocuments({ user: req.user._id })

    return res.status(200).json(
        new ApiResponse(200, "Goals fetched successfully", {
            totalGoals,
            page,
            totalPages: Math.ceil(totalGoals / limit),
            goals

        })
    )
})

const deleteGoal = asyncHandler(async (req, res) => {
    const { goalId } = req.params

    if (!goalId) {
        throw new ApiError(401, "GoalID is required to be deleted")
    }

    const goal = await Goal.findOne({ _id: goalId })

    if (!goal) {
        throw new ApiError(401, "Goal is not found or the Goal ID is wrong ")
    }

    const wallet = await Wallet.findOne({ goal: goal._id })

    if (!wallet) {
        throw new ApiError(401, "Wallet is not found for that goal")
    }

    if (wallet.balance > 0) {
        throw new ApiError(401, "Cannot delete goal,Wallet balance must be 0.")
    }
    await wallet.deleteOne()
    await goal.deleteOne()

    return res.status(200).json(
        new ApiResponse(201, "Goal is deleted", null)
    )
})

export { createGoal, getGoals, deleteGoal }