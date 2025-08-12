import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import HeaderNavigation from "../components/Home/HeaderNavigation";
import PublicProfiles from "../components/PublicProfiles";
import QuickStats from "../components/Home/QuickStats";
import QuickActions from "../components/Home/QuickActions";
import RecentActivity from "../components/Home/RecentActivity";
import WelcomeBanner from "../components/Home/WelcomeBanner";
import NotificationCenter from "../components/Home/NotificationCenter";
import UserProfileService from "../services/userProfile.service";


// Main Home Component
const Dashboard = () => {
  const { user, loading } = useAuth();
  const [decodedUser, setDecodedUser] = useState(null);

  // Mock data - replace with real API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      connections: 248,
      profileViews: 1205,
      messages: 12
    },
    activities: [
      { message: "John Smith viewed your profile", time: "2 hours ago" },
      { message: "New connection request from Sarah Johnson", time: "4 hours ago" },
      { message: "You have a message from Mike Wilson", time: "1 day ago" }
    ],
    notifications: [
      { message: "Complete your profile to get more visibility", time: "1 hour ago" },
      { message: "3 new job opportunities match your skills", time: "3 hours ago" },
      { message: "Weekly network update is available", time: "1 day ago" }
    ]
  });

 useEffect(() => {
    if (user?.token) {
      const fetchData = async () => {
        try {
          const decoded = jwtDecode(user.token);
          const userData = await UserProfileService.getProfileByUserId(decoded.id);
          console.log(userData.data);

          // setDecodedUser(decoded); 
          setDecodedUser(userData.data);

        } catch (err) {
          console.error("Invalid token or API error", err);
        }
      };
      fetchData();
    }
  }, [user])

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => {
    return decodedUser || user || {};
  }, [decodedUser, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNavigation user={userData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner user={userData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <QuickStats stats={dashboardData.stats} />
            <QuickActions />
            <PublicProfiles />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <NotificationCenter notifications={dashboardData.notifications} />
            <RecentActivity activities={dashboardData.activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;