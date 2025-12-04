import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        setUser(userData);

        const statsRes = await axios.get(`${base}/api/reviews/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div
        className={`p-4 sm:p-8 ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        } min-h-screen transition-colors`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-12">
            <h1
              className={`text-2xl sm:text-4xl font-bold ${
                isDark ? "text-white" : "text-slate-900"
              } mb-1 sm:mb-2`}
            >
              Welcome back, {user?.login || "Developer"}!
            </h1>
            <p
              className={`${
                isDark ? "text-slate-400" : "text-slate-600"
              } text-sm sm:text-lg`}
            >
              Here's your code review activity
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4`}
              ></div>
              <p
                className={`${
                  isDark ? "text-slate-400" : "text-slate-600"
                } text-sm sm:text-lg`}
              >
                Loading your dashboard...
              </p>
            </div>
          ) : (
            <>
              {/* Metrics Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 animate-stagger">
                {/* Total Reviews Card */}
                <div
                  className={`${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  } rounded-lg sm:rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div
                      className={`p-2 ${
                        isDark ? "bg-blue-900/30" : "bg-blue-100"
                      } rounded-lg shrink-0`}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`${
                          isDark ? "text-slate-400" : "text-slate-600"
                        } text-xs font-medium truncate`}
                      >
                        Total Reviews
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold mt-1 truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.totalReviews || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PRs Analyzed Card */}
                <div
                  className={`${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  } rounded-lg sm:rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div
                      className={`p-2 ${
                        isDark ? "bg-green-900/30" : "bg-green-100"
                      } rounded-lg shrink-0`}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`${
                          isDark ? "text-slate-400" : "text-slate-600"
                        } text-xs font-medium truncate`}
                      >
                        PRs Analyzed
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold mt-1 truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.pullRequestsAnalyzed || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issues Found Card */}
                <div
                  className={`${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  } rounded-lg sm:rounded-xl p-4 border shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div
                      className={`p-2 ${
                        isDark ? "bg-red-900/30" : "bg-red-100"
                      } rounded-lg shrink-0`}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`${
                          isDark ? "text-slate-400" : "text-slate-600"
                        } text-xs font-medium truncate`}
                      >
                        Issues Found
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold mt-1 truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.issuesFound || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avg. Rating Card */}
                <div
                  className={`rounded-lg sm:rounded-xl p-4 border overflow-hidden ${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  } shadow-sm transition-colors`}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isDark ? "bg-yellow-900/30" : "bg-yellow-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isDark ? "text-yellow-400" : "text-yellow-600"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`${
                          isDark ? "text-slate-400" : "text-slate-600"
                        } text-xs font-medium truncate`}
                      >
                        Avg. Rating
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold mt-1 truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.averageRating ? stats.averageRating.toFixed(1) : "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-stagger">
                {/* Start New Review */}
                <div
                  className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer hover-lift hover-glow animate-fade-in-up"
                  onClick={() => navigate("/repositories")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">
                        Start New Review
                      </h3>
                      <p className="text-purple-100">
                        Browse and analyze repositories
                      </p>
                    </div>
                    <svg
                      className="w-12 h-12 opacity-50"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                {/* View Statistics */}
                <div
                  className={`${
                    isDark
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-slate-200"
                  } rounded-xl p-8 border shadow-sm hover:shadow-md transition-shadow hover-lift animate-fade-in-up`}
                >
                  <h3
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    } mb-2`}
                  >
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div
                      className={`flex justify-between items-center p-3 ${
                        isDark ? "bg-slate-700" : "bg-slate-50"
                      } rounded-lg`}
                    >
                      <span
                        className={`${
                          isDark ? "text-slate-300" : "text-slate-600"
                        } font-medium`}
                      >
                        Reviews This Week
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.thisWeek || 0}
                      </span>
                    </div>
                    <div
                      className={`flex justify-between items-center p-3 ${
                        isDark ? "bg-slate-700" : "bg-slate-50"
                      } rounded-lg`}
                    >
                      <span
                        className={`${
                          isDark ? "text-slate-300" : "text-slate-600"
                        } font-medium`}
                      >
                        Avg Issues Per Review
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {stats?.avgIssues || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reviews Section */}
              <div
                className={`${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-slate-200"
                } rounded-xl border shadow-sm animate-fade-in-up`}
              >
                <div
                  className={`p-6 border-b ${
                    isDark ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <h2
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Recent Reviews
                  </h2>
                  <p
                    className={`${
                      isDark ? "text-slate-400" : "text-slate-600"
                    } text-sm mt-1`}
                  >
                    Your latest code analyses
                  </p>
                </div>

                {stats?.recentReviews && stats.recentReviews.length > 0 ? (
                  <div
                    className={`divide-y ${
                      isDark ? "divide-slate-700" : "divide-slate-200"
                    } animate-stagger`}
                  >
                    {stats.recentReviews.map((review, idx) => (
                      <div
                        key={review.id || idx}
                        className={`p-6 ${
                          isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                        } transition-colors cursor-pointer hover-lift animate-fade-in-up`}
                        onClick={() => navigate(`/reviews/${review.id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {review.owner}/{review.repository}
                            </h3>
                            <p
                              className={`text-sm ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {review.prNumber
                                ? `PR #${review.prNumber}`
                                : "Commit Review"}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              review.severity === "high"
                                ? isDark
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-red-100 text-red-700"
                                : review.severity === "medium"
                                ? isDark
                                  ? "bg-amber-900/30 text-amber-400"
                                  : "bg-amber-100 text-amber-700"
                                : isDark
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {review.severity} severity
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {review.issueCount} issue
                            {review.issueCount !== 1 ? "s" : ""} found
                          </span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            {review.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <svg
                      className={`w-16 h-16 ${
                        isDark ? "text-slate-600" : "text-slate-300"
                      } mx-auto mb-4`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                    <p
                      className={`${
                        isDark ? "text-slate-400" : "text-slate-600"
                      } text-lg font-medium`}
                    >
                      No recent reviews
                    </p>
                    <p
                      className={`${
                        isDark ? "text-slate-500" : "text-slate-500"
                      } text-sm mt-1`}
                    >
                      Start by analyzing a repository
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
