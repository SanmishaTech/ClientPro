import { useState } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoLogoSlack } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Settings,
  LayoutDashboard,
  Users,
  Sun,
  Network,
  SquareUserRound,
  AlignStartVertical,
  CircleChevronLeft,
  UsersRound,
  Notebook,
  HandCoins,
  ReceiptText,
  Flower,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  // State to track which parent item has its children visible
  const [activeParent, setActiveParent] = useState(null);

  const items = [
    {
      name: "Dashboard",
      path: "/",
      logo: <LayoutDashboard size={16} />,
    },
    {
      name: "Masters",
      path: "#",
      logo: <Settings size={16} />,
      children: [
        {
          name: "Devtas",
          path: "/devtas",
          logo: <Sun size={16} />,
        },
        {
          name: "Pooja Types",
          path: "/pooja_types",
          logo: <AlignStartVertical size={16} />,
        },
        {
          name: "Pooja Dates",
          path: "/pooja_dates",
          logo: <Settings size={16} />,
        },
        {
          name: "Receipt types",
          path: "/receipt_types",
          logo: <ReceiptText size={16} />,
        },
        {
          name: "Gurujis",
          path: "/gurujis",
          logo: <Flower size={16} />,
        },
      ],
    },
    {
      name: "User Management",
      path: "#",
      logo: <Users size={16} />,
      children: [
        {
          name: "Roles",
          path: "/roles",
          logo: <Notebook size={16} />,
        },
        {
          name: "Users",
          path: "/users",
          logo: <UsersRound size={16} />,
        },
      ],
    },
    {
      name: "Denominations",
      path: "/denominations",
      logo: <HandCoins size={16} />,
    },
    {
      name: "Receipts",
      path: "/receipts",
      logo: <ReceiptText size={16} />,
    },
  ];

  // Function to toggle children visibility (close previous and open current)
  const toggleChildren = (itemName) => {
    setActiveParent((prev) => (prev === itemName ? null : itemName)); // If same item clicked, close, else open it
  };

  return (
    <>
      <ScrollArea
        className={`${
          isSidebarOpen ? "w-80 " : " w-16 "
        } hidden md:block duration-300 px-3 m-0 text-white transition-all pt-3.5 border border-dark-purple  min-h-screen bg-dark-purple dark:bg-background`}
        // className={`${
        //   isSidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0"
        // } duration-300 transition-all px-4 pt-3.5 shadow-xl min-h-screen dark:bg-gray-800 bg-slate-50`}
      >
        <div className="flex gap-x-4 items-center">
          <p className="text-4xl p-1">
            <LayoutDashboard />
          </p>
          <p className={`text-3xl duration-300 ${!isSidebarOpen && "scale-0"}`}>
            श्री गणेश मंदिर संस्थान, डोंबिवली
          </p>
        </div>
        <ul className="pb-24 pt-8">
          {/* mt-10 about */}
          {items.map((item, index) => {
            return (
              <div key={index}>
                {/* Parent item */}
                {item.children ? (
                  <NavLink
                    className=" flex my-2 text-sm px-1 py-2 hover:bg-dark-purple-light dark:hover:bg-gray-600 rounded items-center"
                    to={item.path || "#"}
                    onClick={() => item.children && toggleChildren(item.name)} // Toggle children visibility on click
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xl px-1">{item.logo}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <p className="text-xl px-1">{item.logo}</p> */}
                    <div
                      className={`w-full px-2 flex justify-between items-center ${
                        !isSidebarOpen && "opacity-0 invisible"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          !isSidebarOpen &&
                          "text-ellipsis whitespace-nowrap overflow-hidden"
                        }`}
                      >
                        {item.name}
                      </p>
                      {item.children && (
                        <p>
                          <IoIosArrowDown
                            className={`${
                              item.children &&
                              activeParent === item.name &&
                              "rotate-180 "
                            } transition-all duration-300`}
                          />
                        </p>
                      )}
                    </div>
                  </NavLink>
                ) : (
                  <NavLink
                    className={({ isActive }) =>
                      ` flex my-2 px-1 py-2 text-white hover:bg-dark-purple-light dark:hover:bg-gray-600 text-sm rounded items-center ${
                        isActive &&
                        "bg-dark-purple-light dark:bg-gray-600 text-white"
                      }`
                    }
                    to={item.path || "#"}
                    onClick={() => item.children && toggleChildren(item.name)} // Toggle children visibility on click
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xl px-1">{item.logo}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {/* <p className="text-xl px-1">{item.logo}</p> */}
                    <div
                      className={`w-full px-2 flex justify-between items-center ${
                        !isSidebarOpen && "opacity-0 invisible"
                      }`}
                    >
                      <p className="">{item.name}</p>
                      {item.children && (
                        <p>
                          <IoIosArrowDown
                            className={`${
                              item.children &&
                              activeParent === item.name &&
                              "rotate-180"
                            }`}
                          />
                        </p>
                      )}
                    </div>
                  </NavLink>
                )}
                {/* Render children if the parent item has children and it's the active one */}
                {item.children && activeParent === item.name && (
                  <div>
                    {" "}
                    {item.children.map((child, idx) => (
                      <NavLink
                        key={idx}
                        className={({ isActive }) =>
                          ` ${
                            isActive && "bg-dark-purple-light dark:bg-gray-600"
                          } pl-1 w-full py-2 my-2 gap-2  hover:bg-dark-purple-light dark:hover:bg-gray-600 rounded flex items-center text-sm ${
                            isSidebarOpen && "pl-8"
                          }`
                        }
                        to={child.path}
                      >
                        <p className="">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-xl px-1">{child.logo}</p>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="">{child.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {/* {child.logo} */}
                        </p>
                        <p
                          className={`${!isSidebarOpen && "hidden"}
                          origin-left duration-300 text-sm`}
                        >
                          {child.name}
                        </p>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </ul>
      </ScrollArea>
    </>
  );
};

export default Sidebar;
