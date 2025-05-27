'use client';

import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const DashboardHeader: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {/* <DashboardIcon sx={{ fontSize: 32 }} /> */}
        <Typography variant="h4" fontWeight="bold">
          Recruiter Dashboard
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
        Manage your candidates efficiently and keep track of recruitment progress
      </Typography>
    </Paper>
  );
};

export default DashboardHeader;