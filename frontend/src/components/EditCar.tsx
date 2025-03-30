import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const EditCar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState({
    name: "",
    price_per_day: "",
    location: "",
    car_type: "",
    description: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}/cars/${id}`)
      .then((response) => setCar(response.data))
      .catch((error) => console.error("Error fetching car:", error));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/cars/${id}`, car);
      navigate("/my-ads");
    } catch (error) {
      console.error("Failed to update car:", error);
    }
  };

  return (
    <div>
      <h1>Edit Car</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={car.name}
          onChange={(e) => setCar({ ...car, name: e.target.value })}
        />
        <input
          type="text"
          value={car.price_per_day}
          onChange={(e) => setCar({ ...car, price_per_day: e.target.value })}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCar;
