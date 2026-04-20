import express from "express";
import Users from "../models/users.models.js";
import Weddings from "../models/weddings.models.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, role,password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const userExists = await Users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await Users.create({ name, email, role, password });


    const token = generateToken(user._id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }


    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
});


// GUEST LOGIN
router.post("/guest-login", async (req, res) => {
  try {
    const { firstName, lastName, authPassword } = req.body;

    if (!firstName || !lastName || !authPassword) {
      return res.status(400).json({ message: "Please provide firstName, lastName, and wedding code" });
    }

    const wedding = await Weddings.findOne({ authPassword });
    if (!wedding) {
      return res.status(404).json({ message: "Invalid wedding code" });
    }

    const isOnGuestList = wedding.guestList.some(
      g => g.firstName.toLowerCase() === firstName.toLowerCase() &&
           g.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (!isOnGuestList) {
      wedding.guestList.push({ firstName, lastName });
      await wedding.save();
    }

    const token = jwt.sign(
      { role: 'guest', weddingId: wedding._id, firstName, lastName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: "Guest login successful",
      token,
      weddingId: wedding._id,
      user: { role: 'guest', firstName, lastName, weddingId: wedding._id }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error with guest login", error: error.message });
  }
});

router.get("/me", protect, (req, res) => {
  res.status(200).json({ message: "User profile", user: req.user });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default router;