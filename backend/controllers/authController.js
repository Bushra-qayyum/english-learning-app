import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================
// REGISTER USER
// =======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // prevent fake admin creation
    if (role === "admin" && email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Not allowed to create admin" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "student",
      isActive: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// =======================
// LOGIN USER
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account inactive" });
    }

    // SAFE PASSWORD CHECK
    const isMatch = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isAdmin =
      user.role === "admin" && user.email === process.env.ADMIN_EMAIL;

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};