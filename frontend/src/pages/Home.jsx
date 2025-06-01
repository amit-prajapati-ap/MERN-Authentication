import React from "react";
import { Header, NavBar } from "../components/index.js";
const Home = () => {
  return (
    <div className="max-w-[1400px] flex flex-col items-center justify-center">
      <NavBar />
      <Header/>
    </div>
  );
};

export default Home;
