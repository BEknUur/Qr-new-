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

interface FilterOptions {
  location: string;
  minPrice: string;
  maxPrice: string;
  carType: string;
}

const DashboardSearch: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

 
  const [filters, setFilters] = useState<FilterOptions>({
    location: "",
    minPrice: "",
    maxPrice: "",
    carType: "",
  });


  const [locations, setLocations] = useState<string[]>([]);
  const [carTypes, setCarTypes] = useState<string[]>([]);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchCarsAndFavorites = async () => {
      if (!userEmail) {
        setError("User not authorized");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

const carsResponse = await axios.get(`${API_URL}/car/cars/`);
console.log("🚗 API data before setCars:", carsResponse.data);
console.log("🧪 Type:", typeof carsResponse.data);
console.log("🧮 Array length:", Array.isArray(carsResponse.data) ? carsResponse.data.length : "Not an array");


if (Array.isArray(carsResponse.data)) {
  setCars(carsResponse.data);
  setFilteredCars(carsResponse.data);
} else {
  console.error("❌ Response is not an array. Something's wrong:", carsResponse.data);
  setCars([]); 
  setFilteredCars([]);
}

        
        const uniqueLocations = Array.isArray(carsResponse.data)
        ? [...new Set<string>(carsResponse.data.map((car: Car) => car.location))]
        : [];
      
      const uniqueCarTypes = Array.isArray(carsResponse.data)
        ? [...new Set<string>(carsResponse.data.map((car: Car) => car.car_type))]
        : [];
      
        setLocations(uniqueLocations);
        setCarTypes(uniqueCarTypes);

        
        const favoritesResponse = await axios.get(`${API_URL}/favorites/`, {
          params: { userEmail },
        });
        
        
        const favoriteIds = Array.isArray(favoritesResponse.data)
        ? favoritesResponse.data.map((fav: any) => fav.car_id)
        : [];
      
        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarsAndFavorites();
  }, [userEmail]);

  
  useEffect(() => {
    filterCars();
  }, [filters, cars]);

  const filterCars = () => {
    let result = [...cars];

    
    if (filters.location) {
      result = result.filter(car => car.location === filters.location);
    }

    
    if (filters.carType) {
      result = result.filter(car => car.car_type === filters.carType);
    }

    
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(car => car.price_per_day >= minPrice);
      }
    }

    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(car => car.price_per_day <= maxPrice);
      }
    }

    setFilteredCars(result);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      carType: "",
    });
  };

  const handleBookCar = (car: Car) => {
    navigate(`/booking/${car.id}`);
  };

  const handleLikeCar = async (car: Car) => {
    if (!userEmail) return;
    
    try {
      
      if (favorites.includes(car.id)) {
        await axios.delete(`${API_URL}/favorites/`, {
          params: {
            userEmail,
            car_id: car.id,
          },
        });
        setFavorites(favorites.filter(id => id !== car.id));
      } 
      
      else {
        await axios.post(
          `${API_URL}/favorites/`,
          { car_id: car.id },
          { params: { userEmail } }
        );
        setFavorites([...favorites, car.id]);
      }
    } catch (err) {
      console.error("Error adding/removing favourite:", err);
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
              AUTO SEARCH
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            Find your perfect car
          </p>
        </div>

       
        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-6 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Filter Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Price ($)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Price ($)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

        
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Car Type</label>
              <select
                name="carType"
                value={filters.carType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        
        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-200">Loading cars...</p>
            </div>
          ) : error ? (
            <div className="text-center p-10 border border-red-700 bg-red-900/20 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center p-10 border border-gray-700 bg-gray-800 rounded-xl">
              <p className="text-gray-300">No cars match your search criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    isLiked={favorites.includes(car.id)}
                    onLike={() => handleLikeCar(car)}
                    onBook={() => handleBookCar(car)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSearch;