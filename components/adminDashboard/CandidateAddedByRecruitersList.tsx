"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Description as ResumeIcon,
  Work as WorkIcon,
  CalendarToday as DateIcon,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";
import CandidateListSkeleton from "../CandidateListSkeleton";

interface Candidate {
  _id: string;
  full_name: string;
  phone: string;
  email: string;
  resumeUrl: string;
  jobRole?: string;
  exp?: string;
  createdBy?: {
    _id: string;
    full_name: string;
  };
  createdAt: string;
  createdByFullName?: string; // New field for search
}

const CandidateAddedByRecruitersList = () => {
  const [data, setData] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "Candidate",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 36,
              height: 36,
              fontSize: "0.875rem",
            }}
          >
            {params.value?.charAt(0)?.toUpperCase() || "C"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
              }}
            >
              {params.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.25,
              }}
            >
              <PersonIcon sx={{ fontSize: 12 }} />
              Candidate Profile
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: "Contact",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
          >
            <PhoneIcon
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            />
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {params.value}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <EmailIcon
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: "none",
                fontSize: "0.75rem",
                maxWidth: 140,
                wordBreak: "break-all",
                whiteSpace: "normal",
              }}
              component="a"
              href={`mailto:${params.row.email}`}
            >
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "jobRole",
      headerName: "Position",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          {params.value ? (
            <Chip
              icon={<WorkIcon sx={{ fontSize: 16 }} />}
              label={params.value}
              variant="outlined"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                mt: -3,
                fontWeight: 500,
                "& .MuiChip-icon": {
                  color: theme.palette.primary.main,
                },
              }}
            />
          ) : (
            <Chip
              label="Not Specified"
              variant="outlined"
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.grey[500], 0.1),
                borderColor: theme.palette.grey[400],
                color: theme.palette.text.secondary,
                mt: -3,
              }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "resumeUrl",
      headerName: "Resume",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
          <Tooltip title="View Resume" arrow>
            <IconButton
              component="a"
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                "&:hover": {
                  bgcolor: alpha(theme.palette.success.main, 0.2),
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ResumeIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "createdByFullName", // Use new field for search
      headerName: "Added By",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 28,
                height: 28,
                fontSize: "0.75rem",
              }}
            >
              {params.value?.charAt(0)?.toUpperCase() || "R"}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {params.value || "Unknown"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary }}
              >
                Recruiter
              </Typography>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Added On",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <DateIcon
              sx={{ fontSize: 14, color: theme.palette.text.secondary }}
            />
            <Typography variant="body2">
              {new Date(params.value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary, ml: 2.5 }}
          >
            {new Date(params.value).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      ),
    },
  ];

  const fetchCandidates = async (pageNum: number) => {
    if (loading || pageNum > totalPages) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/recruiter/candidates/get-all?page=${pageNum}&limit=10`
      );

      const newCandidates: Candidate[] = res.data.candidates.map(
        (candidate: Candidate) => ({
          ...candidate,
          createdByFullName: candidate.createdBy?.full_name || "Unknown", // Flatten createdBy for search
        })
      );

      setData((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const uniqueNew = newCandidates.filter((c) => !existingIds.has(c._id));
        return [...prev, ...uniqueNew];
      });

      setTotalPages(res.data.pages);
      setPage(pageNum + 1);
    } catch (err) {
      console.error("Error fetching candidates:", err);
    }
    setLoading(false);
    if (pageNum === 1) {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates(1);
  }, []);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && page <= totalPages) {
        fetchCandidates(page);
      }
    },
    [page, totalPages]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const CustomNoRowsOverlay = () => (
    <GridOverlay>
      <Card
        sx={{
          textAlign: "center",
          p: 4,
          bgcolor: "transparent",
          boxShadow: "none",
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
          }}
        >
          <PersonIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary, mb: 1 }}
        >
          No Candidates Found
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          There are no candidates added by recruiters yet.
        </Typography>
      </Card>
    </GridOverlay>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Card */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
        }}
      >
        <CardContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 48,
                height: 48,
              }}
            >
              <PersonIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                Candidates Directory
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage and review candidates added by recruiters
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Show skeleton during initial loading */}
      {initialLoading ? (
        <Paper elevation={2}>
          <CandidateListSkeleton />
        </Paper>
      ) : (
        <Paper
          elevation={2}
          sx={{
            height: 800,
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `2px solid ${alpha(
                theme.palette.primary.main,
                0.1
              )}`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            "& .MuiDataGrid-row": {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
          }}
        >
          <DataGrid
            showToolbar
            rows={data}
            getRowId={(row) => row?._id || Math.random().toString()} // Fallback ID
            columns={columns}
            pageSize={data.length}
            rowsPerPageOptions={[data.length]}
            disableSelectionOnClick
            rowHeight={80}
            components={{
              Toolbar: GridToolbar,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            componentsProps={{
              toolbar: {
                sx: {
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.5
                  )}`,
                  py: 1,
                },
              },
            }}
          />
        </Paper>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerRef} />

      {/* Loading Indicator for pagination */}
      {loading && !initialLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }}
          >
            <CircularProgress
              size={24}
              sx={{ color: theme.palette.primary.main }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            >
              Loading more candidates...
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default CandidateAddedByRecruitersList;