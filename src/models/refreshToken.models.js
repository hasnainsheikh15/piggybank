import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        // index: true
    }, 
    hashToken: {
        type: String,
        required: true
    },

    device: {
        type: String,
        required: true
    },

    ipAddress: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true,
        // index: true
    },
    isRevoked: {
        type: Boolean,
        degfault: false
    }
}, { timestamps: true })

// compound inidexing 
refreshTokenSchema.index({expiresAt : 1},{expireAfterSeconds : 0})

//TTL indexing for the refreshToken 
refreshTokenSchema.index({user : 1},{hashToken : 1})


export const RefreshToken = mongoose.model("RefreshToken",refreshTokenSchema)