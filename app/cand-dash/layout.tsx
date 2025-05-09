'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { DashboardHeader } from '@/components/candidateDashboard/dashboard-header';
import { DashboardSidebar } from '@/components/candidateDashboard/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setTimeout(() => setIsLoading(false), 500); // Artificial delay for visibility
    };

    router.events?.on('routeChangeStart', handleRouteChangeStart);
    router.events?.on('routeChangeComplete', handleRouteChangeComplete);
    router.events?.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events?.off('routeChangeStart', handleRouteChangeStart);
      router.events?.off('routeChangeComplete', handleRouteChangeComplete);
      router.events?.off('routeChangeError', handleRouteChangeComplete);
    };
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DashboardHeader handleDrawerToggle={handleDrawerToggle} />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          overflow: 'hidden',
          marginTop: '64px', // Offset for fixed header
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'block' }, // Hide sidebar on mobile
            width: 240, // Match drawerWidth from DashboardSidebar
            position: 'fixed',
            top: '64px', // Below header
            height: 'calc(100vh - 64px - 64px)', // Subtract header and footer
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <DashboardSidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            overflowY: 'auto',
            marginLeft: { xs: 0, md: '240px' }, // Offset for sidebar
            height: 'calc(100vh - 64px)', // Constrain to viewport minus header
            paddingBottom: '80px', // Reserve space for fixed footer
          }}
        >
          {isLoading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={200} />
            </Box>
          ) : (
            children
          )}
        </Box>
      </Box>
    </Box>
  );
}