// pages/Dashboard.jsx
import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { useDashboard } from "../context/DashboardContext";
import PublicProfiles from "../components/PublicProfiles";
import QuickStats from "../components/Home/QuickStats";
import QuickActions from "../components/Home/QuickActions";
import RecentActivity from "../components/Home/RecentActivity";
import WelcomeBanner from "../components/Home/WelcomeBanner";
import NotificationCenter from "../components/Home/NotificationCenter";

const Dashboard = () => {
  const { user } = useDashboard();
  const [dashboardData] = useState({
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

  return (
    <DashboardLayout>
      <WelcomeBanner user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuickStats stats={dashboardData.stats} />
          <QuickActions />
          <PublicProfiles />
        </div>
        <div className="lg:col-span-1">
          <NotificationCenter notifications={dashboardData.notifications} />
          <RecentActivity activities={dashboardData.activities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
