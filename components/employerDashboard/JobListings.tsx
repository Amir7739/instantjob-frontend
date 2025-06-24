"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Paper,
  Fade,
  Skeleton,
  Container,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as PlusIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as Trash2Icon,
  FilterList as FilterIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { fetchJobsByEmployer, Job, fetchJobFiltersForEmployer, JobFilters, updateJobStatus } from "@/services/eployersApi";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

// Define interface for pagination state
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  jobsPerPage: number;
  hasMore: boolean;
}

const JobListings: React.FC = () => {
  const router = useRouter();
  // Retrieve employerId from localStorage
  const employerId = localStorage.getItem("id") || "";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 10,
    hasMore: true,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // State for dynamic filters
  const [filters, setFilters] = useState<JobFilters>({
    locations: [],
    statuses: [],
    jobTypes: [],
  });
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const [filtersError, setFiltersError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [snackbar, setSnackBar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "message",
    severity: "success",
  });

  // Fetch filters when component mounts
  useEffect(() => {
    if (!employerId) {
      setFiltersError("Employer ID not found. Please log in.");
      return;
    }

    const loadFilters = async () => {
      setFiltersLoading(true);
      try {
        const filterData = await fetchJobFiltersForEmployer(employerId);
        setFilters(filterData);
        setFiltersError(null);
      } catch (err: any) {
        setFiltersError(err.message || "Failed to load job filters");
      } finally {
        setFiltersLoading(false);
      }
    };
    loadFilters();
  }, [employerId]);

  // Fetch jobs when component mounts or filters change
  useEffect(() => {
    if (!employerId) {
      setError("Employer ID not found. Please log in.");
      return;
    }

    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await fetchJobsByEmployer(
          employerId,
          1,
          statusFilter === "all" ? null : statusFilter,
          typeFilter === "all" ? null : typeFilter,
          locationFilter === "all" ? null : locationFilter
        );
        setJobs(response.jobs);
        setPagination({
          currentPage: 1,
          totalPages: response.pagination.totalPages,
          totalJobs: response.pagination.totalJobs,
          jobsPerPage: response.pagination.jobsPerPage,
          hasMore: response.jobs.length < response.pagination.totalJobs,
        });
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [employerId, statusFilter, typeFilter, locationFilter]);

  // Load more jobs for infinite scroll
  const loadMoreJobs = async () => {
    if (!pagination.hasMore || loading) return;

    setLoading(true);
    try {
      const nextPage = pagination.currentPage + 1;
      const response = await fetchJobsByEmployer(
        employerId,
        nextPage,
        statusFilter === "all" ? null : statusFilter,
        typeFilter === "all" ? null : typeFilter,
        locationFilter === "all" ? null : locationFilter
      );
      const newJobs = [...jobs, ...response.jobs];
      setJobs(newJobs);
      setPagination((prev) => ({
        ...prev,
        currentPage: nextPage,
        hasMore: newJobs.length < prev.totalJobs,
      }));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load more jobs");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
    setPagination((prev) => ({ ...prev, currentPage: 1, hasMore: true }));
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTypeFilter(event.target.value as string);
    setPagination((prev) => ({ ...prev, currentPage: 1, hasMore: true }));
  };

  const handleLocationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setLocationFilter(event.target.value as string);
    setPagination((prev) => ({ ...prev, currentPage: 1, hasMore: true }));
  };

  const handleJobPostClick = () => {
    window.open("/jobs/create", "_blank");
  };

  const handleEdit = (jobId: string) => {
    window.open(`/edit-job/${jobId}`, "_blank");
  };

  const handleOpenModal = async (jobId: string, currentStatus: string): Promise<void> => {
    setSelectedJobId(jobId);
    setSelectedStatus(currentStatus);
    setOpenModal(true);
  };

  const handleCloseModal = async (): Promise<void> => {
    setSelectedJobId("");
    setSelectedStatus("");
    setOpenModal(false);
  };

  const handleUpdateStatus = async (): Promise<void> => {
    if (!selectedJobId || !selectedStatus) return;

    try {
      const response = await updateJobStatus(selectedJobId, selectedStatus);
      setSnackBar({
        open: true,
        message: "Job status updated successfully!",
        severity: "success",
      });

      // Update local jobs state immediately
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === selectedJobId ? { ...job, status: selectedStatus } : job
        )
      );

      // Refresh job list with current filters
      const fetchResponse = await fetchJobsByEmployer(
        employerId,
        1,
        statusFilter === "all" ? null : statusFilter,
        typeFilter === "all" ? null : typeFilter,
        locationFilter === "all" ? null : locationFilter
      );
      setJobs(fetchResponse.jobs);
      setPagination({
        currentPage: 1,
        totalPages: fetchResponse.pagination.totalPages,
        totalJobs: fetchResponse.pagination.totalJobs,
        jobsPerPage: fetchResponse.pagination.jobsPerPage,
        hasMore: fetchResponse.jobs.length < fetchResponse.pagination.totalJobs,
      });

      // Refresh filters to update status dropdown
      try {
        const filterData = await fetchJobFiltersForEmployer(employerId);
        setFilters(filterData);
        setFiltersError(null);
      } catch (err: any) {
        setFiltersError(err.message || "Failed to refresh job filters");
      }

      handleCloseModal();
    } catch (error: any) {
      setSnackBar({
        open: true,
        message: error.message || "Failed to update job status",
        severity: "error",
      });
    }
  };

  // Define DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Job Title",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#10B981",
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.01em",
            }}
          >
            {window.innerWidth < 900
              ? params.value.split(" ")[0]
              : params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 13 },
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          {params.value}
        </Typography>
      ),
      hideable: true,
      hide: window.innerWidth < 900,
    },
    {
      field: "jobType",
      headerName: "Type",
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: "#F3F4F6",
            mt: -4,
            color: "#374151",
            fontSize: { xs: 11, sm: 12 },
            fontWeight: 500,
            border: "1px solid #E5E7EB",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      ),
      hideable: true,
      hide: window.innerWidth < 900,
    },
    {
      field: "openings",
      headerName: "No.of openings",
      width: 100,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TrendingUpIcon
            sx={{
              fontSize: 14,
              color: params.value > 10 ? "#10B981" : "#6B7280",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 13 },
              color: "#111827",
              fontWeight: 600,
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            mt: -4,
            bgcolor:
              params.value === "Active"
                ? "#DCFCE7"
                : params.value === "Paused"
                ? "#FEF3C7"
                : "#F3F4F6",
            color:
              params.value === "Active"
                ? "#166534"
                : params.value === "Paused"
                ? "#92400E"
                : "#374151",
            fontSize: { xs: 11, sm: 12 },
            fontWeight: 600,
            border: `1px solid ${
              params.value === "Active"
                ? "#BBF7D0"
                : params.value === "Paused"
                ? "#FDE68A"
                : "#E5E7EB"
            }`,
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      ),
    },
    {
      field: "postedAt",
      headerName: "Date Posted",
      width: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 13 },
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
      hideable: true,
      hide: window.innerWidth < 900,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View job description" arrow>
            <IconButton
              sx={{
                color: "#6366F1",
                p: { xs: 0.5, sm: 1 },
                bgcolor: "#EEF2FF",
                "&:hover": { bgcolor: "#E0E7FF" },
                borderRadius: 1.5,
              }}
              onClick={() => router.push(`/jobs-desc/${params.row.id}`)}
            >
              <EyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <Tooltip title="Update job status" arrow>
            <IconButton
              sx={{
                color: "#EF4444",
                p: { xs: 0.5, sm: 1 },
                bgcolor: "#FEF2F2",
                "&:hover": { bgcolor: "#FEE2E2" },
                borderRadius: 1.5,
              }}
              onClick={() => handleOpenModal(params.row.id, params.row.status)}
            >
              <Trash2Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const LoadingSkeleton = () => (
    <Card sx={{ p: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{ display: "flex", gap: 2, alignItems: "center" }}
          >
            <Skeleton variant="circular" width={8} height={8} />
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
            <Skeleton variant="text" width="15%" height={20} />
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              p: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 3,
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "30%",
                height: "100%",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50% 0 0 50%",
                transform: "translateX(50%)",
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, zIndex: 1 }}
            >
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                }}
              >
                <WorkIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Job Listings
                </Typography>
                <Typography sx={{ opacity: 0.9, fontSize: 14 }}>
                  Manage and track your job postings
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={handleJobPostClick}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: 14,
                zIndex: 1,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Post Free New Job
            </Button>
          </Box>
        </Fade>

        {/* Filters Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              bgcolor: "#FAFBFC",
            }}
          >
            {filtersLoading ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Skeleton variant="rectangular" width={120} height={40} />
                <Skeleton variant="rectangular" width={120} height={40} />
                <Skeleton variant="rectangular" width={120

} height={40} />
              </Box>
            ) : filtersError ? (
              <Typography
                color="#DC2626"
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                ⚠️ {filtersError}
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#374151",
                    fontWeight: 600,
                    mr: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <FilterIcon sx={{ fontSize: 18 }} />
                  Filters:
                </Typography>

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel sx={{ fontWeight: 500 }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {filters.statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel sx={{ fontWeight: 500 }}>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={handleTypeChange}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {filters.jobTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel sx={{ fontWeight: 500 }}>Location</InputLabel>
                  <Select
                    value={locationFilter}
                    onChange={handleLocationChange}
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB",
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {filters.locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Paper>
        </Fade>

        {/* Error State */}
        {error && (
          <Fade in>
            <Paper
              sx={{
                p: 3,
                bgcolor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 2,
              }}
            >
              <Typography
                color="#DC2626"
                sx={{
                  textAlign: "center",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                ⚠️ {error}
              </Typography>
            </Paper>
          </Fade>
        )}

        {/* Content Section */}
        <Fade in timeout={1000}>
          <Box>
            <InfiniteScroll
              dataLength={jobs.length}
              next={loadMoreJobs}
              hasMore={pagination.hasMore}
              loader={
                loading && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      py: 4,
                    }}
                  >
                    <CircularProgress size={30} sx={{ color: "#6366F1" }} />
                  </Box>
                )
              }
              endMessage={
                !loading && jobs.length > 0 && !pagination.hasMore ? (
                  <Typography
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "#6B7280",
                      fontWeight: 500,
                    }}
                  >
                    No more jobs to load
                  </Typography>
                ) : null
              }
              scrollableTarget="scrollableDiv"
              scrollThreshold="0.9"
              style={{ overflow: "hidden" }}
            >
              <Box
                id="scrollableDiv"
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  scrollBehavior: "smooth",
                }}
              >
                {loading && jobs.length === 0 ? (
                  <LoadingSkeleton />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      border: "1px solid #E5E7EB",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <DataGrid
                    showToolbar
                      rows={jobs}
                      columns={columns}
                      getRowId={(row) => row.id}
                      disableSelectionOnClick
                      sx={{
                        border: "none",
                        height: "80vh",
                        "& .MuiDataGrid-columnHeaders": {
                          bgcolor: "white",
                          color: "#475569",
                          textTransform: "uppercase",
                          fontSize: { xs: 11, sm: 12 },
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          borderBottom: "2px solid #E2E8F0",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        },
                        "& .MuiDataGrid-cell": {
                          py: 2,
                          px: { xs: 1, sm: 2 },
                          borderBottom: "1px solid #F1F5F9",
                        },
                        "& .MuiDataGrid-row": {
                          "&:hover": {
                            bgcolor: "#F8FAFF",
                          },
                        },
                        "& .MuiDataGrid-footerContainer": {
                          display: "none",
                        },
                      }}
                    />
                  </Paper>
                )}
              </Box>
            </InfiniteScroll>
          </Box>
        </Fade>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Update Job Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value as string)}
                sx={{
                  bgcolor: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1D5DB",
                  },
                }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              color="primary"
              variant="contained"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackBar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() => setSnackBar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default JobListings;