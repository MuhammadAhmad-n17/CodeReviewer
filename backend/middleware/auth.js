import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("⚠️ No authorization header provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("⚠️ No bearer token found in authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    console.log("🔐 Verifying token:", token.substring(0, 20) + "...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, userId:", decoded.userId);

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error("❌ User not found for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.login);

    if (!user.githubAccessToken) {
      console.warn("⚠️ User found but githubAccessToken is missing:", user._id);
      return res.status(403).json({
        message: "GitHub access token not found. Please re-authenticate.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    res
      .status(401)
      .json({ message: "Authentication failed", error: err.message });
  }
};
