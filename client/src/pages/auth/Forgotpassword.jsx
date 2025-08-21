import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // ✅ inline error

  const navigate = useNavigate();

  // ✅ Password validation
  const validatePassword = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
    if (!password) return "Password is required";
    if (!strongRegex.test(password)) {
      return "Password must be at least 8 chars and include uppercase, lowercase, number, and special character.";
    }
    return "";
  };

  // ✅ Handle live validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // final check before submit
    const error = validatePassword(newPassword);
    if (error) {
      setPasswordError(error);
      return;
    }

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
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="text-sm">
          {/* --- Email --- */}
          <div className="mb-4">
            <label className="block font-medium text-gray-600 mb-2">Email</label>
            <div className="relative flex items-center">
              <HiMail className="absolute left-3 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* --- New Password --- */}
          <div className="mb-2">
            <label className="block font-medium text-gray-600 mb-2">
              Enter new password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={handlePasswordChange}
                className={`pl-10 pr-10 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none ${
                  passwordError ? "border-red-500" : ""
                }`}
                required
              />
              <span
                className="absolute right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* --- Confirm Password --- */}
          <div className="mb-6">
            <label className="block font-medium text-gray-600 mb-2">
              Confirm new password
            </label>
            <div className="relative flex items-center">
              <HiLockClosed className="absolute left-3 text-gray-400 text-lg" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 py-2 w-full rounded-lg border focus:border-blue-500 focus:outline-none"
                required
              />
              <span
                className="absolute right-3 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Got it?{" "}
          <Link to="/" className="text-blue-600">
            Go Back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
