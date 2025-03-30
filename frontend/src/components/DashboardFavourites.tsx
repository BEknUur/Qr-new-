import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import CarCard from "./CarCard";

interface Car {
  id: number;
  name?: string;
  location: string;
  price_per_day: number;
  car_type: string;
  description?: string;
  image_url?: string;
}

const DashboardFavourites: React.FC = () => {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

  const fetchFavorites = async () => {
    if (!userEmail) {
      setError("User not authorized");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/favorites/`, {
        params: { userEmail },
      });
      setFavoriteCars(response.data);
    } catch (err) {
      console.error("Error loading favourites:", err);
      setError("Failed to load your favourites.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleBookCar = (car: Car) => {
    navigate(`/main/booking`);
  };

  const handleUnlikeCar = async (car: Car) => {
    if (!userEmail) return;
    try {
      await axios.delete(`${API_URL}/favorites/`, {
        params: {
          userEmail,
          car_id: car.id, 
        },
      });
      setFavoriteCars((prev) => prev.filter((c) => c.id !== car.id));
    } catch (err) {
      console.error("Error removing from favourites:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-3">
            <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              FAVOURITE CARS
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            All cars you've liked
          </p>
        </div>

        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-200">Loading favourites...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 border border-red-700 bg-red-900/20 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          ) : favoriteCars.length === 0 ? (
            <div className="text-center p-10 border border-gray-700 bg-gray-800 rounded-xl">
              <p className="text-gray-300 mb-2">You have no favourite cars yet.</p>
              <p className="text-gray-500 text-sm">
                Go to <strong>Auto Search</strong> and click "Like" on any car you want.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isLiked={true} 
                  onLike={() => handleUnlikeCar(car)} 
                  onBook={() => handleBookCar(car)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardFavourites;