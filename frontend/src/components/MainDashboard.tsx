import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";

import DashboardHome from "./DashboardHome";
import DashboardSearch from "./DashboardSearch";
import DashboardAds from "./DashboardAds";
import DashboardChat from "./DashboardChat";
import DashboardProfile from "./DashboardProfile";
import DashboardUpload from "./DashboardUpload";
import DashboardBooking from "./DashboardBooking";
import DashboardFavourites from "./DashboardFavourites";

const MainDashboard: React.FC = () => {
  const [username, setUsername] = useState("User");
  
  useEffect(() => {
    // Get the user's email from localStorage
    const userEmail = localStorage.getItem("userEmail");
    
    if (userEmail) {
      // Extract username from email (everything before @)
      // Or just display the email if you prefer
      const extractedUsername = userEmail.split('@')[0];
      setUsername(extractedUsername);
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-bold">Welcome to QazaqRental!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">User: {username}</span>
          </div>
        </header>
        <main className="flex-1 p-4 bg-gray-900">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="search" element={<DashboardSearch />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="upload" element={<DashboardUpload />} />
            <Route path="chat" element={<DashboardChat />} />
            <Route path="my-ads" element={<DashboardAds />} />
            <Route path="booking" element={<DashboardBooking />} />
            <Route path="favourite" element={<DashboardFavourites />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;