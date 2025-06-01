import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/auth.controller.js'
import { userAuth } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)

//Using userAuth Middleware
authRouter.post('/verification-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-email', userAuth, verifyEmail)
authRouter.get('/is-auth', userAuth, isAuthenticated)

export default authRouter