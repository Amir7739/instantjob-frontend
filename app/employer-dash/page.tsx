"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

// Dynamically import all components with SSR disabled
const Applicants = dynamic(() => import("@/components/employerDashboard/Applicants"), { ssr: false });
const DashboardContent = dynamic(() => import("@/components/employerDashboard/DashboardContent"), { ssr: false });
const JobListings = dynamic(() => import("@/components/employerDashboard/JobListings"), { ssr: false });
const Messages = dynamic(() => import("@/components/employerDashboard/Messages"), { ssr: false });
const TopNav = dynamic(() => import("@/components/employerDashboard/TopNav"), { ssr: false });
const Settings = dynamic(() => import("@/components/employerDashboard/Settings"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/employerDashboard/Sidebar"), { ssr: false });
const RecentApplicants = dynamic(() => import("@/components/employerDashboard/Applicants"), { ssr: false });
const CandidateSearch = dynamic(() => import("@/components/employerDashboard/CandidateSearch"), { ssr: false });
const SubscriptionHistory = dynamic(() => import("@/components/employerDashboard/SubscriptionHistory"), { ssr: false });

// Error boundary component to catch runtime errors
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) return <div>Something went wrong.</div>;
  return <>{children}</>;
};

const EmployerDashboard: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(!isMobile);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "employer") {
      router.push("/employer-dash/login");
    }
  }, [router]);


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
            // p: { xs: 2, md: 3 },
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
          {activeTab === "recent-applicants" && (
            <ErrorBoundary>
              <RecentApplicants />
            </ErrorBoundary>
          )}
          {activeTab === "candidate-search" && (
            <ErrorBoundary>
              <CandidateSearch />
            </ErrorBoundary>
          )}
          {activeTab === "subscription-history" && (
            <ErrorBoundary>
              <SubscriptionHistory />
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
        <Box
          component="footer"
          sx={{
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerDashboard;
