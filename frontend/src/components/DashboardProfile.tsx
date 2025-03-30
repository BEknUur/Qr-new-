import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

interface UserProfile {
  username: string;
  email: string;
  bio?: string | null;
  profile_image?: string | null;
}

const DashboardProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleLoadProfile();
  }, []);


  const handleLoadProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setMessage("User is not logged in or token is missing.");
      return;
    }

    try {
      setMessage("Loading profile...");
      const res = await axios.get(`${API_URL}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setMessage("Profile loaded successfully!");
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      setProfile(null);
      if (error.response?.status === 404) {
        setMessage("User not found (404).");
      } else {
        setMessage("Error while loading the profile.");
      }
    }
  };


  const handleSaveProfile = async () => {
    const token = localStorage.getItem("accessToken");

    if (!profile || !token) {
      setMessage("No profile data to save!");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/profile/profile`,
        {
          username: profile.username,
          bio: profile.bio,
          profile_image: profile.profile_image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Profile has been successfully updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Error when updating profile.");
    }
  };

  
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const token = localStorage.getItem("accessToken");

    if (!e.target.files || !e.target.files[0] || !profile || !token) {
      return;
    }

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
     
      const res = await axios.post(`${API_URL}/profile/profile/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

     
      setProfile((prev) =>
        prev ? { ...prev, profile_image: res.data.profile_image } : null
      );
      setMessage("The photo has been successfully uploaded!");
    } catch (error) {
      console.error("Error when uploading photo:", error);
      setMessage("Failed to upload a photo.");
    }
  };

 
  const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
    if (!imagePath) return undefined;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    } else {
      return `${API_URL}/${imagePath}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            MY PROFILE
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            Manage your personal data and photo
          </p>
        </div>

        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden max-w-3xl mx-auto">
          {message && (
            <div className="mb-4 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm text-gray-200">
              {message}
            </div>
          )}

          {!profile ? (
            <div className="text-center py-8 text-gray-400 animate-pulse">
              Loading profile or user not found...
            </div>
          ) : (
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
              
              <div className="flex flex-col items-center md:w-1/3">
                {profile.profile_image ? (
                  <img
                    src={getImageUrl(profile.profile_image)}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-lg text-white shadow-md">
                    No data
                  </div>
                )}

                <label className="mt-3">
                  <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded cursor-pointer text-sm">
                    Upload Photo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

             
              <div className="md:w-2/3">
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full py-2 px-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-800/50 transition-all"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full py-2 px-3 bg-black/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
                    value={profile.email}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">
                    About me
                  </label>
                  <textarea
                    rows={3}
                    className="w-full py-2 px-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-800/50 transition-all"
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-pink-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-700"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;