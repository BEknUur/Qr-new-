import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import API_URL from "../config";

interface Car {
  id: number;
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  location: string;
  price_per_day: number;
  car_type: string;
  description?: string;
  image_url?: string;
}

interface BookingFormData {
  carId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  paymentMethod: string;
}

const DashboardBooking: React.FC = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    carId: 0,
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalPrice: 0,
    paymentMethod: "credit",
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem("userEmail");
  
 
  const carIdFromUrl = location.pathname.split("/").pop();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  
  useEffect(() => {
    const fetchFavoriteCars = async () => {
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
        
        
        const transformedCars: Car[] = Array.isArray(response.data)
        ? response.data.map((car: Car) => ({
            ...car,
            make: car.make || car.name?.split(' ')[0] || car.car_type,
            model: car.model || car.name?.split(' ').slice(1).join(' ') || '',
            price: car.price_per_day,
            image: car.image_url || `https://via.placeholder.com/300x200?text=${car.car_type}`
          }))
        : [];
        
        setAvailableCars(transformedCars);
        
       
        if (carIdFromUrl) {
          const carId = parseInt(carIdFromUrl);
          const car = transformedCars.find((c: Car) => c.id === carId);
          if (car) {
            handleSelectCar(car);
          }
        }
      } catch (err) {
        console.error("Error loading favourites:", err);
        setError("Failed to load your favorite cars.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCars();
  }, [carIdFromUrl, userEmail]);

 
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setFormData({
      ...formData,
      carId: car.id,
      totalPrice: car.price_per_day || 0,
    });
    setStep(2);
  };

 
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

   
    if (name === "startDate" || name === "endDate") {
      if (updatedFormData.startDate && updatedFormData.endDate) {
        const start = new Date(updatedFormData.startDate);
        const end = new Date(updatedFormData.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0) {
          const days = Math.max(1, diffDays);
          updatedFormData.totalDays = days;

          
          let price = selectedCar?.price_per_day || 0;
          if (days >= 7) {
            price = price * 0.85;
          }
          updatedFormData.totalPrice = price * days;
        }
      }
    }

    setFormData(updatedFormData);
  };

  
  const handleNextStep = () => {
    
    if (step === 2) {
      if (!formData.startDate || !formData.endDate) {
        setError("Please select both start and end dates");
        return;
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError("End date cannot be earlier than start date");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };
  const handlePrevStep = () => {
    setStep(step - 1);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
   
      await new Promise((r) => setTimeout(r, 1500));

      setBookingSuccess(true);
      setMessage("Booking successful!");
      console.log("Booking submitted:", formData);
    } catch (err) {
      setError("Something went wrong. Please try again later!");
    } finally {
      setIsLoading(false);
    }
  };

 
  const renderCarSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableCars.length === 0 ? (
        <div className="col-span-3 text-center p-10 border border-gray-700 bg-gray-800 rounded-xl">
          <p className="text-gray-300 mb-2">You have no favourite cars yet.</p>
          <p className="text-gray-500 text-sm">
            Go to <strong>Favourites</strong> and add some cars first.
          </p>
          <button
            onClick={() => navigate("/main/favourite")}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white"
          >
            View Favourites
          </button>
        </div>
      ) : (
        availableCars.map((car) => (
          <div
            key={car.id}
            className="relative bg-black/40 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => handleSelectCar(car)}
          >
            <img
              src={car.image_url || `https://via.placeholder.com/300x200?text=${car.car_type}`}
              alt={car.name || car.car_type}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold text-white mb-1">
              {car.name || `${car.make || car.car_type} ${car.model || ''}`} {car.year ? `(${car.year})` : ''}
            </h3>
            <p className="text-gray-300 text-sm">{car.location}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-blue-400 font-bold">{car.price_per_day} ₸ / day</span>
              <span className="text-xs text-gray-400">{car.car_type}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );


  const renderDateSelection = () => (
    <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
      <h2 className="text-2xl font-bold text-white mb-6">
        Choose Dates for {selectedCar?.name || `${selectedCar?.make || ''} ${selectedCar?.model || ''}`}
      </h2>

      {error && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-red-900/50 to-red-700/50 border border-red-500/50 backdrop-blur-sm p-4 rounded-lg mb-6">
          <AlertCircle className="text-red-400 w-6 h-6 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-medium">
            Pickup Date
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-black/50 border border-gray-700 text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-300 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2 font-medium">
            Return Date
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Calendar className="w-5 h-5" />
            </div>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-black/50 border border-gray-700 text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-300 transition-colors"
            />
          </div>
        </div>
      </div>
      {formData.totalDays > 0 && (
        <div className="mt-6 p-4 bg-black/30 rounded-md border border-white/10">
          <h4 className="text-lg font-semibold text-gray-200 mb-2">
            Booking Summary
          </h4>
          <div className="flex justify-between text-gray-300 mb-1">
            <span>Daily rate:</span>
            <span>{selectedCar?.price_per_day} ₸</span>
          </div>
          <div className="flex justify-between text-gray-300 mb-1">
            <span>Number of days:</span>
            <span>{formData.totalDays}</span>
          </div>
          {formData.totalDays >= 7 && (
            <div className="flex justify-between text-green-400 mb-1">
              <span>Long-term discount (15%):</span>
              <span>
                -
                {(
                  (selectedCar?.price_per_day || 0) *
                  formData.totalDays *
                  0.15
                ).toFixed(0)}
                ₸
              </span>
            </div>
          )}
          <div className="flex justify-between font-bold text-white text-lg mt-2 pt-2 border-t border-white/10">
            <span>Total:</span>
            <span>{formData.totalPrice.toFixed(0)} ₸</span>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 rounded-lg font-medium transition-all flex items-center focus:outline-none"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-purple-500/20 focus:outline-none"
        >
          Continue
        </button>
      </div>
    </div>
  );

 
  const renderPaymentDetails = () => (
    <form
      onSubmit={handleSubmit}
      className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>

      {error && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-red-900/50 to-red-700/50 border border-red-500/50 backdrop-blur-sm p-4 rounded-lg mb-6">
          <AlertCircle className="text-red-400 w-6 h-6 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-2 font-medium">
          Payment Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="relative border border-white/10 bg-black/40 p-4 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={formData.paymentMethod === "credit"}
              onChange={handleInputChange}
            />
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-gray-200">Credit Card</span>
          </label>
          
          <label className="relative border border-white/10 bg-black/40 p-4 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="debit"
              checked={formData.paymentMethod === "debit"}
              onChange={handleInputChange}
            />
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-gray-200">Debit Card</span>
          </label>
          
          <label className="relative border border-white/10 bg-black/40 p-4 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={formData.paymentMethod === "cash"}
              onChange={handleInputChange}
            />
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-gray-200">Cash on Pickup</span>
          </label>
        </div>
      </div>

      {formData.paymentMethod !== "cash" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Beknur"
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full p-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all"
              />
            </div>
          </div>
        </>
      )}

      
      <div className="mt-4 p-4 bg-black/30 rounded-md border border-white/10">
        <h4 className="text-lg font-semibold text-gray-200 mb-2">
          Booking Summary
        </h4>
        <div className="flex justify-between text-gray-300 mb-1">
          <span>Vehicle:</span>
          <span>{selectedCar?.name || `${selectedCar?.make || ''} ${selectedCar?.model || ''}`}</span>
        </div>
        <div className="flex justify-between text-gray-300 mb-1">
          <span>Pickup date:</span>
          <span>{formData.startDate}</span>
        </div>
        <div className="flex justify-between text-gray-300 mb-1">
          <span>Return date:</span>
          <span>{formData.endDate}</span>
        </div>
        <div className="flex justify-between text-gray-300 mb-1">
          <span>Duration:</span>
          <span>{formData.totalDays} days</span>
        </div>
        <div className="flex justify-between font-bold text-white text-lg mt-2 pt-2 border-t border-white/10">
          <span>Total:</span>
          <span>{formData.totalPrice.toFixed(0)} ₸</span>
        </div>
      </div>

     
      <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handlePrevStep}
          className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 rounded-lg font-medium transition-all flex items-center focus:outline-none"
        >
          Back
        </button>

        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-pink-500/20 focus:outline-none"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );

  
  const renderConfirmation = () => (
    <div className="relative backdrop-blur-sm bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden text-center">
      <div className="flex flex-col items-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-400 mb-2" />
        <h3 className="text-2xl font-semibold text-white">Booking Confirmed!</h3>
      </div>
      <p className="text-gray-300 mb-6">
        Your booking for the <strong>{selectedCar?.name || `${selectedCar?.make || ''} ${selectedCar?.model || ''}`}</strong> has been successfully confirmed.
      </p>
      <div className="text-left bg-black/30 border border-white/10 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-200 mb-3">
          Booking Details
        </h4>
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Booking ID:</span>
          <span>BK{Math.floor(Math.random() * 100000)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Pickup date:</span>
          <span>{formData.startDate}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Return date:</span>
          <span>{formData.endDate}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Payment method:</span>
          <span>{formData.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm text-white mt-2 pt-2 border-t border-white/10">
          <span>Total:</span>
          <span className="font-bold">{formData.totalPrice.toFixed(0)} ₸</span>
        </div>
      </div>
      <p className="text-gray-400 mb-6">
        A confirmation has been sent to your email. Thank you!
      </p>
      <button
        type="button"
        onClick={() => navigate("/main/favourite")}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-pink-500/20"
      >
        Back to Favourites
      </button>
    </div>
  );

  
  const renderLoading = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );

  
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

  const progressPercentage = (step - 1) * 50;

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
              BOOK A CAR
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl text-center">
            Choose from your favorite cars, select dates, and confirm payment in just a few clicks
          </p>
        </div>

        {!bookingSuccess && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between">
              <StepIndicator
                isActive={step >= 1}
                isComplete={step > 1}
                number={1}
                title="Select Car"
              />
              <StepIndicator
                isActive={step >= 2}
                isComplete={step > 2}
                number={2}
                title="Choose Dates"
              />
              <StepIndicator
                isActive={step >= 3}
                isComplete={false}
                number={3}
                title="Payment"
              />
            </div>
            <div className="h-1 bg-gray-800 mt-4 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
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

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            renderLoading()
          ) : bookingSuccess ? (
            renderConfirmation()
          ) : step === 1 ? (
            renderCarSelection()
          ) : step === 2 ? (
            renderDateSelection()
          ) : (
            renderPaymentDetails()
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardBooking;