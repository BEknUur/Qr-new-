import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  SearchIcon,
  UserIcon,
  UploadIcon,
  MessageSquareIcon,
  LogOutIcon,
  StarIcon,
  Menu as MenuIcon,
  BookIcon,
  SaveAllIcon
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/main", icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Search Cars", to: "/main/search", icon: <SearchIcon className="w-5 h-5" /> },
    { name: "Profile", to: "/main/profile", icon: <UserIcon className="w-5 h-5" /> },
    { name: "Upload Car", to: "/main/upload", icon: <UploadIcon className="w-5 h-5" /> },
    { name: "Chat", to: "/main/chat", icon: <MessageSquareIcon className="w-5 h-5" /> },
    { name: "My Ads", to: "/main/my-ads", icon: <StarIcon className="w-5 h-5" /> },
    {name:"Booking",to:"/main/booking",icon:<BookIcon className="w-5 h-5"/>},
    {name:"Favourite",to:"/main/favourite",icon:<SaveAllIcon className="w-5 h-5"/>},
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-gradient-to-b from-blue-900 to-black text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="font-bold text-xl">Dashboard</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-600 transition-colors shadow-md"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      
      <nav className="flex-1 mt-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <div className="mr-3">{item.icon}</div>
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-full p-2 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOutIcon className="w-5 h-5 mr-2" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
