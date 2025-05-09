"use client";

import { Box, Card, CardContent, Divider, Grid, Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
  count: number;
}

export const SkeletonLoader = ({ count }: SkeletonLoaderProps) => (
  <Box sx={{ flexGrow: 1, p: 2 }}>
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="text" width="70%" height={20} sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, gap: 1 }}>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1, flex: 1 }} />
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1, flex: 1 }} />
              <Skeleton variant="circular" width={36} height={36} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);