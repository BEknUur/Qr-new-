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
  const [rawResponse, setRawResponse] = useState<any>(null);

  // Safe access function for nested properties
  const safeGet = (obj: any, path: string, defaultValue: any = undefined) => {
    if (!obj) return defaultValue;
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === null ? defaultValue : result;
  };

  // Safe array check function
  const ensureArray = (data: any): any[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') {
      // Try to find any array property
      for (const key in data) {
        if (Array.isArray(data[key])) return data[key];
      }
      // If object itself looks like a car, wrap it
      if ('id' in data || 'name' in data) return [data];
    }
    console.warn("Could not extract array from data:", data);
    return []; // Return empty array as fallback
  };

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
    
        console.log("\u{1F680} Fetching cars from URL:", url);
    
        const response = await fetch(url);
    
        if (!response.ok) {
          throw new Error(`Error fetching cars: ${response.status}`);
        }
    
        const responseText = await response.text();
        console.log("\u{1F4E6} Raw API response text:", responseText);
    
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log("\u{1F4CA} Parsed API response:", responseData);
          setRawResponse(responseData);
          
          // Try multiple possible locations for the cars data
          let carsData: CarData[] = [];
          
          // Common patterns in API responses
          const possiblePaths = [
            '', // direct array
            'data',
            'cars',
            'results',
            'items',
            'data.cars',
            'data.items',
            'data.results'
          ];
          
          // Try each path until we find an array
          for (const path of possiblePaths) {
            const dataAtPath = path ? safeGet(responseData, path) : responseData;
            if (dataAtPath) {
              const arrayData = ensureArray(dataAtPath);
              if (arrayData.length > 0) {
                carsData = arrayData;
                console.log(`\u{1F697} Found cars data at path: ${path || 'root'}`);
                break;
              }
            }
          }
          
          // If we still don't have data, try one last approach - any array in the response
          if (carsData.length === 0) {
            const findArrays = (obj: any): any[] => {
              if (!obj || typeof obj !== 'object') return [];
              
              for (const key in obj) {
                if (Array.isArray(obj[key]) && obj[key].length > 0) {
                  // Check if first item looks like a car
                  const firstItem = obj[key][0];
                  if (firstItem && typeof firstItem === 'object' && 
                     ('name' in firstItem || 'id' in firstItem || 'car_type' in firstItem)) {
                    return obj[key];
                  }
                } else if (typeof obj[key] === 'object') {
                  const nestedResult = findArrays(obj[key]);
                  if (nestedResult.length > 0) return nestedResult;
                }
              }
              return [];
            };
            
            const foundArrays = findArrays(responseData);
            if (foundArrays.length > 0) {
              carsData = foundArrays;
              console.log("\u{1F697} Found cars data in nested array");
            }
          }
          
          // Still no data? Try to make some from what we have
          if (carsData.length === 0 && responseData) {
            console.warn("Could not find cars array data. Creating fallback data.");
            if (typeof responseData === 'object') {
              if ('id' in responseData || 'name' in responseData) {
                // Single car object
                carsData = [responseData as CarData];
              } else {
                // Try to convert object properties to cars
                const objValues = Object.values(responseData);
                const possibleCars = objValues.filter(v => 
                  v && typeof v === 'object' && ('name' in v || 'id' in v || 'car_type' in v)
                );
                if (possibleCars.length > 0) {
                  carsData = possibleCars as CarData[];
                }
              }
            }
          }
          
          // Validate and sanitize car data - Здесь исправление на проверку массива
          if (Array.isArray(carsData)) {
            carsData = carsData.map((car, index) => ({
              id: car?.id || index + 1,
              name: car?.name || 'Unknown Car',
              price_per_day: typeof car?.price_per_day === 'number' ? car.price_per_day : 0,
              location: car?.location || 'Unknown Location',
              car_type: car?.car_type || 'Standard',
              description: car?.description || 'No description available',
              owner_email: car?.owner_email || '',
              image_url: car?.image_url || undefined
            }));
          } else {
            console.warn("carsData is not an array:", carsData);
            carsData = [];
          }
          
          console.log("\u{1F697} Final cars data:", carsData);
          
          if (carsData.length === 0) {
            console.warn("No car data found after all attempts");
            // Create dummy data as fallback
            carsData = [
              {
                id: 1,
                name: "Sample Car",
                price_per_day: 5000,
                location: "Sample Location",
                car_type: "Sample Type",
                description: "This is a sample car. API did not return proper data.",
                owner_email: "sample@example.com"
              }
            ];
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
        } catch (e) {
          console.error("\u274C JSON parsing or data processing error:", e);
          throw new Error('Invalid JSON response or data structure');
        }
      } catch (error) {
        console.error('❌ Error fetching cars:', error);
        setError(`Failed to load cars: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Create dummy data for UI testing even when API fails
        const dummyCars: CarData[] = [
          {
            id: 1,
            name: "Example Car (API Error)",
            price_per_day: 5000,
            location: "Example Location",
            car_type: "Sedan",
            description: "This is a fallback car shown when API fails.",
            owner_email: "example@example.com"
          }
        ];
        
        setCars(dummyCars);
        setFilteredCars(dummyCars);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCars();
  }, [locationFilter, typeFilter, searchTerm, priceSort]);
  
  // Безопасное получение уникальных локаций и типов из данных
  const getUniqueValues = (arr: CarData[], property: keyof CarData): string[] => {
    try {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return [];
      const values = arr
        .map(item => (item && item[property] ? String(item[property]) : ''))
        .filter(Boolean);
      return Array.from(new Set(values));
    } catch (e) {
      console.error(`Error getting unique ${property}:`, e);
      return [];
    }
  };
  
  const locations = getUniqueValues(cars, 'location');
  const carTypes = getUniqueValues(cars, 'car_type');
  
  const getCarImage = (car: CarData) => {
    if (car.image_url) return car.image_url;
    
    const carNameLower = car.name.toLowerCase();
    if (carNameLower.includes("bmw")) return "/images/bmw.jpg";
    if (carNameLower.includes("audi")) return "/images/audi.jpg";
    if (carNameLower.includes("mercedes") || carNameLower.includes("maybach")) return "/images/mercedes.jpg";
    return "/images/car-placeholder.jpg"; // Default fallback image
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/1200x600/3b82f6/FFFFFF?text=Premium+Fleet";
            }}
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

        {/* Отладочная информация */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg overflow-auto">
            <h3 className="text-red-400 font-bold mb-2">Error Details</h3>
            <p className="text-red-300 mb-4">{error}</p>
            
            {rawResponse && (
              <div>
                <h4 className="text-yellow-400 font-bold mb-2">API Response:</h4>
                <pre className="bg-black/50 p-4 rounded-md overflow-auto text-xs text-gray-300">
                  {JSON.stringify(rawResponse, null, 2)}
                </pre>
              </div>
            )}
            
            <button 
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md transition-colors duration-300"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
      
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading vehicles...</p>
          </div>
        )}
       
        {!loading && !error && (
          <p className="text-gray-400 mb-6">
            Showing {filteredCars.length} of {cars.length} vehicles
          </p>
        )}
        
        {!loading && filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCars.map((car, index) => (
              <motion.div
                key={car.id || index} // Используем index как fallback для key
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
                    {car.price_per_day?.toLocaleString() || 'N/A'} ₸/day
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white">{car.name || 'Unknown Car'}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin size={16} className="mr-1" />
                      {car.location || 'Unknown Location'}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{car.description || 'No description available'}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-blue-500 fill-blue-500" />
                      ))}
                    </div>
                    <span className="text-blue-400 font-medium">{car.car_type || 'Unknown Type'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading ? (
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