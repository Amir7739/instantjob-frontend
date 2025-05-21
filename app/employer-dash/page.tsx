"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";

// Dynamically import all components with SSR disabled
const Applicants = dynamic(() => import("@/components/employerDashboard/Applicants"), { ssr: false });
const DashboardContent = dynamic(() => import("@/components/employerDashboard/DashboardContent"), { ssr: false });
const JobListings = dynamic(() => import("@/components/employerDashboard/JobListings"), { ssr: false });
const Messages = dynamic(() => import("@/components/employerDashboard/Messages"), { ssr: false });
const TopNav = dynamic(() => import("@/components/employerDashboard/TopNav"), { ssr: false });
const Settings = dynamic(() => import("@/components/employerDashboard/Settings"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/employerDashboard/Sidebar"), { ssr: false });

// Error boundary component to catch runtime errors
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) return <div>Something went wrong.</div>;
  return <>{children}</>;
};

const EmployerDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobile);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSetActiveTab = useCallback((tab: string) => {
    console.log(`Setting active tab: ${tab}`);
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F3F4F6" }}>
      <ErrorBoundary>
        <Sidebar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
        />
      </ErrorBoundary>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ErrorBoundary>
          <TopNav isMobile={isMobile} toggleSidebar={toggleSidebar} />
        </ErrorBoundary>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
            bgcolor: "#F3F4F6",
          }}
        >
          {activeTab === "dashboard" && (
            <ErrorBoundary>
              <DashboardContent />
            </ErrorBoundary>
          )}
          {activeTab === "jobs" && (
            <ErrorBoundary>
              <JobListings />
            </ErrorBoundary>
          )}
          {activeTab === "applicants" && (
            <ErrorBoundary>
              <Applicants />
            </ErrorBoundary>
          )}
          {activeTab === "messages" && (
            <ErrorBoundary>
              <Messages />
            </ErrorBoundary>
          )}
          {activeTab === "settings" && (
            <ErrorBoundary>
              <Settings />
            </ErrorBoundary>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerDashboard;