import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
    ,

    dob: {
        type: Date,
        required: true
    }
    ,

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    isPhoneVerified: {
        type: Boolean,
        default: false
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    otpCode: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    otpAttempts: {
        type: Number,
        default: 0
    },
    lastOtpSentAt: {
        type: Date,
        default: null
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
    ,
    lockUntil: {
        type: Date,
        default: null
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        return next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.pre("save", function (next) {
    const date = new Date();
    const dob = new Date(this.dob)

    let age = date.getFullYear() - dob.getFullYear();

    const monthDiff = date.getMonth() - dob.getMonth();
    const dayDiff = date.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    if (age < 16) {
        return next(new Error("User must be at least 16 years old."))
    }
    next();
})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        userId: this._id,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        userId: this._id,
        email: this.email,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

userSchema.index({email : 1},{unique : true});
userSchema.index({phone : 1},{unique : true})


export const User = mongoose.model("User", userSchema);
