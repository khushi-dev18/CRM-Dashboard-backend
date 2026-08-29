import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeyforttpcrmdashboarddev";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    // Convert to object and omit passwordHash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json({ success: true, token, user: userResponse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      company,
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json({ success: true, token, user: userResponse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ success: true, user: req.user });
});

router.put("/profile", requireAuth, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-passwordHash");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
