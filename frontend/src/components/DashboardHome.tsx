import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaPlusCircle,
  FaUser,
  FaSearch,
  FaHeart,
  FaCalendarCheck,
  FaBell,
  FaTimes,
  FaLightbulb,
  FaChevronRight
} from "react-icons/fa";

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const [helperVisible, setHelperVisible] = useState(true);
  const [helperMessage, setHelperMessage] = useState("Привет! Нужна помощь с чем-нибудь сегодня?");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const quickActions = [
    {
      label: "Upload",
      icon: <FaPlusCircle />,
      onClick: () => navigate("/main/upload"),
    },
    {
      label: "Profile",
      icon: <FaUser />,
      onClick: () => navigate("/main/profile"),
    },
    {
      label: "Chats",
      icon: <FaComments />,
      onClick: () => navigate("/main/chat"),
    },
    {
      label: "Search",
      icon: <FaSearch />,
      onClick: () => navigate("/main/search"),
    },
    {
      label: "Booking",
      icon: <FaCalendarCheck />,
      onClick: () => navigate("/main/booking"),
    },
    {
      label: "Favourite",
      icon: <FaHeart />,
      onClick: () => navigate("/main/favourite"),
    },
  ];

  const showHelperTip = (action: string) => {
    const tipMessages: {[key: string]: string} = {
      
        "Upload": "Upload new files or content in just a few clicks!",
        "Profile": "Update your profile to stand out among other users.",
        "Chats": "You have 3 unread messages. Check them out!",
        "Search": "Find everything you need with our powerful search.",
        "Booking": "Book in advance and get a 10% discount!",
        "Favourite": "Save your favorite offers for quick access."
      
      
    };
    setHelperMessage(tipMessages[action] || "How can I help you today?");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              HELLO, {userName.toUpperCase()}
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          
          <div className="hidden md:block rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2">
            <div className="text-gray-300 text-sm">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-xs text-gray-400">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
        
        <p className="text-gray-300 text-lg max-w-2xl mb-12">
          Welcome to your personal dashboard. Explore features and connect with others.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl mb-6">
              {/* Quick actions section */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                    <FaComments className="text-blue-400 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-semibold text-blue-400">Quick Actions</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    onMouseEnter={() => showHelperTip(action.label)}
                    className="
                      flex flex-col items-center justify-center p-6
                      bg-black/50 border border-white/10 rounded-xl
                      hover:bg-white/10 transition cursor-pointer
                      group relative overflow-hidden
                    "
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                    <div className="text-blue-400 text-3xl group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300">
                      {action.icon}
                    </div>
                    <span className="text-white text-sm mt-3">{action.label}</span>
                  </button>
                ))}
              </div>
              
              
             
            </div>
          </div>

          <div className="space-y-6">
            {helperVisible && (
              <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                <button 
                  onClick={() => setHelperVisible(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 animate-pulse"></div>
                    <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-blue-400/30">
                      <div className="w-full h-full relative">
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-t-2xl bg-gradient-to-r from-blue-400 to-purple-500"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">Аssistant</h3>
                  
                 
                  <div className="relative mt-2 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 w-full">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-blue-500/20 border-t border-l border-white/10"></div>
                    <p className="text-white text-sm">{helperMessage}</p>
                  </div>
                  
                  
                  <div className="grid grid-cols-2 gap-2 w-full mt-4">
                    <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 text-xs border border-blue-500/30 transition flex items-center justify-center">
                      <FaLightbulb className="mr-1" /> Tips
                    </button>
                    <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-300 text-xs border border-purple-500/30 transition flex items-center justify-center">
                      <FaComments className="mr-1" /> Help
                    </button>
                  </div>
                </div>
              </div>
            )}

           
            <div className="backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <FaBell className="text-pink-400 text-xl" />
                <h2 className="text-xl font-semibold text-blue-400">
                  Announcements
                </h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl hover:bg-black/40 transition cursor-pointer">
                  <p className="text-gray-300 mb-2">
                    We have introduced a long-term rental option! Rent for 7+ days and
                    save 15%.
                  </p>
                  <p className="text-xs text-gray-500">March 20, 2025</p>
                </div>
                <div className="p-4 bg-black/30 border border-white/10 rounded-xl hover:bg-black/40 transition cursor-pointer">
                  <p className="text-gray-300 mb-2">
                    New mobile app is going on!
                  </p>
                  <p className="text-xs text-gray-500">March 15, 2025</p>
                </div>
              </div>
              
              <button className="w-full mt-4 p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300 text-xs border border-blue-500/30 transition flex items-center justify-center">
                View All Announcements <FaChevronRight className="ml-1" />
              </button>
            </div>
            
          
              
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;