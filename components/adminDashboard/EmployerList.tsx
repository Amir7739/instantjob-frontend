import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
  Input,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../ActivateDeactivateConfirmation";
import { debounce } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchInitialEmployers,
  fetchMoreEmployers,
  updateEmployerStatus,
  fetchEmployerStats,
  fetchJobsByEmployer,
  fetchRecentApplicants,
  updateApplicantStatus,
  updateJobStatus,
} from "@/services/eployersApi";
import CandidateListSkeleton from "../CandidateListSkeleton";
import AddEmployerModal from "./AddEmployerModal";
import CustomSnackbar from "../CustomSnackbar";
import { bulkSignupEmployers } from "@/services/employerAuthApi";

interface EmployerDetailsModalProps {
  open: boolean;
  onClose: () => void;
  employerId: string;
  employerName: string;
}

const EmployerDetailsModal: React.FC<EmployerDetailsModalProps> = ({
  open,
  onClose,
  employerId,
  employerName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobsPage, setJobsPage] = useState(1);
  const [applicantsPage, setApplicantsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [hasMoreApplicants, setHasMoreApplicants] = useState(true);
  // Added states for status modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setJobs([]);
      setApplicants([]);
      setJobsPage(1);
      setApplicantsPage(1);
      setHasMoreJobs(true);
      setHasMoreApplicants(true);
      setError(null);
      return;
    }

    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const response = await fetchJobsByEmployer(employerId, 1, null, null, null);
        setJobs(response.jobs);
        setHasMoreJobs(response.pagination.currentPage < response.pagination.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch jobs");
        setHasMoreJobs(false);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    const fetchApplicants = async () => {
      setIsLoadingApplicants(true);
      try {
        const response = await fetchRecentApplicants(employerId, 1);
        setApplicants(response.applicants);
        setHasMoreApplicants(response.pagination.currentPage < response.pagination.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch applicants");
        setHasMoreApplicants(false);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    fetchJobs();
    fetchApplicants();
  }, [open, employerId]);

  const loadMoreJobs = async () => {
    if (!hasMoreJobs || isLoadingJobs) return;
    const nextPage = jobsPage + 1;
    try {
      setIsLoadingJobs(true);
      const response = await fetchJobsByEmployer(employerId, nextPage, null, null, null);
      setJobs((prev) => [...prev, ...response.jobs]);
      setJobsPage(nextPage);
      setHasMoreJobs(response.pagination.currentPage < response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch more jobs");
      setHasMoreJobs(false);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const loadMoreApplicants = async () => {
    if (!hasMoreApplicants || isLoadingApplicants) return;
    const nextPage = applicantsPage + 1;
    try {
      setIsLoadingApplicants(true);
      const response = await fetchRecentApplicants(employerId, nextPage);
      setApplicants((prev) => [...prev, ...response.applicants]);
      setApplicantsPage(nextPage);
      setHasMoreApplicants(response.pagination.currentPage < response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch more applicants");
      setHasMoreApplicants(false);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  // Added handler for updating job status
  const handleUpdateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus);
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      setStatusModalOpen(false);
      setSelectedJob(null);
    } catch (err: any) {
      setError(err.message || "Failed to update job status");
    }
  };

  const jobColumns: GridColDef[] = [
    { field: "title", headerName: "Job Title", flex: 0.2, minWidth: 150 },
    { field: "location", headerName: "Location", flex: 0.15, minWidth: 100 },
    { field: "jobType", headerName: "Job Type", flex: 0.1, minWidth: 100 },
    { field: "status", headerName: "Status", flex: 0.1, minWidth: 100 },
    {
      field: "postedAt",
      headerName: "Posted Date",
      flex: 0.15,
      minWidth: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    // Added action column
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Tooltip title={params.row.status === "Active" ? "Deactivate Job" : "Activate Job"} arrow>
            <IconButton
              size="small"
              color={params.row.status === "Active" ? "error" : "success"}
              onClick={() => {
                setSelectedJob({ id: params.row.id, status: params.row.status });
                setStatusModalOpen(true);
              }}
            >
              {params.row.status === "Active" ? (
                <PersonRemoveIcon fontSize={isMobile ? "small" : "medium"} />
              ) : (
                <PersonAddIcon fontSize={isMobile ? "small" : "medium"} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const applicantColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 0.2, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 0.2, minWidth: 150 },
    { field: "position", headerName: "Position", flex: 0.15, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 0.1, minWidth: 100 },
    { field: "applied", headerName: "Applied", flex: 0.15, minWidth: 120 },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        {employerName} - Details
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <AddIcon sx={{ transform: "rotate(45deg)" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          centered
        >
          <Tab label="Jobs Posted" />
          <Tab label="Recent Applicants" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <InfiniteScroll
              dataLength={jobs.length}
              next={loadMoreJobs}
              hasMore={hasMoreJobs}
              loader={<CandidateListSkeleton />}
              scrollableTarget="jobs-grid"
              style={{ overflow: "visible" }}
            >
              <div id="jobs-grid" style={{ maxHeight: 600, overflowY: "auto" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Jobs Posted
                </Typography>
                <DataGrid
                checkboxSelection disableRowSelectionOnClick
                  showToolbar
                  rows={jobs}
                  columns={jobColumns}
                  autoHeight
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-cell": {
                      fontSize: isMobile ? "12px" : "14px",
                      padding: isMobile ? "4px" : "8px",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      fontSize: isMobile ? "12px" : "14px",
                      backgroundColor: "#5e35b1",
                      color: "white",
                    },
                  }}
                />
              </div>
            </InfiniteScroll>
          )}
          {tabValue === 1 && (
            <InfiniteScroll
              dataLength={applicants.length}
              next={loadMoreApplicants}
              hasMore={hasMoreApplicants}
              loader={<CandidateListSkeleton />}
              scrollableTarget="applicants-grid"
              style={{ overflow: "visible" }}
            >
              <div id="applicants-grid" style={{ maxHeight: 600, overflowY: "auto" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Recent Applicants
                </Typography>
                <DataGrid
                  showToolbar
                  checkboxSelection disableRowSelectionOnClick
                  rows={applicants}
                  columns={applicantColumns}
                  autoHeight
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-cell": {
                      fontSize: isMobile ? "12px" : "14px",
                      padding: isMobile ? "4px" : "8px",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      fontSize: isMobile ? "12px" : "14px",
                      backgroundColor: "#5e35b1",
                      color: "white",
                    },
                  }}
                />
              </div>
            </InfiniteScroll>
          )}
        </Box>
        {/* Added status update modal */}
        <Dialog
          open={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedJob(null);
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Update Job Status</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {selectedJob?.status === "Active" ? "deactivate" : "activate"} this job?
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setStatusModalOpen(false);
                  setSelectedJob(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color={selectedJob?.status === "Active" ? "error" : "success"}
                onClick={() => {
                  if (selectedJob) {
                    handleUpdateJobStatus(selectedJob.id, selectedJob.status === "Active" ? "Inactive" : "Active");
                  }
                }}
              >
                {selectedJob?.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

const EmployerList = ({
  getStatusColor = (status) => (status === "Verified" ? "success" : "error"),
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [windowWidth, setWindowWidth] = useState(0);
  const [employers, setEmployers] = useState<any[]>([]);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [employerStats, setEmployerStats] = useState<{
    [key: string]: { activeJobs: number; totalApplicants: number };
  }>({});
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const loadInitialEmployers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchInitialEmployers();
        const filteredEmployers = response.employers.filter(
          (employer) => employer.verified === !showInactive
        );
        setEmployers(filteredEmployers);
        setTotalEmployers(
          showInactive
            ? response.employers.filter((e) => !e.verified).length
            : response.employers.filter((e) => e.verified).length
        );

        const statsPromises = filteredEmployers.map(async (employer) => {
          try {
            const stats = await fetchEmployerStats(employer.id);
            return {
              id: employer.id,
              activeJobs: stats.find((s) => s.title === "Active Jobs")?.value || 0,
              totalApplicants: stats.find((s) => s.title === "Total Applicants")?.value || 0,
            };
          } catch (error) {
            console.error(`Error fetching stats for employer ${employer.id}:`, error);
            return { id: employer.id, activeJobs: 0, totalApplicants: 0 };
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsMap = statsResults.reduce((acc, stat) => {
          acc[stat.id] = { activeJobs: stat.activeJobs, totalApplicants: stat.totalApplicants };
          return acc;
        }, {});
        setEmployerStats(statsMap);
      } catch (error: any) {
        setError(error.message || "Error fetching initial employers");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialEmployers();

    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, [showInactive]);

  const fetchMoreEmployersHandler = useCallback(
    debounce(async () => {
      if (isLoading || employers.length >= totalEmployers) return;
      try {
        setIsLoading(true);
        const page = Math.floor(employers.length / 10) + 1;
        const response = await fetchMoreEmployers(page);
        const filteredEmployers = response.employers.filter(
          (employer) => employer.verified === !showInactive
        );
        if (filteredEmployers.length > 0) {
          setEmployers((prev) => [...prev, ...filteredEmployers]);

          const statsPromises = filteredEmployers.map(async (employer) => {
            try {
              const stats = await fetchEmployerStats(employer.id);
              return {
                id: employer.id,
                activeJobs: stats.find((s) => s.title === "Active Jobs")?.value || 0,
                totalApplicants: stats.find((s) => s.title === "Total Applicants")?.value || 0,
              };
            } catch (error) {
              console.error(`Error fetching stats for employer ${employer.id}:`, error);
              return { id: employer.id, activeJobs: 0, totalApplicants: 0 };
            }
          });

          const statsResults = await Promise.all(statsPromises);
          setEmployerStats((prev) => ({
            ...prev,
            ...statsResults.reduce((acc, stat) => {
              acc[stat.id] = { activeJobs: stat.activeJobs, totalApplicants: stat.totalApplicants };
              return acc;
            }, {}),
          }));
        } else {
          if (employers.length < totalEmployers) {
            console.warn(
              `Expected more employers but received none. Current: ${employers.length}, Total: ${totalEmployers}`
            );
          }
        }
      } catch (error: any) {
        setError(error.message || "Error fetching more employers");
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [employers.length, isLoading, totalEmployers, showInactive]
  );

  useEffect(() => {
    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.addEventListener("scroll", fetchMoreEmployersHandler);
    } else {
      console.error("Virtual scroller not found");
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("scroll", fetchMoreEmployersHandler);
      }
    };
  }, [fetchMoreEmployersHandler]);

  const openConfirmDialog = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setDialogConfig({ title, message, onConfirm });
    setDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddEmployerSuccess = async () => {
    try {
      const response = await fetchInitialEmployers();
      const filteredEmployers = response.employers.filter(
        (employer) => employer.verified === !showInactive
      );
      setEmployers(filteredEmployers);
      setTotalEmployers(filteredEmployers.length);
      setSnackbar({
        open: true,
        message: "Employer added successfully",
        severity: "success",
      });

      const statsPromises = filteredEmployers.map(async (employer) => {
        try {
          const stats = await fetchEmployerStats(employer.id);
          return {
            id: employer.id,
            activeJobs: stats.find((s) => s.title === "Active Jobs")?.value || 0,
            totalApplicants: stats.find((s) => s.title === "Total Applicants")?.value || 0,
          };
        } catch (error) {
          console.error(`Error fetching stats for employer ${employer.id}:`, error);
          return { id: employer.id, activeJobs: 0, totalApplicants: 0 };
        }
      });

      const statsResults = await Promise.all(statsPromises);
      setEmployerStats((prev) => ({
        ...prev,
        ...statsResults.reduce((acc, stat) => {
          acc[stat.id] = { activeJobs: stat.activeJobs, totalApplicants: stat.totalApplicants };
          return acc;
        }, {}),
      }));
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Error refreshing employer list",
        severity: "error",
      });
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSnackbar({
        open: true,
        message: "No file selected",
        severity: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await bulkSignupEmployers(formData);
      await handleAddEmployerSuccess();
      setSnackbar({
        open: true,
        message: `Bulk upload completed: ${response.totalSuccess} succeeded, ${response.totalErrors} failed`,
        severity: response.totalErrors > 0 ? "error" : "success",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to upload bulk employers",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
      handleMenuClose();
    }
  };

  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: "email",
        headerName: "Email",
        flex: 0.25,
        // minWidth: 120,
      },
      {
        field: "contactNumber",
        headerName: "Phone",
        flex: 0.15,
        // minWidth: 120,
      },
      {
        field: "companyName",
        headerName: "Company Name",
        flex: 0.15,
        // minWidth: 120,
      },
      {
        field: "createdAt",
        headerName: "Registered Date",
        flex: 0.15,
        // minWidth: 120,
        renderCell: (params) => new Date(params.value).toLocaleDateString(),
      },
      {
        field: "industry",
        headerName: "Industry",
        flex: 0.1,
        // minWidth: 100,
      },
      {
        field: "activeJobs",
        headerName: "Active Jobs",
        flex: 0.1,
        // minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {employerStats[params.row.id]?.activeJobs || 0}
          </Box>
        ),
      },
      {
        field: "totalApplicants",
        headerName: "Total Applicants",
        flex: 0.1,
        // minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {employerStats[params.row.id]?.totalApplicants || 0}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.1,
        // minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              color: getStatusColor(params.value),
              fontWeight: "bold",
              mt: 1,
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            {params.value}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.2,
        // minWidth: 200,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 0.5 : 1,
              alignItems: "center",
              mt: 1.5,
            }}
          >
            <Tooltip title="Preview Employer" arrow>
              <IconButton
                size="small"
                color="info"
                sx={{ padding: isMobile ? "1px" : "2px" }}
                onClick={() => router.push(`/employer-dash/employer-profile/${params.row.id}`)}
              >
                <PreviewIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Jobs & Applicants" arrow>
              <IconButton
                size="small"
                color="primary"
                sx={{ padding: isMobile ? "1px" : "2px" }}
                onClick={() => {
                  setSelectedEmployer({ id: params.row.id, name: params.row.companyName });
                  setDetailsModalOpen(true);
                }}
              >
                <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            {showInactive ? (
              <Tooltip title="Activate Employer" arrow>
                <IconButton
                  size="small"
                  color="success"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      "Activate Employer",
                      "Are you sure you want to verify this employer?",
                      async () => {
                        try {
                          await updateEmployerStatus(params.row.id, true);
                          setSuccessMessage("Employer verified successfully");
                          const response = await fetchInitialEmployers();
                          const filteredEmployers = response.employers.filter(
                            (e) => !e.verified
                          );
                          setEmployers(filteredEmployers);
                          setTotalEmployers(filteredEmployers.length);
                        } catch (error: any) {
                          setError(error.message || "Error verify employer");
                        }
                      }
                    );
                  }}
                >
                  <PersonAddIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Deactivate Employer" arrow>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      "Deactivate Employer",
                      "Are you sure you want to deactivate this employer?",
                      async () => {
                        try {
                          await updateEmployerStatus(params.row.id, false);
                          setSuccessMessage("Employer deactivated successfully");
                          const response = await fetchInitialEmployers();
                          const filteredEmployers = response.employers.filter(
                            (e) => e.verified
                          );
                          setEmployers(filteredEmployers);
                          setTotalEmployers(filteredEmployers.length);
                        } catch (error: any) {
                          setError(error.message || "Error deactivating employer");
                        }
                      }
                    );
                  }}
                >
                  <PersonRemoveIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      },
    ];

    return baseColumns;
  };

  const columns = getColumns();
  const rows: GridRowsProp = employers.map((employer) => ({
    id: employer.id,
    name: employer.name,
    email: employer.email,
    companyName: employer.companyName,
    industry: employer.industry || "N/A",
    companyLogo: employer.companyLogo,
    status: employer.verified ? "Verified" : "Non-Verified",
    location: employer.location || "N/A",
    contactNumber: employer.contactNumber || "N/A",
    companySize: employer.companySize || "N/A",
    bio: employer.bio || "N/A",
    website: employer.website || "N/A",
    createdAt: employer.createdAt,
    updatedAt: employer.updatedAt,
    activeJobs: employerStats[employer.id]?.activeJobs || 0,
    totalApplicants: employerStats[employer.id]?.totalApplicants || 0,
  }));

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setShowInactive(!showInactive)}
          sx={{ backgroundColor: showInactive ? "#f44336" : "#5e35b1" }}
        >
          {showInactive ? "Show Verified Employers" : "Show non-verfied Employers"}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleMenuClick}
          sx={{ backgroundColor: "#1976d2" }}
        >
          Add Employer
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setModalOpen(true);
              handleMenuClose();
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Single Employer
          </MenuItem>
          <MenuItem
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <UploadFileIcon sx={{ mr: 1 }} />
            Upload Bulk Employers
          </MenuItem>
        </Menu>
        <Input
          type="file"
          inputRef={fileInputRef}
          style={{ display: "none" }}
          inputProps={{ accept: ".xlsx,.xls" }}
          onChange={handleBulkUpload}
        />
      </Box>
      <div style={{ height: 700, width: "100%", overflow: "auto" }} ref={gridRef}>
        {error && (
          <div style={{ color: "red", textAlign: "center", padding: "8px" }}>
            {error}
          </div>
        )}
        {isLoading ? (
          <CandidateListSkeleton />
        ) : (
          <>
            <DataGrid
              showToolbar
              checkboxSelection disableRowSelectionOnClick
              key={employers.length}
              rows={rows}
              columns={columns}
              rowHeight={isMobile ? 50 : 60}
              autoHeight={false}
              disableSelectionOnClick
              loading={false}
              rowCount={totalEmployers}
              paginationMode="server"
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: isMobile ? "14px" : "16px",
                  padding: isMobile ? "4px" : "8px",
                },
                "& .MuiDataGrid-columnHeader": {
                  fontSize: isMobile ? "14px" : "16px",
                  padding: isMobile ? "8px 4px" : "12px 16px",
                  backgroundColor: "#5e35b1",
                  color: "white",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflow: "auto",
                },
              }}
            />
            {isLoading && (
              <Box sx={{ mt: 1 }}>
                <CandidateListSkeleton />
              </Box>
            )}
          </>
        )}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        </Snackbar>
        <ConfirmDialog
          open={dialogOpen}
          onClose={closeConfirmDialog}
          onConfirm={() => dialogConfig?.onConfirm()}
          title={dialogConfig?.title || ""}
          message={dialogConfig?.message || ""}
        />
        <AddEmployerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleAddEmployerSuccess}
        />
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          severity={snackbar.severity}
        />
        {selectedEmployer && (
          <EmployerDetailsModal
            open={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedEmployer(null);
            }}
            employerId={selectedEmployer.id}
            employerName={selectedEmployer.name}
          />
        )}
      </div>
    </>
  );
};

export default EmployerList;
