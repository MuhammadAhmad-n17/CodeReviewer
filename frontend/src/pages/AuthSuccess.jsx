import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const params = new URLSearchParams(search);
        const token = params.get("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        // Store token
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch user data
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const userRes = await axios.get(`${base}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Store user data
        localStorage.setItem("user", JSON.stringify(userRes.data));

        // Redirect to dashboard
        setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
      } catch (err) {
        console.error("Authentication failed:", err);
        navigate("/", { replace: true });
      }
    };

    authenticate();
  }, [search, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome!</h1>
        <p className="text-xl text-purple-100 mb-2">
          Authenticating your account...
        </p>
        <p className="text-purple-200">Redirecting to dashboard</p>
      </div>
    </div>
  );
}
