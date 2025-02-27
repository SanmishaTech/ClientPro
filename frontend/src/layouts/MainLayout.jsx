import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../customComponents/SIdebar/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import MobileSidebar from "../customComponents/SIdebar/MobileSidebar";
import { FaRegMoon } from "react-icons/fa";
import { LuSunMedium } from "react-icons/lu";
import logo from "../images/tt.jpg";
import { TbLogout2 } from "react-icons/tb";
import axios from "axios";
import Navbar from "../customComponents/Navbar/Navbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Logout from "../customComponents/Navbar/Logout";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify, LogOut, CircleChevronLeft } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";

import { Button } from "@/components/ui/button";

const MainLayout = ({ toggleTheme, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // open state to manage Sheet visibility

  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const user_email = user?.user?.email;
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.get("/api/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      toast.success("Logged-out successfully");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      if (error?.response?.data?.message === "Unauthenticated.") {
        localStorage.removeItem("user");
        toast.success("Logged-out successfully");
        navigate("/login");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An error occurred while logout.");
      }
    }
  };

  const handleLogout = async () => {
    setIsLogoutDialogOpen(false); // Close the dialog first
    setIsOpen(false); // Close the dropdown
    await logout(); // Perform logout
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className="w-full relative overflow-visible bg-slate-50  dark:bg-[#070B1D]  ">
            <div className="flex bg-white dark:bg-gray-800 md:dark:bg-[#070B1D] shadow-md md:shadow-none md:bg-slate-50 justify-between items-center">
              <div className=" w-full px-5 py-3 flex justify-start items-center">
                {/* <AlignJustify /> */}
                <MobileSidebar
                  open={mobileSidebarOpen}
                  setOpen={setMobileSidebarOpen}
                />
              </div>
              <div className=" w-full px-5 py-3 flex justify-end items-center">
                <div className="px-5">
                  <ModeToggle></ModeToggle>
                </div>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="overflow-hidden rounded-full"
                    >
                      <img
                        src={logo}
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user_email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsLogoutDialogOpen(true)}
                    >
                      <LogOut /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={` ${
                !isSidebarOpen && "left-[-12px] rotate-180"
              } hidden md:block absolute bg-blue-500 duration-300 transition-all rounded-full text-white top-14 left-[-12px] z-50`}
            >
              <CircleChevronLeft />
            </button>
            <div className="w-full h-screen overflow-auto pb-24">
              <Outlet />
            </div>
          </div>
        </div>
        {isLogoutDialogOpen && (
          <Logout
            onLogout={handleLogout}
            closeDialog={() => setIsLogoutDialogOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default MainLayout;
