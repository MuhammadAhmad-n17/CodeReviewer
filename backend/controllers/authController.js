import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const githubLogin = (req, res) => {
  try {
    const redirectUri = `${
      process.env.SERVER_URL || "http://localhost:5000"
    }/auth/github/callback`;

    if (!process.env.GITHUB_CLIENT_ID) {
      console.error("GITHUB_CLIENT_ID is not set");
      return res.status(500).json({ message: "GitHub OAuth not configured" });
    }

    const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

    return res.redirect(authorizeUrl);
  } catch (err) {
    console.error("GitHub login error:", err.message);
    return res
      .status(500)
      .json({ message: "Failed to initiate GitHub login", error: err.message });
  }
};

export const githubCallback = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res
        .status(400)
        .json({ message: "No authorization code provided" });
    }

    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const access_token = tokenRes.data.access_token;

    if (!access_token) {
      console.error("No access token received:", tokenRes.data);
      return res
        .status(400)
        .json({ message: "Failed to get GitHub access token" });
    }

    const profile = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await User.findOne({ githubId: profile.data.id });

    if (!user) {
      user = await User.create({
        githubId: profile.data.id,
        name: profile.data.name,
        email: profile.data.email,
        avatar: profile.data.avatar_url,
        login: profile.data.login,
        githubAccessToken: access_token,
      });
    } else {
      user.githubAccessToken = access_token;
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.redirect(
      `${process.env.CLIENT_URL}/auth-success?token=${jwtToken}`
    );
  } catch (err) {
    console.error("GitHub callback error:", err.message);
    return res
      .status(500)
      .json({ message: "Authentication failed", error: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      githubId: req.user.githubId,
      name: req.user.name,
      login: req.user.login,
      email: req.user.email,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
