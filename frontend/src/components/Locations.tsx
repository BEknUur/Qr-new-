import  { useState } from "react";
import { MapPin, Phone,  Search, Filter, Car } from "lucide-react";

const Locations = () => {
  const [activeCity, setActiveCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [locationType, setLocationType] = useState("all");

 
  const cities = [
    {
      id: "almaty",
      name: "Almaty",
      description: "Central office with our largest fleet selection",
      locations: [
        {
          id: "almaty-airport",
          name: "Almaty International Airport",
          address: "Terminal 1, Arrival Hall, Almaty Airport",
          phone: "+7 771 625 2863",
          hours: "24/7",
          type: "airport"
        },
        {
          id: "almaty-downtown",
          name: "Almaty Downtown Office",
          address: "70 Islam Karimova St, Almaty",
          phone: "+7 771 625 2863",
          hours: "9:00 - 21:00",
          type: "office"
        },
        {
          id: "almaty-railway",
          name: "Almaty Railway Station",
          address: "Almaty-2 Railway Station, North Exit",
          phone: "+7 771 625 2863",
          hours: "8:00 - 22:00",
          type: "railway"
        }
      ]
    },
    {
      id: "astana",
      name: "Astana",
      description: "Convenient locations with streamlined service",
      locations: [
        {
          id: "astana-airport",
          name: "Astana International Airport",
          address: "Terminal Building, Arrivals Level, Astana Airport",
          phone: "+7 771 625 2863",
          hours: "24/7",
          type: "airport"
        },
        {
          id: "astana-downtown",
          name: "Astana Business Center",
          address: "12 Kunayev St, Astana",
          phone: "+7 771 625 2863",
          hours: "9:00 - 21:00",
          type: "office"
        }
      ]
    },
    {
      id: "shymkent",
      name: "Shymkent",
      description: "Best options for southern Kazakhstan regions",
      locations: [
        {
          id: "shymkent-airport",
          name: "Shymkent Airport",
          address: "Departure Hall, Shymkent Airport",
          phone: "+7 771 625 2863",
          hours: "8:00 - 22:00",
          type: "airport"
        },
        {
          id: "shymkent-plaza",
          name: "Shymkent Plaza",
          address: "25 Tauke Khan Avenue, Shymkent",
          phone: "+7 771 625 2863",
          hours: "10:00 - 22:00",
          type: "office"
        }
      ]
    }
  ];

  const locationTypes = [
    { value: "all", label: "All Locations" },
    { value: "airport", label: "Airports" },
    { value: "office", label: "City Offices" },
    { value: "railway", label: "Railway Stations" }
  ];

  
  const getFilteredLocations = () => {
    let filteredLocations: { id: string; name: string; description: string; locations: { id: string; name: string; address: string; phone: string; hours: string; type: string; }[]; }[] = [];
    
    cities.forEach(city => {
      if (activeCity === "all" || activeCity === city.id) {
        const cityLocations = city.locations.filter(location => {
          const matchesType = locationType === "all" || location.type === locationType;
          const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               location.address.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesType && matchesSearch;
        });
        
        if (cityLocations.length > 0) {
          filteredLocations.push({
            ...city,
            locations: cityLocations
          });
        }
      }
    });
    
    return filteredLocations;
  };

  const filteredLocations = getFilteredLocations();

  return (
    <div className="min-h-screen text-white bg-black">
      {/* Header section */}
      <div className="relative py-16 px-6 bg-gradient-to-b from-blue-950 to-black">
        <div className="container mx-auto relative z-10 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Our <span className="text-blue-500">Locations</span>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Find the most convenient pickup and return points for your journey
          </p>
          
          {/* Search and filter section */}
          <div className="bg-blue-950/50 p-6 rounded-lg shadow-lg border border-blue-900/50 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by location name or address..."
                  className="w-full bg-blue-900/30 border border-blue-800 rounded-lg py-2 pl-10 pr-4 text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
                
                {filterOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-blue-900 rounded-lg shadow-xl p-4 z-20 border border-blue-800">
                    <h4 className="font-medium mb-2 text-blue-300">Location Type</h4>
                    <div className="space-y-2">
                      {locationTypes.map(type => (
                        <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="locationType"
                            value={type.value}
                            checked={locationType === type.value}
                            onChange={() => setLocationType(type.value)}
                            className="form-radio text-blue-500 focus:ring-blue-500"
                          />
                          <span>{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* City tabs navigation */}
      <div className="bg-blue-950/20 py-4 sticky top-0 z-20 backdrop-blur-sm border-y border-blue-900/50">
        <div className="container mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              className={`py-2 px-6 rounded-full whitespace-nowrap transition-colors ${
                activeCity === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-blue-900/30 text-gray-300 hover:bg-blue-900/50"
              }`}
              onClick={() => setActiveCity("all")}
            >
              All Cities
            </button>
            {cities.map(city => (
              <button
                key={city.id}
                className={`py-2 px-6 rounded-full whitespace-nowrap transition-colors ${
                  activeCity === city.id 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-900/30 text-gray-300 hover:bg-blue-900/50"
                }`}
                onClick={() => setActiveCity(city.id)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>
     
      {/* Location listings */}
      <section className="py-12 bg-gradient-to-t from-blue-950/20 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Find Your <span className="text-blue-500">Perfect Pickup Point</span>
          </h2>
          
          {filteredLocations.length > 0 ? (
            <div className="space-y-10">
              {filteredLocations.map(city => (
                <div key={city.id}>
                  <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <MapPin className="mr-2 text-blue-500" />
                    {city.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{city.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {city.locations.map(location => (
                      <div 
                        key={location.id}
                        className="bg-blue-950/30 rounded-lg overflow-hidden border border-blue-900/50 hover:border-blue-600/50 transition-all duration-300 shadow-lg"
                      >
                        <div className="bg-blue-900 text-blue-300 px-4 py-2 text-sm font-medium flex items-center">
                          {location.type === "airport" && (
                            <>
                              <Car className="w-4 h-4 mr-2" />
                              Airport Location
                            </>
                          )}
                          {location.type === "office" && (
                            <>
                              <MapPin className="w-4 h-4 mr-2" />
                              City Office
                            </>
                          )}
                          {location.type === "railway" && (
                            <>
                              <Car className="w-4 h-4 mr-2" />
                              Railway Station
                            </>
                          )}
                        </div>
                        
                        <div className="p-6">
                          <h4 className="text-lg font-bold text-white mb-2">{location.name}</h4>
                          <p className="text-gray-400 mb-4">{location.address}</p>
                          
                          <div className="flex items-center justify-between text-sm text-blue-300 mb-4">
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {location.phone}
                            </div>
                            <div>
                              <span className="font-medium">Hours:</span> {location.hours}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-blue-900/50">
                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                              Get Directions
                              <MapPin className="w-4 h-4 ml-1" />
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-sm transition-colors">
                              Select Location
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Locations Found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setLocationType("all");
                  setActiveCity("all");
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-6 rounded transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Choose your location, select your vehicle, and hit the road with QazaqRental
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/cars"
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-md font-medium transition-all"
              >
                Browse Vehicles
              </a>
              <a
                href="/register"
                className="bg-transparent border-2 border-blue-500 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 py-3 px-8 rounded-md font-medium transition-all"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Locations;