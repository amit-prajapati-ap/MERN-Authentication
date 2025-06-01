import { createContext, useEffect, useState } from "react";
import { getAuthStatus } from "../utils/ApiCalls";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  const isAuth = () => {
    getAuthStatus({ backendUrl }).then((res) => {
      if (res) {
        setIsLoggedIn(true);
        setUserData(res)
      }
    });
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
