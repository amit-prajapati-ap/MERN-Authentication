import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'

const app = express()
const allowedOrigins = ['http://localhost:5173', '*']

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: allowedOrigins}))

app.get('/', (_,res) => {
    res.send("API Working")
})

//API Endpoint 
app.use('/api/auth', authRouter)

export default app