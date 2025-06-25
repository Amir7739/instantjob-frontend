"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { DashboardHeader } from "@/components/candidateDashboard/dashboard-header";
import { DashboardSidebar } from "@/components/candidateDashboard/dashboard-sidebar";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      // Redirect to login if no token or role is not 'candidate'
      if (!token || role !== "candidate") {
        router.push("/login");
        return;
      }

      // User is authenticated, stop loading
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Show skeleton loader while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ width: "100%", height: "100vh", p: { xs: 2, md: 3 } }}>
        <Skeleton variant="rectangular" height={64} sx={{ mb: 2 }} /> {/* Header */}
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 240,
              mr: 2,
            }}
          >
            <Skeleton variant="rectangular" height="calc(100vh - 64px)" />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={200} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <DashboardHeader handleDrawerToggle={handleDrawerToggle} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
          marginTop: "64px",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: 240,
            position: "fixed",
            top: "64px",
            height: "calc(100vh - 64px - 64px)",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <DashboardSidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            marginLeft: { xs: 0, md: "240px" },
            height: "calc(100vh - 64px)",
            // paddingBottom: "80px",
          }}
        >
          {children}
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
    </Box>
  );
}