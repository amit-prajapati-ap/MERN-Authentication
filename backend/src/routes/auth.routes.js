import express from 'express'
import { deleteAccount, isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/auth.controller.js'
import { userAuth } from '../middlewares/auth.middleware.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)
authRouter.post('/logout', logout)

//Using userAuth Middleware
authRouter.post('/verification-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-email', userAuth, verifyEmail)
authRouter.get('/is-auth', userAuth, isAuthenticated)
authRouter.post('/delete-user', userAuth, deleteAccount)

export default authRouter