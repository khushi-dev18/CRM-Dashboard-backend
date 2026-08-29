import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkeyforttpcrmdashboarddev";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
