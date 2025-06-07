import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';

export const userAuth = async(req, res, next) => {
    const {token} = req.cookies;
    
    if (!token || token.includes('null')) {
        return res.status(401).json(new ApiError(401, "Not Authorized. Please Login"))
    }
    
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.userId = tokenDecode.id
        } else {
            return res.status(401).json(new ApiError(401, "Not Authorized. Login Again"))
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json(new ApiError(500, "Server error occured while accessing the token", error))
    }
}