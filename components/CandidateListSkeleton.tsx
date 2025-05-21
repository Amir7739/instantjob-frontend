import React from "react";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";

const CandidateListSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Render 10 skeleton rows
  const skeletonRows = Array.from({ length: 10 }).map((_, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        alignItems: "center",
        height: isMobile ? 50 : 60,
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: 2,
      }}
    >
      <Box sx={{ flex: 0.15, minWidth: 120 }}>
        <Skeleton variant="text" width="80%" />
      </Box>
      <Box sx={{ flex: 0.15, minWidth: 120 }}>
        <Skeleton variant="text" width="60%" />
      </Box>
      <Box sx={{ flex: 0.15, minWidth: 120 }}>
        <Skeleton variant="text" width="90%" />
      </Box>
      <Box sx={{ flex: 0.15, minWidth: 100, display: "flex", justifyContent: "center" }}>
        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }} />
        <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }} />
      </Box>
      <Box sx={{ flex: 0.1, minWidth: 100 }}>
        <Skeleton variant="text" width="50%" />
      </Box>
      <Box sx={{ flex: 0.1, minWidth: 100 }}>
        <Skeleton variant="text" width="50%" />
      </Box>
      <Box sx={{ flex: 0.15, minWidth: 150, display: "flex", gap: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </Box>
  ));

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Skeleton for column headers */}
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#5e35b1",
          color: "white",
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ flex: 0.15, minWidth: 120 }}>
          <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.15, minWidth: 120 }}>
          <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.15, minWidth: 120 }}>
          <Skeleton variant="text" width="50%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.15, minWidth: 100, display: "flex", justifyContent: "center" }}>
          <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.1, minWidth: 100 }}>
          <Skeleton variant="text" width="50%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.1, minWidth: 100 }}>
          <Skeleton variant="text" width="60%" sx={{ bgcolor: "grey.300" }} />
        </Box>
        <Box sx={{ flex: 0.15, minWidth: 150 }}>
          <Skeleton variant="text" width="40%" sx={{ bgcolor: "grey.300" }} />
        </Box>
      </Box>
      {/* Skeleton rows */}
      {skeletonRows}
    </Box>
  );
};

export default CandidateListSkeleton;