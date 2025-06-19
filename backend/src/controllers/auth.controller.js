import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import transporter from "../config/nodemailer.config.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/email.template.js";

const isProd = process.env.NODE_ENV === 'production'

const register = async (req, res) => {
    const { name, email, password, confirmPassword, tokenName, appName } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json(new ApiError(400, `All fields are required`))
    }

    if (password !== confirmPassword) {
        return res.status(400).json(new ApiError(400, "Password and Confirm Password should be same"))
    }

    if (!tokenName) {
        return res.status(400).json(new ApiError(400, "Token name is required"))
    }

    try {
        const existingUser = await User.findOne({ email, appName })

        if (existingUser) {
            return res.status(400).json(new ApiError(400, `User already exists`))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashedPassword, appName })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie(tokenName, token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json(new ApiResponse(200, [], "Registered Successfully"))

        //Sending register email
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: `Welcome to ${appName}`,
            text: `Welcome to ${appName} website. Your account has been created with email id: ${user.email}`
        }

        await transporter.sendMail(mailOptions)

    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while registering the user", error))
    }
}

const login = async (req, res) => {
    const { email, password, tokenName, appName } = req.body;

    if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Email and Password is required"))
    }

    if (!tokenName) {
        return res.status(400).json(new ApiError(400, "Token name is required"))
    }

    try {
        const user = await User.findOne({ email, appName }, { name: 1, email: 1, password: 1, authType: 1 }).lean()

        if (!user || user.authType !== 'EMAIL') {
            return res.status(401).json(new ApiError(401, `Invalid email ID`))
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json(new ApiError(401, `Invalid Password`))
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie(tokenName, token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json(new ApiResponse(200, [], "Login Successfully"))

        //Sending login email
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Just login from your account',
            text: `Welcome to ${appName} website. Your account has been login with email id: ${user.email}`
        }

        await transporter.sendMail(mailOptions)

    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "Server error occured while login the user", error))
    }
}

const logout = async (req, res) => {
    try {
        const { tokenName } = req.body

        if (!tokenName) {
            return res.status(400).json(new ApiError(400, "Token name is required"))
        }

        res.cookie(tokenName, null, {
            httpOnly: true,
            secure: isProd,
            sameSite: "none",
            maxAge: 0
        }).status(200).json(new ApiResponse(200, [], "Logout Successfully"))

    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "Server error occured while logout the user", error))
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId

        const user = await User.findById(userId)

        if (user.isVerified) {
            return res.status(400).json(new ApiError(400, "Account already verified"))
        }

        const otp = String((Math.floor(100000 + Math.random() * 900000)))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        //Sending verify otp
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'OTP For Email Verification',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json(new ApiResponse(200, [], "Verification OTP Sent on Email"))

    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while sending the verification OTP", error))
    }
}

const verifyEmail = async (req, res) => {
    const { otp } = req.body
    const userId = req.userId

    if (!userId || !otp) {
        return res.status(400).json(new ApiError(400, "Missing Details"))
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json(new ApiError(400, "User not found"))
        }

        if (user.verifyOtp !== otp) {
            return res.status(401).json(new ApiError(401, "Invalid OTP"))
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(401).json(new ApiError(401, "OTP Expired"))
        }

        user.isVerified = true
        user.verifyOtp = ""
        user.verifyOtpExpireAt = 0
        await user.save()

        res.status(200).json(new ApiResponse(200, [], "Email verified successfully"))

    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while verifying the user email ID", error))
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password -resetOtp -verifyOtp -resetOtpExpireAt -verifyOtpExpireAt')
        return res.status(200).json(new ApiResponse(200, user, "User Authenticated"))
    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while checking the user authenticity", error))
    }
}

const sendResetOtp = async (req, res) => {
    try {
        const { email, appName } = req.body

        if (!email && appName) {
            return res.status(400).json(new ApiError(400, "Email & App name is required"))
        }

        const user = await User.findOne({ email, applicationName: appName })

        if (!user) {
            return res.status(401).json(new ApiError(401, "User Not Found"))
        }

        const otp = String((Math.floor(100000 + Math.random() * 900000)))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save()

        //Sending verify otp
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'OTP For Reset Password',
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json(new ApiResponse(200, [], "OTP sent to your email"))

    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while sending the password reset OTP", error))
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, password, confirmPassword, appName } = req.body

    if (!email || !otp || !password || !confirmPassword || !appName) {
        return res.status(400).json(new ApiError(400, "All fields are required"))
    }

    if (password !== confirmPassword) {
        return res.status(400).json(new ApiError(400, "Password and confirm password should be same"))
    }

    try {
        const user = await User.findOne({ email, appName })

        if (!user) {
            return res.status(400).json(new ApiError(400, "User not found"))
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(401).json(new ApiError(401, "Invalid OTP"))
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(401).json(new ApiError(401, "OTP Expired"))
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetOtp = ""
        user.resetOtpExpireAt = 0
        await user.save()

        res.status(200).json(new ApiResponse(200, [], "Password reset successfully"))

    } catch (error) {
        res.status(500).json(new ApiError(500, "Server error occured while reseting the password", error))
    }
}

const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId

        const tokenName = req.headers["x-token-name"];
        if (!tokenName) {
            return res.status(400).json(new ApiError(400, "Token name is required"))
        }

        await User.findByIdAndDelete(userId)

        res.cookie(tokenName, null, {
            httpOnly: true,
            secure: isProd,
            sameSite: "none",
            maxAge: 0
        }).status(200).json(new ApiResponse(200, [], "Your Account Deleted Successfully"))

    } catch (error) {
        console.log("ERROR OCCURRED WHILE DELETING THE ACCOUNT" + error)
        res.status(500).json(new ApiError(500, "Server error occured while deleting the account", error))
    }
}

export { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, deleteAccount }