"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Applicants from "@/components/employerDashboard/Applicants";
import DashboardContent from "@/components/employerDashboard/DashboardContent";
import JobListings from "@/components/employerDashboard/JobListings";
import Messages from "@/components/employerDashboard/Messages";
import TopNav from "@/components/employerDashboard/TopNav";
import Settings from "@/components/employerDashboard/Settings";
import Sidebar from "@/components/employerDashboard/Sidebar";


const EmployerDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobile);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSetActiveTab = useCallback((tab: string) => {
    console.log(`Setting active tab: ${tab}`); // Debug_DURATION
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F3F4F6" }}>
      <Sidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopNav
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
            bgcolor: "#F3F4F6",
          }}
        >
          {activeTab === "dashboard" && <DashboardContent />}
          {activeTab === "jobs" && <JobListings />}
          {activeTab === "applicants" && <Applicants />}
          {activeTab === "messages" && <Messages />}
          {activeTab === "settings" && <Settings />}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerDashboard;