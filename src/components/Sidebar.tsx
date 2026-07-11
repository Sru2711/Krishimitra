"use client";

import React, { useState } from "react";
import { FarmItem, menu } from "../types/sidebarItems";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import advisory from "@/src/assets/Advisory.png";
import home from "@/src/assets/Home.png";
import history from "@/src/assets/History.png";
import message from "@/src/assets/Message.png";
import profile from "@/src/assets/Profile.png";
import setting from "@/src/assets/Settings.png";
import logo from "@/src/assets/Logo.png";
import toggle from "@/src/assets/Toggle.png";
import logoutIcon from "@/src/assets/Logout.png";
import { useAppDispatch } from "../redux/hooks";
import { logout } from "../features/Auth/authSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ... your imports remain the same

const Sidebar: React.FC = () => {
  const [collapse, setCollapse] = useState(true);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const menuItems: menu = [
    { name: "Farm Overview", link: "/dashboard", icon: home },
    { name: "Farm Advisory", link: "/farmerAdvisory", icon: advisory },
    { name: "Ask Krishimitra", link: "/askKrishiMitra", icon: message },
    { name: "Farm History", link: "/farmHistory", icon: history },
    { name: "Farmer Profile", link: "/farmerProfile", icon: profile },
    // { name: "Settings", link: "/settings", icon: setting },
  ];

  const handleToggle = (): void => {
    setCollapse((prev) => !prev);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("CurrentToken");
    dispatch(logout());
    router.replace("/login");
  };
  return (
    <div
      className={`h-full flex flex-col ${collapse ? "w-[80px]" : "w-[280px]"} bg-advisory rounded-b-xl transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-8">
        <div className="flex items-center gap-3 overflow-hidden">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="shrink-0 drop-shadow-lg"
            onClick={() => {
              handleToggle();
            }}
          />
          {!collapse && (
            <h1 className="text-3xl font-bold text-recommendation truncate">
              KrishiMitra
            </h1>
          )}
        </div>
        {/* <button className="p-1 hover:bg-white/10 rounded-lg transition">
          <Image src={toggle} alt="Toggle" width={24} height={24} />
        </button> */}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <li key={item.link}>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                    <Link
                      href={item.link}
                      className={`flex items-center ${
                        collapse ? "justify-center" : "gap-4"
                      } p-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-recommendation/20 text-white"
                          : "text-black/70 hover:bg-recommendation"
                      }`}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={30}
                        height={30}
                        className="shrink-0 drop-shadow-md"
                      />

                      {!collapse && (
                        <span className="text-lg font-medium whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                    </div>
                  </TooltipTrigger>

                  {collapse && (
                    <TooltipContent
                      side="top"
                      sideOffset={4}
                      className="bg-recommendation p-2 text-white text-sm"
                    >
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-recommendation text-sm text-center flex flex-col items-center justify-center">
        <Tooltip>
          <TooltipTrigger>
            <div>
            <button onClick={handleLogout} className="flex items-center gap-2">
              <Image
                src={logoutIcon}
                alt="Logout"
                width={30}
                height={30}
                className="shrink-0 drop-shadow-md"
              />

              {!collapse && (
                <span className="text-lg font-medium whitespace-nowrap">
                  Logout
                </span>
              )}
            </button>
            </div>
          </TooltipTrigger>

          {collapse && (
            <TooltipContent
              side="top"
              sideOffset={4}
              className="bg-recommendation p-2 text-white text-sm"
            >
              Logout
            </TooltipContent>
          )}
        </Tooltip>

        {!collapse && "© 2026 Krishimitra"}
      </div>
    </div>
  );
};

export default Sidebar;
