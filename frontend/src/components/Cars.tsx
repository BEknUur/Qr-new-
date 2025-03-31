import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Filter, ChevronDown, MapPin, Search, Star } from 'lucide-react';

interface CarData {
  id: number;
  name: string;
  price_per_day: number;
  location: string;
  car_type: string;
  description: string;
  owner_email: string;
  image_url?: string; 
}

const API_BASE = import.meta.env.VITE_API_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Cars = () => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [priceSort, setPriceSort] = useState<"none" | "asc" | "desc">("none");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
  
        let url = `${API_BASE}/car/cars`;
  
        if (locationFilter || typeFilter) {
          url = `${API_BASE}/car/cars/search`;
          const params = new URLSearchParams();
  
          if (locationFilter) params.append('location', locationFilter);
          if (typeFilter) params.append('car_type', typeFilter);
  
          url = `${url}?${params.toString()}`;
        }
  
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`Error fetching cars: ${response.status}`);
        }
  
        const responseData = await response.json();
        
        
        let carsData: CarData[] = [];
        
        if (Array.isArray(responseData)) {
          
          carsData = responseData;
        } else if (responseData.data && Array.isArray(responseData.data)) {
        
          carsData = responseData.data;
        } else if (responseData.cars && Array.isArray(responseData.cars)) {
          
          carsData = responseData.cars;
        } else {
         
          console.error("❌ Unexpected response format:", responseData);
          throw new Error("Invalid response format from server");
        }
  
        setCars(carsData);
  
        let processedData = [...carsData];
  
        if (searchTerm) {
          processedData = processedData.filter(car =>
            car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
  
        if (priceSort === "asc") {
          processedData.sort((a, b) => a.price_per_day - b.price_per_day);
        } else if (priceSort === "desc") {
          processedData.sort((a, b) => b.price_per_day - a.price_per_day);
        }
  
        setFilteredCars(processedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to load cars. Please try again later.');
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCars();
  }, [locationFilter, typeFilter, searchTerm, priceSort]);
  
  // Вычисляем уникальные локации и типы автомобилей из имеющихся данных
  const locations = Array.from(new Set(cars.map(car => car.location)));
  const carTypes = Array.from(new Set(cars.map(car => car.car_type)));
  
  const getCarImage = (car: CarData) => {
    if (car.image_url) return car.image_url;
    
    const carNameLower = car.name.toLowerCase();
    if (carNameLower.includes("bmw")) return "/images/bmw.jpg";
    if (carNameLower.includes("audi")) return "/images/audi.jpg";
    if (carNameLower.includes("mercedes") || carNameLower.includes("maybach")) return "/images/mercedes.jpg";
    return `/images/${carNameLower}.jpg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-black text-white">
      
      <div className="relative py-24 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-70"></div>
          <img
            src="/images/car-fleet.jpeg"
            alt="Fleet background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our <span className="text-blue-500">Premium</span> Fleet
          </motion.h1>
          <motion.p
            className="text-xl max-w-2xl mx-auto mb-10 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Browse our extensive collection of premium vehicles and find your perfect match
          </motion.p>
        </div>
      </div>

    
      <div className="container mx-auto px-6 py-8">
        <div className="bg-blue-950/50 rounded-lg p-6 mb-12 shadow-lg border border-blue-900/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or description..."
                className="w-full py-2 pl-10 pr-4 bg-blue-900/50 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full py-2 pl-10 pr-4 bg-blue-900/50 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>

           
            <div className="relative">
              <Car className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full py-2 pl-10 pr-4 bg-blue-900/50 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
              <select
                className="w-full py-2 pl-10 pr-4 bg-blue-900/50 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as "none" | "asc" | "desc")}
              >
                <option value="none">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

      
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading vehicles...</p>
          </div>
        )}

      
        {error && (
          <div className="text-center py-12 bg-red-900/20 rounded-lg border border-red-800">
            <p className="text-red-400">{error}</p>
            <button 
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

       
        {!loading && !error && (
          <p className="text-gray-400 mb-6">
            Showing {filteredCars.length} of {cars.length} vehicles
          </p>
        )}

        
        {!loading && !error && filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id}
                className="bg-blue-950/30 rounded-lg overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 shadow-lg"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={getCarImage(car)}
                    alt={car.name}
                    className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                    
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/car-placeholder.jpg";
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white py-1 px-4 rounded-bl-lg font-bold">
                    {car.price_per_day.toLocaleString()} ₸/day
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">{car.name}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin size={16} className="mr-1" />
                      {car.location}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{car.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-blue-500 fill-blue-500" />
                      ))}
                    </div>
                    <span className="text-blue-400 font-medium">{car.car_type}</span>
                  </div>
                  <div className="mt-6">
                  
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-white mb-4">No Cars Found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Cars;