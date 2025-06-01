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
        const {data} = await axios.get(backendUrl + '/api/auth/is-auth', {withCredentials: true})
    
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
        const {data} = await axios.post(backendUrl + '/api/auth/logout', {withCredentials: true})
    
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