import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail, Lock, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/auth/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("userEmail", formData.email);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      localStorage.setItem("accessToken", response.data.access_token);

      navigate("/main");
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-black">
      <Card className="w-full max-w-md p-8 shadow-2xl border border-gray-700 bg-gray-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-white mb-6">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="text-center text-red-400 mb-4">{message}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 text-blue-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white p-3 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 border-gray-600 bg-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg font-medium" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center text-gray-400 text-sm mb-4">Or login with</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center px-4 py-2 rounded-md bg-red-600 text-white font-medium w-28"
              >
                Google
              </button>
              <button
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium w-28"
              >
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-400">
              Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
            </p>
            <p className="text-center text-sm text-gray-400">
              Forgot your password? <Link to="/reset-password" className="text-blue-500">Reset it</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;