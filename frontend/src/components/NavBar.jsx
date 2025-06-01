import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { logoutUser } from "../utils/ApiCalls";

export default function NavBar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const logout = () => {
    logoutUser({ backendUrl }).then((res) => {
      if (res) {
        setUserData(null);
        setIsLoggedIn(false);
        navigate("/");
      }
    });
  };

  return (
    <div className="max-w-[1400px] w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="flex justify-center items-center w-8 h-8 rounded-full text-white relative group bg-gray-900 cursor-pointer">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li className="py-1 px-2 hover:bg-gray-200 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link
          to={"/login"}
          className="flex items-center gap-2 border-gray-500 border rounded-full px-6 py-2 text-gray-800 cursor-pointer hover:bg-gray-100 transition-all"
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </Link>
      )}
    </div>
  );
}
