import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="relative">
      <Sidebar />
      <main className="absolute right-0 w-full lg:w-[80%] p-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
