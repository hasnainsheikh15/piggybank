import { Goal } from "../models/goal.models.js";
import { Transaction } from "../models/transaction.models.js";
import { User } from "../models/user.models.js";
import { Wallet } from "../models/wallet.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUserData = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("name email phone isVerified createdAt")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const wallet = await Wallet.findOne({ user: userId })

    const balance = wallet ? wallet.balance : 0;

    const result = await Wallet.aggregate([
  {
    $match: { user: userId }
  },
  {
    $group: {
      _id: null,
      totalBalance: { $sum: "$balance" }
    }
  }
]);

const totalBalance = result[0]?.totalBalance || 0;

    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).
        limit(6).select("type description amount createdAt status ");

    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 }).select("title targetAmount currentAmount icon");

    // MOnthly Analytics 

    const sixMonthAgo = new Date();

    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const monthlyAnalytics = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                type: "credit",
                status: "completed",     
                createdAt: { $gte: sixMonthAgo }
            }
        },

        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                total: { $sum: "$amount" }
            }
        }

        ,
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ])

    // const analytics = monthlyAnalytics.map(item => item.total);

    return res.status(200).json(
        new ApiResponse(200,"User dashboard data fetched successfully", {
            user,
            wallet: {
                balance
            },
            transactions,
            goals,
            monthlyAnalytics,
            totalBalance
        })
    )

})

export { getUserData } 