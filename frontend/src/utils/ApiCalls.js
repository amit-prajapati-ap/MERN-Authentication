import axios from 'axios'
import {toast} from 'react-toastify'

export const RegisterUser = async({name, email, password, confirmPassword, backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
    
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password, confirmPassword})
    
        if (data.statusCode === 200) {
            toast.success(data.message)
            return data.data
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const LoginUser = async({email, password, backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})
    
        if (data.success) {
            toast.success(data.message)
            return data.data
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const getAuthStatus = async({backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
    
        if (data.success) {
            toast.success(data.message)
            return data.data
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const logoutUser = async({backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const sendVerificationOtp = async({backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/verification-otp')
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const verifyEmail = async({backendUrl, otp}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/verify-email', {otp})
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const sendResetPasswordOtp = async({backendUrl, email}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const resetPassword = async({backendUrl, otp, email, password, confirmPassword}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {otp, email, password, confirmPassword})
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}

export const deleteAccount = async({backendUrl}) => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/delete-user')
    
        if (data.success) {
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
            return false
        }
    } catch (error) {
        toast.error(error.response.data.message)
        return false
    }
}
