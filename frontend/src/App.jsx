import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { EmailVerify, Home, Login, ResetPassword } from './pages/index.js'
import {ToastContainer} from 'react-toastify'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/verify-email',
    element: <EmailVerify/>
  },
  {
    path: '/reset-password',
    element: <ResetPassword/>
  },
])

const App = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center w-full bg-[url('/bg_img.png')] bg-cover bg-center">
      <ToastContainer/>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
