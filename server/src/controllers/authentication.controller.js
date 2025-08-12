import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    await Admin.create({ name, email, password });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(admin._id);
    res.json({ admin, token, message: "Logged In successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Admin Logout
export const logoutAdmin = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

// Update Password for Admin
export const updatePassword = async (req, res) => {
  try {
    const id = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({
          message: "The new password must be different from the old password.",
        });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    return res
      .status(200)
      .json({ success: true, message: "Admin password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
// Forgot Password (without old password)
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};