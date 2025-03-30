import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_URL from "../config";
import { Send, Search, User, ArrowLeft, PlusCircle } from "lucide-react";

interface Message {
  id: number;
  sender_email: string;
  receiver_email: string;
  text: string;
  timestamp: string;
}

interface ChatUser {
  username: string;
  email: string;
  lastSeen?: string;
  avatar?: string;
}

const DashboardChat: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [userResults, setUserResults] = useState<ChatUser[]>([]);
  const [activeChatOpen, setActiveChatOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      alert("You are not authorized.");
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    
    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket(`ws:${window.location.hostname}:8000/chat/ws/${userEmail}`);
    
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message && !data.error) {
        
        if (
          (data.message.sender_email === receiverEmail && data.message.receiver_email === userEmail) ||
          (data.message.sender_email === userEmail && data.message.receiver_email === receiverEmail)
        ) {
          setChatMessages(prev => [...prev, data.message]);
          scrollToBottom();
        }
      }
      
      else if (data.status === "delivered" && data.message) {
        
        if (
          (data.message.sender_email === userEmail && data.message.receiver_email === receiverEmail) ||
          (data.message.sender_email === receiverEmail && data.message.receiver_email === userEmail)
        ) {
          setChatMessages(prev => [...prev, data.message]);
          scrollToBottom();
        }
      } 
      else if (data.error) {
        console.error("WebSocket error:", data.error);
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };

  }, [userEmail, receiverEmail]);

  useEffect(() => {
    if (receiverUsername) {
      fetchMessages();
    }
  }, [receiverUsername]);

  const fetchMessages = async () => {
    if (!receiverUsername || !userEmail) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/chat/messages/${userEmail}/${receiverUsername}`);
      setChatMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages.", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const response = await axios.get(`${API_URL}/chat/search-users?query=${searchQuery}`);
      setUserResults(response.data);
    } catch (error) {
      console.error("Error searching users", error);
      setUserResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleStartChat = (username: string, email: string) => {
    setReceiverUsername(username);
    setReceiverEmail(email);
    setActiveChatOpen(true);
    setSearchQuery("");
    setUserResults([]);
    fetchMessages();

    setTimeout(() => messageInputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !receiverEmail || !userEmail || !socket) return;

    try {
      const messageData = {
        text: newMessage.trim(),
        receiver_email: receiverEmail
      };

      socket.send(JSON.stringify(messageData));
      
      setNewMessage("");
    } catch (error) {
      console.error("Message sending error", error);
      
      try {
        const httpMessageData = {
          sender_email: userEmail,
          receiver_username: receiverUsername,
          text: newMessage.trim(),
        };

        await axios.post(`${API_URL}/chat/send`, httpMessageData, {
          headers: { "Content-Type": "application/json" },
        });

        setNewMessage("");
        fetchMessages();
      } catch (httpError) {
        console.error("HTTP fallback failed:", httpError);
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const backToSearch = () => {
    setActiveChatOpen(false);
    setReceiverUsername("");
    setReceiverEmail("");
    setChatMessages([]);
  };

  const connectionStatus = connected ? 
    <span className="text-xs text-green-400">Connected</span> : 
    <span className="text-xs text-red-400">Offline</span>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-3">
            <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              CHAT
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            Connect with users and chat about vehicles
          </p>
        </div>

        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {!activeChatOpen ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-blue-400">
                  Find Users to Chat With
                </h2>
                
                <button 
                  onClick={() => document.querySelector('input')?.focus()}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  New Chat
                </button>
              </div>
              
              <div className="flex items-center bg-gray-900/80 rounded-lg overflow-hidden mb-6 border border-gray-700">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="flex-1 p-4 bg-transparent text-white focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                />
                <button 
                  onClick={searchUsers}
                  className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {searching ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-400">Searching for users...</p>
                </div>
              ) : userResults.length > 0 ? (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold mb-3 text-purple-300">Search Results</h2>
                  {userResults.map((user, index) => (
                    <div 
                      key={index}
                      onClick={() => handleStartChat(user.username, user.email)}
                      className="flex items-center p-4 rounded-lg bg-gray-900/60 border border-gray-800 hover:bg-gray-800/60 hover:border-blue-500 transition cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{user.username}</h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No users found. Try a different search term.</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-blue-400" />
                  </div>
                  <p className="text-gray-400 mt-4">Enter a username in the search box above</p>
                  <button 
                    onClick={() => document.querySelector('input')?.focus()}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Start Searching
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 flex items-center">
                <button 
                  onClick={backToSearch}
                  className="p-2 rounded-full hover:bg-black/20 transition mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{receiverUsername}</h3>
                    <div className="text-xs text-gray-300">{receiverEmail}</div>
                  </div>
                </div>
                <div className="text-right">{connectionStatus}</div>
              </div>

              <div className="bg-black/60 p-6 h-96 overflow-y-auto">
                {loading && chatMessages.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-3">
                      <Send className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-lg">No messages yet</p>
                    <p className="text-sm mt-2">Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender_email === userEmail ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-xs sm:max-w-sm rounded-xl px-4 py-3 ${
                            msg.sender_email === userEmail 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 rounded-tr-none"
                              : "bg-gray-800 rounded-tl-none"
                          }`}
                        >
                          <p className="text-white">{msg.text}</p>
                          <span className="text-xs opacity-70 block text-right mt-1">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-800 bg-black/40">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-4 rounded-l-lg bg-gray-900/80 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    ref={messageInputRef}
                    disabled={!connected}
                  />
                  <button
                    onClick={handleSend}
                    className={`p-4 rounded-r-lg ${
                      !newMessage.trim() || !connected
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    }`}
                    disabled={!newMessage.trim() || !connected}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardChat;