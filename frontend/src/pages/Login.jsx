import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { getAuthStatus, LoginUser, RegisterUser } from "../utils/ApiCalls";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (state === "Login") {
      LoginUser({ email, password, backendUrl }).then((res) => {
        if (res) {
          setIsLoggedIn(true);
          getAuthStatus({backendUrl}).then(res => {
            if (res) {
              setUserData(res)              
              navigate("/");
            }
          })
        }
      });
    } else {
      RegisterUser({ name, email, password, confirmPassword, backendUrl }).then(
        (res) => {
          if (res) {
            setIsLoggedIn(true);
            getAuthStatus({backendUrl}).then(res => {
              if (res) {
                setUserData(res)              
                navigate("/");
              }
            })
          }
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 w-full">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 sm:w-32 w-28 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-white text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-indigo-300 text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input">
              <img src={assets.person_icon} alt="" />
              <input
                value={name}
                type="text"
                required
                placeholder="Full Name"
                className="bg-transparent outline-none"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input">
            <img src={assets.mail_icon} alt="" />
            <input
              value={email}
              type="email"
              required
              placeholder="Email ID"
              className="bg-transparent outline-none w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input relative">
            <img src={assets.lock_icon} alt="" />
            <input
              value={password}
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="bg-transparent outline-none w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="group absolute right-4 text-gray-400 cursor-pointer hover:text-gray-200 transition-all duration-200 flex justify-center items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>

              {/* Tooltip */}
              <div className="absolute -top-8 sm:-top-1 -left-4 sm:left-8 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {showPassword ? "Hide Password" : "Show Password"}
              </div>
            </div>
          </div>

          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-input relative">
              <img src={assets.lock_icon} alt="" />
              <input
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm Password"
                className="bg-transparent outline-none"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="group absolute right-4 text-gray-400 cursor-pointer hover:text-gray-200 transition-all duration-200 flex justify-center items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>

                {/* Tooltip */}
                <div className="absolute -top-8 sm:-top-1 -left-4 sm:left-8 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {showConfirmPassword ? "Hide Password" : "Show Password"}
                </div>
              </div>
            </div>
          )}

          {state === "Login" && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 text-indigo-500 hover:text-indigo-500/90 transition-all duration-200 cursor-pointer w-32"
            >
              Forgot password?
            </p>
          )}

          <button
            className="w-full rounded-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white font-medium"
            type="submit"
          >
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-shadow-2xs mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline hover:text-blue-400/90 transition-all duration-200"
              onClick={() => setState("Login")}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-shadow-2xs mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer underline hover:text-blue-400/90 transition-all duration-200"
              onClick={() => setState("Sign Up")}
            >
              Signup
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
