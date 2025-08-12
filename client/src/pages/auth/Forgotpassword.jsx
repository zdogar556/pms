import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        email,
        newPassword,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>

          {/* Email with Icon */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-gray-500">
              <HiMail size={20} />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border rounded"
              required
            />
          </div>

          {/* New Password with Icon + Eye Toggle */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-3 text-gray-500">
              <HiLockClosed size={20} />
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 pl-10 pr-10 border rounded"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </span>
          </div>

          {/* Confirm Password with Icon + Eye Toggle */}
          <div className="relative mb-6">
            <span className="absolute left-3 top-3 text-gray-500">
              <HiLockClosed size={20} />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pl-10 pr-10 border rounded"
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
