import React from "react";

interface Car {
  id: number;
  name?: string;
  location: string;
  price_per_day: number;
  car_type: string;
  description?: string;
  image_url?: string;
}

interface CarCardProps {
  car: Car;
  isLiked: boolean;
  onLike: () => void;
  onBook: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isLiked, onLike, onBook }) => {
  return (
    <div className="relative rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-purple-600/20 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
      <div className="relative">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={car.name || "Car"}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-gray-400 text-xl">No Image</span>
          </div>
        )}
        <button
          onClick={onLike}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-full transition-all hover:bg-black/60"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              isLiked ? "text-pink-500 fill-pink-500" : "text-white"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {car.name || car.car_type}
        </h3>
        <div className="flex items-center mb-2 text-sm text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {car.location}
        </div>

        <div className="text-gray-300 text-sm mb-4">
          {car.description
            ? car.description.substring(0, 100) + "..."
            : `${car.car_type} available for rent.`}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            ${car.price_per_day}
            <span className="text-xs text-gray-400 font-normal">/day</span>
          </div>
          <button
            onClick={onBook}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium transition-all hover:from-blue-600 hover:to-purple-700"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;