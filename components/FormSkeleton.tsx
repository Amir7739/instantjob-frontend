import React from 'react';
import { Box, Grid, Skeleton, Paper, Typography, Divider } from '@mui/material';

const FormSkeleton = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
      {/* Form Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Form Fields */}
      <Grid container spacing={3}>
        {/* Field Labels */}
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
          <Skeleton 
            variant="rounded" 
            height={56} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out 0.5s infinite'
            }} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton 
            variant="rounded" 
            height={56} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out 0.7s infinite'
            }} 
          />
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width="35%" height={20} sx={{ mb: 1 }} />
          <Skeleton 
            variant="rounded" 
            height={56} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out 0.9s infinite'
            }} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
          <Skeleton 
            variant="rounded" 
            height={56} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out 1.1s infinite'
            }} 
          />
        </Grid>

        {/* Checkbox Area */}
        <Grid item xs={12} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="rounded" width={24} height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Skeleton 
            variant="rounded" 
            width={100} 
            height={40} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out infinite'
            }} 
          />
          <Skeleton 
            variant="rounded" 
            width={120} 
            height={40} 
            sx={{ 
              borderRadius: 1,
              animation: 'pulse 1.5s ease-in-out 0.3s infinite'
            }} 
          />
        </Grid>
      </Grid>

      {/* Add CSS keyframes for the pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Paper>
  );
};

export default FormSkeleton;