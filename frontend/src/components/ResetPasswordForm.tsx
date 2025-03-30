import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Mail } from "lucide-react";

const ResetPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }


    setIsSubmitted(true);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-black"
    >
      <Card className="w-full max-w-md p-8 shadow-2xl border border-gray-700 bg-gray-800 rounded-2xl transition-transform hover:scale-105 duration-300">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-white mb-6 tracking-wider">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center text-gray-300">
              <p className="mb-4">
                A password reset link has
                been sent to your email:
              </p>
              <p className="font-bold">{email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400" />
                  <span className="ml-7">Email</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 p-3 pl-10 shadow-inner focus:ring-4 focus:ring-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>

              
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-500 hover:scale-105 focus:ring-4 focus:ring-blue-500 transition-transform"
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
