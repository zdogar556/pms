import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GiFeather } from "react-icons/gi";
import { useService } from "../context";

const menuItems = [
  {
    label: "Dashboard Overview",
    path: "/pms",
    icon: "fa-regular fa-chart-bar",
  },
  { section: "Management" },
   {
    label: "Poultry Overview",
    path: "/pms/batch",
    icon: "fa-regular fa-chart-bar",
  },
  {
    label: "Worker Management",
    path: "/pms/workers",
    icon: "far fa-building",
  },
  {
    label: "Production Management",
    path: "/pms/productions",
    icon: "far fa-id-card",
  },
  {
    label: "Feed Management",
    path: "/pms/feeds",
    icon: "far fa-comments",
  },
  {
    label: "Feed Consumption",
    path: "/pms/feedconsume",
    icon: "far fa-comments",
  },
  {
    label: "Payroll Management",
    path: "/pms/payrolls",
    icon: "far fa-chart-bar",
  },
  { section: "Analytics" },
  {
    label: "Settings",
    path: "/pms/settings",
    icon: "fas fa-gear",
  },
  { label: "Logout", action: "logout", icon: "fa fa-sign-out" },
];

const Sidebar = () => {
  const { loading, logout, loggedInUser } = useService();

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="bg-[#2A2A40] flex justify-between w-full h-[65px] shadow-lg">
        <div
          className="fixed top-4 left-5 cursor-pointer z-50 lg:hidden"
          onClick={toggleSidebar}
        >
          <i className="fa fa-bars text-white text-lg hover:text-gray-300 transition-all"></i>
        </div>

        <div className="py-4 pl-1 absolute right-10">
          <div className="flex items-center gap-4">
            <div className="w-[30px] h-[30px] rounded-full overflow-hidden cursor-pointer ring-2 ring-blue-500 hover:ring-blue-400 transition-all"></div>
            <div className="text-gray-200 hidden sm:block">
              <p className="text-sm font-semibold">{loggedInUser.name}</p>
              <p className="text-xs text-gray-300">{loggedInUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <motion.aside
        id="sidebar"
        className="w-[260px] text-white h-screen p-3 fixed top-0 z-50 lg:z-10 shadow-2xl bg-gradient-to-r from-[#1E1E2F] to-[#2A2A40]"
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mt-3">
          <div className="flex items-center justify-center mb-9 mr-5">
            <GiFeather className="text-blue-600 text-2xl" />
            <h2 className="ml-2  font-semibold text-gray-200">
              Polutary Management
            </h2>
          </div>
        </div>

        <ul className="space-y-2 mt-10">
          {menuItems.map((item, index) =>
            item.section ? (
              <p
                key={index}
                className="text-xs text-gray-400 font-semibold uppercase tracking-wider py-3"
              >
                {item.section}
              </p>
            ) : (
              <li key={index}>
                {item.action ? (
                  <div
                    onClick={async () => {
                      const confirm = window.confirm(
                        "Are you sure you want to logout?"
                      );
                      if (confirm) await logout();
                    }}
                    className="text-[0.9rem] p-2 rounded hover:bg-[#1E1E2F] cursor-pointer flex items-center transition-all duration-300"
                  >
                    {loading ? (
                      <i className="fa fa-spinner fa-spin mr-3"></i>
                    ) : (
                      <i className={`${item.icon} mr-3`}></i>
                    )}
                    {item.label}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-[0.9rem] p-2 rounded hover:bg-[#1E1E2F] flex items-center transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-[#1E1E2F] border-l-4 border-blue-500"
                        : "text-gray-300"
                    }`}
                  >
                    <i className={`${item.icon} mr-3`}></i> {item.label}
                  </Link>
                )}
              </li>
            )
          )}
        </ul>

        {isOpen && window.innerWidth < 1024 && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-[25px] h-[25px] absolute left-[270px] top-[15px] z-50 flex justify-center items-center cursor-pointer bg-white text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-all"
          >
            <i className="fa-solid fa-times text-xs"></i>
          </button>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
