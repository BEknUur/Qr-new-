import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Edit2,
  Trash2,
  MapPin,
  DollarSign,
  PlusCircle,
  Image
} from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../config";

interface CarAd {
  id: number;
  name: string;
  price_per_day: number;
  price: string; 
  location: string;
  rating: number;
  image_url: string;
  description?: string;
  car_type?: string;
}

interface CarEditData {
  name?: string;
  price_per_day?: number;
  location?: string;
  car_type?: string;
  description?: string;
}

function DashboardAds() {
  const [uploadedCars, setUploadedCars] = useState<CarAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<CarEditData>({
    name: "",
    price_per_day: 0,
    location: "",
    car_type: "",
    description: ""
  });
  const [editImage, setEditImage] = useState<File | null>(null);
  
  const userEmail = localStorage.getItem("userEmail");

  
  const fetchUserCars = async () => {
    if (!userEmail) {
      setError("User not authorized");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
     
      const response = await axios.get(`${API_URL}/car/user-cars?email=${userEmail}`);
      if (response.data && Array.isArray(response.data)) {
        const transformedCars = Array.isArray(response.data)
  ? response.data.map((car: any) => ({
      ...car,
      price: `${car.price_per_day}`
    }))
  : [];
        setUploadedCars(transformedCars);
      }
    } catch (err) {
      console.error("Error when loading vehicles:", err);
      setError("Failed to upload your listings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCars();
  }, [userEmail]);


 
 
  const startInlineEdit = (car: CarAd) => {
    setEditingCarId(car.id);
    setEditFormData({
      name: car.name,
      price_per_day: car.price_per_day,
      location: car.location,
      car_type: car.car_type,
      description: car.description
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'price_per_day' ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditImage(e.target.files[0]);
    }
  };

  const saveChanges = async () => {
    if (!editingCarId || !userEmail) return;
    
    try {
      const formData = new FormData();
      
      
      formData.append('email', userEmail);
      formData.append('name', editFormData.name || '');
      formData.append('price_per_day', (editFormData.price_per_day || 0).toString());
      formData.append('location', editFormData.location || '');
      formData.append('car_type', editFormData.car_type || '');
      formData.append('description', editFormData.description || '');
      
   
      if (editImage) {
        formData.append('file', editImage);
      }
      
    
      console.log("Sending form data:", {
        id: editingCarId,
        email: userEmail,
        name: editFormData.name,
        price_per_day: editFormData.price_per_day,
        location: editFormData.location,
        car_type: editFormData.car_type,
        description: editFormData.description,
        hasImage: !!editImage
      });
      
      
      const response = await axios.put(
        `${API_URL}/car/cars/${editingCarId}?email=${encodeURIComponent(userEmail)}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Update response:", response.data);
      
     
      fetchUserCars();
      
      
      setEditingCarId(null);
      setEditImage(null);
      
    } catch (err: any) {
      console.error("Update Error:", err);
      // More detailed error logging
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      alert("Failed to update the listing. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingCarId(null);
    setEditImage(null);
  };

  
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this ad?")) {
      try {
        await axios.delete(`${API_URL}/car/cars/${id}?email=${userEmail}`);
       
        setUploadedCars((prev) => prev.filter((car) => car.id !== id));
      } catch (err) {
        console.error("Deletion error:", err);
        alert("Failed to delete the ad. Please try again.");
      }
    }
  };

 
  const isValidImageUrl = (url?: string) => {
    return url && url.trim() !== "" && !url.includes("undefined");
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
                 МY CARS
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            Manage your listings and add new vehicles
          </p>
        </div>

        <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-blue-400">
              Total Announcements: {uploadedCars.length}
            </h2>
            
            <Link 
              to="/main/upload" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Upload car 
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-10 rounded-xl border border-red-700 bg-red-900/20">
              <p className="text-red-400">{error}</p>
            </div>
          ) : uploadedCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedCars.map((car) => (
                <div
                  key={car.id}
                  className="group relative overflow-hidden rounded-xl bg-gray-800 shadow-xl border border-gray-700 hover:border-gray-600 transition-all"
                >
                  {editingCarId === car.id ? (
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-4">Edit Car</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Price per day</label>
                          <input
                            type="number"
                            name="price_per_day"
                            value={editFormData.price_per_day}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={editFormData.location}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Car Type</label>
                          <input
                            type="text"
                            name="car_type"
                            value={editFormData.car_type}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleFormChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Car Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                          />
                        </div>
                        
                        <div className="flex space-x-3 pt-2">
                          <button
                            onClick={saveChanges}
                            className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 bg-gray-600 rounded-lg text-white font-medium hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                   
                    <>
                      <div className="relative h-48 overflow-hidden">
                        {isValidImageUrl(car.image_url) ? (
                          <img
                            src={car.image_url}
                            alt={car.name}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <Image className="w-16 h-16 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

                        {car.car_type && (
                          <div className="absolute bottom-3 left-3 flex items-center px-2 py-1 rounded-full bg-blue-900 bg-opacity-70">
                            <span className="text-blue-300 text-xs font-medium">
                              {car.car_type}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-xl font-semibold truncate">
                          {car.name}
                        </h3>

                        <div className="mt-2 flex items-center text-gray-300">
                          <DollarSign className="w-4 h-4 mr-1 text-blue-400" />
                          <span className="text-blue-400 font-medium">
                            {car.price_per_day} ₸/день
                          </span>
                        </div>

                        <div className="mt-1 flex items-center text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{car.location}</span>
                        </div>

                        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                          {car.description || "Нет описания"}
                        </p>
                      </div>

                      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => startInlineEdit(car)}
                          className="p-1.5 rounded-full bg-gray-800 bg-opacity-70 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="p-1.5 rounded-full bg-gray-800 bg-opacity-70 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center p-10 rounded-xl border border-gray-700 bg-gray-800">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300">
                You don't have any announcements
              </h3>
              <p className="mt-2 text-gray-400">
               Add your first car just paste button 
              </p>
              
              <Link 
                to="/main/upload" 
                className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium shadow-lg shadow-purple-500/20 hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add car
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardAds;