import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IoLogoSlack } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaRegMoon } from "react-icons/fa";
import { LuSunMedium } from "react-icons/lu";
import logo from "../../assets/react.svg";
import { TbLogout2 } from "react-icons/tb";

const MobileSidebar = ({
  darkMode,
  toggleTheme,
  logout,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); // Create a ref for the sidebar

  const items = [
    { name: "Home", path: "/", logo: <IoLogoSlack /> },
    { name: "Projects", path: "/projects", logo: <IoLogoSlack /> },
    { name: "Services", path: "/services", logo: <IoLogoSlack /> },
    { name: "Contact", path: "/contact", logo: <IoLogoSlack /> },
  ];

  const handleBar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileSidebarOpen(false);
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  return (
    <>
      <div className=" bg-gray-50 px-7 dark:bg-gray-900 dark:text-white md:hidden flex p-4 w-full justify-between gap-4">
        <div className="flex gap-2 items-center text-2xl">
          <button onClick={handleBar}>
            <FaBars />
          </button>
          <p className=" font-bold">Designer</p>
        </div>
        <div className="text-2xl gap-4 flex justify-end">
          <button
            className="text-dark-purple dark:text-white"
            onClick={() => toggleTheme()}
          >
            {darkMode ? <LuSunMedium /> : <FaRegMoon />}
          </button>
          <button
            className="md:hidden  rounded-full"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <img src={logo} alt="logo" />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="md:hidden">
          <div className="border text-dark-purple dark:text-white dark:text-white border rounded bg-slate-50 dark:bg-gray-900 w-48 h-16 absolute top-20 right-10 z-50">
            <button
              onClick={() => {
                logout();
              }}
              className="m-4 text-sm flex gap-4 items-center"
            >
              <TbLogout2 />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Overlay for the sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10 transition-opacity duration-300" />
      )}

      {/* Sidebar container with transition effect */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 min-h-screen w-72 bg-dark-purple z-20 transition-transform duration-300 transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Start */}
        <div className="flex justify-between items-center p-4">
          <div className="flex gap-x-4 items-center">
            <p className="text-4xl p-1 text-sky-400">
              <IoLogoSlack />
            </p>
            <p className="text-3xl text-white">Designer</p>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-white w-10"
          >
            <RxCross1 />
          </button>
        </div>
        <ul className="mt-10 px-4 text-gray-300">
          {items.map((item, index) => (
            <NavLink
              onClick={() => setIsMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex mb-4 p-2 rounded-md hover:bg-light-white items-center gap-4 ${
                  isActive ? "bg-light-white" : ""
                }`
              }
              key={index}
              to={item.path}
            >
              <p className="text-3xl">{item.logo}</p>
              <p className="origin-left duration-300 text-sm">{item.name}</p>
            </NavLink>
          ))}
        </ul>
        {/* End */}
      </div>
    </>
  );
};

export default MobileSidebar;
