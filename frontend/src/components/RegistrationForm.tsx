import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config"; 

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.username) newErrors.username = "Username is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email.";
    if (formData.password.length < 6) newErrors.password = "At least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await axios.post(`${API_URL}/auth/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
  
      localStorage.setItem("userEmail", formData.email); 
      localStorage.setItem("accessToken", response.data.access_token); 
  
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-black">
      <Card className="w-full max-w-md p-8 shadow-2xl border border-gray-700 bg-gray-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-white mb-6">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="text-center text-green-400">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`w-full rounded-lg bg-gray-700 border ${errors.username ? "border-red-500" : "border-gray-600"} text-white p-3 pl-10`}
                  required
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full rounded-lg bg-gray-700 border ${errors.email ? "border-red-500" : "border-gray-600"} text-white p-3 pl-10`}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full rounded-lg bg-gray-700 border ${errors.password ? "border-red-500" : "border-gray-600"} text-white p-3 pl-10`}
                  required
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full rounded-lg bg-gray-700 border ${errors.confirmPassword ? "border-red-500" : "border-gray-600"} text-white p-3 pl-10`}
                  required
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;