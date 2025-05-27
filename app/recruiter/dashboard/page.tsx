'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecruiterDashboard from '@/components/recruiter/RecruiterDashboard';
import { Box, Skeleton, Typography } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'recruiter') {
      router.push('/recruiter/login');
    } else {
      // Simulate slight delay (optional)
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [router]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Loading Recruiter Dashboard...</Typography>
        <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    );
  }

  return <RecruiterDashboard />;
}
