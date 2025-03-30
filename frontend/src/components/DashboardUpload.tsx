import React, { useState, ChangeEvent, DragEvent, useEffect } from "react";
import axios from "axios";
import { 
  UploadCloud, 
  XCircle, 
  Car, 
  MapPin, 
  Tag, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import API_URL from "../config";

const DashboardUpload: React.FC = () => {
  const [carName, setCarName] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [carType, setCarType] = useState("");
  const [description, setDescription] = useState("");
  const [carImage, setCarImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFile = (file: File) => {
   
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (PNG, JPG, or WEBP)");
      return;
    }
    
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    setCarImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    setError(""); 
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !pricePerDay || !location || !carType) {
      setError("Please fill in all mandatory fields!");
      return;
    }

    if (uploadStep === 3 && !carImage) {
      setError("Please upload a car image!");
      return;
    }

    setError("");
    setIsLoading(true);

    if (!userEmail) {
      setError("You do not have the rights to add a car!");
      setIsLoading(false);
      return;
    }

    try {
     
      const formData = new FormData();
      
     
      
     
      formData.append("name", carName);
      formData.append("price_per_day", pricePerDay);
      formData.append("location", location);
      formData.append("car_type", carType);
      formData.append("description", description || "");
      
   
      if (carImage) {
        formData.append("file", carImage);
      }
      
     
      await axios.post(`${API_URL}/car/cars?email=${userEmail}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Car has been successfully added to the catalog!");
      handleClear();
      setUploadStep(1); 
    } catch (err) {
      console.error("Upload error:", err);
      setError("❌ There was an error uploading your car! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCarName("");
    setPricePerDay("");
    setLocation("");
    setCarType("");
    setDescription("");
    setCarImage(null);
    setPreviewImage(null);
    setError("");
  };

  const nextStep = () => {
   
    if (uploadStep === 1) {
      if (!carName || !pricePerDay || !location) {
        setError("Please fill in all mandatory fields before continuing!");
        return;
      }
    } else if (uploadStep === 2) {
      if (!carType) {
        setError("Please select a car type before continuing!");
        return;
      }
    }
    
    setError(""); 
    if (uploadStep < 3) {
      setUploadStep(uploadStep + 1);
    }
  };

  const prevStep = () => {
    if (uploadStep > 1) {
      setUploadStep(uploadStep - 1);
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
                  ADD A CAR
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
          List your car in our catalog and start earning income today
          </p>
        </div>

       
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between">
            <StepIndicator 
              isActive={uploadStep >= 1} 
              isComplete={uploadStep > 1} 
              number={1} 
              title="Main information" 
            />
            <StepIndicator 
              isActive={uploadStep >= 2} 
              isComplete={uploadStep > 2} 
              number={2} 
              title="Additional" 
            />
            <StepIndicator 
              isActive={uploadStep >= 3} 
              isComplete={false} 
              number={3} 
              title="Photo" 
            />
          </div>
          <div className="h-1 bg-gray-800 mt-4 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${(uploadStep - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-900/50 to-red-700/50 border border-red-500/50 backdrop-blur-sm p-4 rounded-lg animate-pulse">
              <AlertCircle className="text-red-400 w-6 h-6 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}
        
        {message && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-900/50 to-emerald-700/50 border border-emerald-500/50 backdrop-blur-sm p-4 rounded-lg">
              <CheckCircle className="text-emerald-400 w-6 h-6 flex-shrink-0" />
              <p className="text-emerald-200">{message}</p>
            </div>
          </div>
        )}

      
        <form onSubmit={handleUpload} className="max-w-4xl mx-auto">
          <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">

            <div className={`transition-all duration-300 ${uploadStep === 1 ? "opacity-100 relative z-10" : "opacity-0 absolute -z-10"}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Car className="w-6 h-6 mr-2 text-blue-400" />
                Main information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1">
                  <LuxuryInputField 
                    label="Name of vehicle" 
                    value={carName} 
                    onChange={setCarName}
                    icon={<Car className="w-5 h-5" />}
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <LuxuryInputField 
                    label="Price for day (₸)" 
                    value={pricePerDay} 
                    onChange={setPricePerDay}
                    type="number"
                    icon={<Tag className="w-5 h-5" />}
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-1 md:col-span-2">
                  <LuxuryInputField 
                    label="Location" 
                    value={location} 
                    onChange={setLocation}
                    icon={<MapPin className="w-5 h-5" />}
                    required
                  />
                </div>
              </div>
            </div>

           
            <div className={`transition-all duration-300 ${uploadStep === 2 ? "opacity-100 relative z-10" : "opacity-0 absolute -z-10"}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-400" />
                Additional information
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col space-y-1">
                  <LuxurySelectField
                    label="Type of vehicle"
                    value={carType}
                    onChange={setCarType}
                    options={[
                      { value: "Sedan", label: "Sedan" },
                      { value: "SUV", label: "SUV" },
                      { value: "Minivan", label: "Minivan" },
                      { value: "Convertible", label: "Convertible" },
                      { value: "Coupe", label: "Coupe" },
                      { value: "Hatchback", label: "Hatchback" },
                      { value: "Wagon", label: "Wagon" },
                      { value: "Van", label: "Van" },
                      { value: "Truck", label: "Truck" },
                    ]}
                    required
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <LuxuryTextareaField
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    placeholder="Tell us about the car's features, benefits and condition..."
                  />
                </div>
              </div>
            </div>

           
            <div className={`transition-all duration-300 ${uploadStep === 3 ? "opacity-100 relative z-10" : "opacity-0 absolute -z-10"}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Camera className="w-6 h-6 mr-2 text-pink-400" />
                Car image 
              </h2>
              
              <div 
                className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                  ${isDragging 
                    ? "border-purple-400 bg-purple-900/20" 
                    : previewImage 
                      ? "border-green-500 border-opacity-50" 
                      : "border-gray-600 hover:border-blue-500 hover:bg-blue-900/10"
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {previewImage ? (
                  <div className="relative w-full h-64 mb-4">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-white/10 shadow-xl"
                      style={{ objectPosition: "center" }}
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-3 bg-black/70 hover:bg-black p-2 rounded-full transition-colors"
                      onClick={() => {
                        setPreviewImage(null);
                        setCarImage(null);
                      }}
                    >
                      <XCircle className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-300 mb-1">
                      Drag a photo or press to select
                      </p>
                      <p className="text-sm text-gray-500">
                      PNG, JPG or WEBP (high quality recommended)
                      </p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                Quality photos increase the chances of renting by 60%
                </p>
              </div>
            </div>

            
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              {uploadStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 rounded-lg font-medium transition-all flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                >
                Back
                </button>
              ) : (
                <div></div>
              )}
              
              {uploadStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-pink-500/20 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding your vehicle...
                    </>
                  ) : (
                    "Add a car"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


const StepIndicator = ({
  isActive,
  isComplete,
  number,
  title,
}: {
  isActive: boolean;
  isComplete: boolean;
  number: number;
  title: string;
}) => {
  const getBgColor = () => {
    if (isComplete) return "bg-gradient-to-r from-blue-500 to-purple-600";
    if (isActive) return "bg-gradient-to-r from-indigo-500 to-blue-600";
    return "bg-gray-800";
  };

  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${getBgColor()} text-white font-bold transition-all duration-300`}
      >
        {isComplete ? <CheckCircle className="w-5 h-5" /> : number}
      </div>
      <p
        className={`mt-2 text-sm ${
          isActive ? "text-blue-400" : "text-gray-500"
        } transition-all duration-300`}
      >
        {title}
      </p>
    </div>
  );
};


const LuxuryInputField = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) => (
  <div className="relative group">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-800/50 transition-all placeholder-transparent"
      placeholder={label}
    />
    <label
      className={`absolute text-sm transition-all duration-200 pointer-events-none
        ${
          value
            ? "top-0 bg-gray-900 px-1 py-px text-xs text-blue-400"
            : "top-3 left-10 text-gray-400"
        }
        group-focus-within:top-0 group-focus-within:left-3 group-focus-within:text-xs group-focus-within:bg-gray-900 group-focus-within:px-1 group-focus-within:py-px group-focus-within:text-blue-400
      `}
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  </div>
);

const LuxurySelectField = ({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div className="relative group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full pl-4 pr-10 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-800/50 transition-all appearance-none"
    >
      <option value="" disabled>
        {label}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-gray-900">
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <label
      className={`absolute text-sm transition-all duration-200 pointer-events-none
        ${
          value
            ? "top-0 left-3 bg-gray-900 px-1 py-px text-xs text-purple-400"
            : "top-3 left-4 text-gray-400"
        }
        group-focus-within:top-0 group-focus-within:left-3 group-focus-within:text-xs group-focus-within:bg-gray-900 group-focus-within:px-1 group-focus-within:py-px group-focus-within:text-purple-400
      `}
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  </div>
);

const LuxuryTextareaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="relative group">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full p-4 h-32 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-800/50 transition-all resize-none"
    />
    <label
      className="absolute left-3 top-0 bg-gray-900 px-1 py-px text-xs text-pink-400 transition-all duration-200"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  </div>
);

export default DashboardUpload;