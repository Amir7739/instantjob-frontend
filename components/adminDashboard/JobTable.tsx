import React, { useEffect, useRef, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
} from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import WorkIcon from '@mui/icons-material/Work';
import WorkOffIcon from '@mui/icons-material/WorkOff';

import { useRouter } from "next/navigation";
import {
  deleteJob,
  fetchInitiaInActivelJobs,
  fetchInitialJobs,
  fetchMoreInActiveJobs,
  fetchMoreJobs,
  updateJobStatus,
} from "@/services/fetchJobForAdmin";
import DeleteConfirmationSnackbar from "../DeleteConfirmationSnackbar";
import { formatSalaryToLPA } from "../JobCard";
import ConfirmDialog from "../ActivateDeactivateConfirmation";

const JobTable = ({
  getStatusColor = (status) => (status === "Active" ? "success" : "error"),
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [windowWidth, setWindowWidth] = useState(0);
  const [visibleJobs, setVisibleJobs] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fetch initial jobs on mount or when showInactive changes
  useEffect(() => {
    const loadInitialJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = showInactive
          ? await fetchInitiaInActivelJobs()
          : await fetchInitialJobs();
        setVisibleJobs(response.data);
        setTotalJobs(response.totalJobs);
      } catch (error: any) {
        setError(error.message || "Error fetching initial jobs");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialJobs();

    // Reset scroll position to top
    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, [showInactive]);

  // Scroll handler for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!gridRef.current || isLoading) return;
      const gridElement = gridRef.current.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (!gridElement) return;

      const { scrollTop, scrollHeight, clientHeight } = gridElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        visibleJobs.length < totalJobs
      ) {
        setIsLoading(true);
        fetchMoreJobsHandler();
      }
    };

    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.addEventListener("scroll", handleScroll);
    } else {
      console.error("Virtual scroller not found");
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [visibleJobs.length, isLoading, totalJobs]);

  const fetchMoreJobsHandler = async () => {
    try {
      const offset = visibleJobs.length; // Correct offset
      const response = showInactive
        ? await fetchMoreInActiveJobs(offset)
        : await fetchMoreJobs(offset);
      if (response.data.length > 0) {
        setVisibleJobs((prev) => [...prev, ...response.data]);
      } else {
        console.log("No more jobs to load");
      }
    } catch (error: any) {
      setError(error.message || "Error fetching more jobs");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (jobId: string) => {
    window.open(`/edit-job/${jobId}`, "_blank");
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteConfirmOpen(true);
  };

  // Handle confirmed deletion
  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      const response = await deleteJob(jobToDelete);
      if (response.success) {
        setVisibleJobs((prev) =>
          prev.filter((job) => job.id !== jobToDelete)
        );
        setTotalJobs((prev) => prev - 1);
        setSuccessMessage("Job deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete job");
      }
    } catch (error: any) {
      setError(error.message || "Error deleting job");
    } finally {
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
    }
  };

  // Close delete confirmation Snackbar
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setJobToDelete(null);
  };

  const handleViewDetails = (jobId: string) => {
    window.open(`/jobs-desc/${jobId}`, "_blank");
  };

  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialogConfig({ title, message, onConfirm });
    setDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };

  // Responsive column config
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: "title",
        headerName: "Job Title",
        flex: isMobile ? 0.4 : windowWidth < 1024 ? 0.25 : 0.15,
        minWidth: isMobile ? 100 : 120,
      },
      {
        field: "companyName",
        headerName: "Company",
        flex: isMobile ? 0.3 : windowWidth < 1024 ? 0.2 : 0.15,
        minWidth: isMobile ? 80 : 100,
      },
      {
        field: "location",
        headerName: "Location",
        flex: windowWidth < 1024 ? 0.2 : 0.15,
        minWidth: 100,
        hideable: isMobile,
      },
      {
        field: "jobType",
        headerName: "Job Type",
        flex: 0.1,
        minWidth: 80,
        hideable: isMobile || windowWidth < 1024,
      },
      {
        field: "salaryRange",
        headerName: "Salary",
        flex: 0.2,
        minWidth: 80,
        hideable: isMobile || windowWidth < 1024,
        renderCell: (params) => formatSalaryToLPA(params.value),
      },
      {
        field: "status",
        headerName: "Status",
        flex: isMobile ? 0.15 : 0.1,
        minWidth: isMobile ? 60 : 80,
        renderCell: (params: GridRenderCellParams) => (
          <Chip
            label={params.value || "Active"}
            size="small"
            color={getStatusColor(params.value || "Active")}
            sx={{ maxWidth: "100%" }}
          />
        ),
      },
      {
        field: "posted",
        headerName: "Posted",
        flex: isMobile ? 0 : windowWidth < 1024 ? 0.1 : 0.15,
        minWidth: 80,
        hideable: isMobile,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: isMobile ? 0.3 : 0.1,
        minWidth: isMobile ? 100 : 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 0.5 : 1,
              alignItems: "center",
              mt: 1,
            }}
          >
            <IconButton
              size="small"
              color="primary"
              sx={{ padding: isMobile ? "1px" : "2px" }}
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
            <Tooltip title="View full job description" arrow>
              <IconButton
                size="small"
                color="info"
                sx={{ padding: isMobile ? "1px" : "2px" }}
                onClick={() => handleViewDetails(params.row.id)}
              >
                <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            {/* <IconButton
              size="small"
              color="error"
              sx={{ padding: isMobile ? "1px" : "2px" }}
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton> */}
             {showInactive ? (
              <Tooltip title="Activate Job" arrow>
                <IconButton
                  size="small"
                  color="success"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      'Activate Job',
                      'Are you sure you want to activate this job?',
                      async () => {
                        try {
                          await updateJobStatus(params.row.id, 'Active');
                          setSuccessMessage("Job activated successfully");
                          const response = await fetchInitiaInActivelJobs();
                          setVisibleJobs(response.data);
                          setTotalJobs(response.totalJobs);
                        } catch (error: any) {
                          setError(error.message || "Error activating Job");
                        }
                      }
                    );
                  }}
                >
                  <WorkIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Deactivate Job" arrow>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      'Deactivate Job',
                      'Are you sure you want to deactivate this Job?',
                      async () => {
                        try {
                          await updateJobStatus(params.row.id, 'In-Active');
                          setSuccessMessage("Job deactivated successfully");
                          const response = await fetchInitialJobs();
                          setVisibleJobs(response.data);
                          setTotalJobs(response.totalJobs);
                        } catch (error: any) {
                          setError(error.message || "Error deactivating Job");
                        }
                      }
                    );
                  }}
                >
                  <WorkOffIcon fontSize={isMobile ? "small" : "medium"} />
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
  const rows: GridRowsProp = visibleJobs;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          variant="contained"
          onClick={() => setShowInactive(!showInactive)}
          sx={{ backgroundColor: showInactive ? "#f44336" : "#5e35b1" }}
        >
          {showInactive ? "Show Active Jobs" : "Show Inactive Jobs"}
        </Button>
      </Box>
      <div style={{ height: 700, width: "100%", overflow: "auto" }} ref={gridRef}>
        {error && (
          <div style={{ color: "red", textAlign: "center", padding: "8px" }}>
            {error}
          </div>
        )}
        <DataGrid
          key={visibleJobs.length}
          showToolbar
          rows={rows}
          columns={columns}
          rowHeight={isMobile ? 50 : 60}
          autoHeight={false}
          disableSelectionOnClick
          loading={isLoading}
          rowCount={totalJobs}
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
          }}
        />
        {isLoading && (
          <div style={{ textAlign: "center", padding: "8px" }}>
            Loading more jobs...
          </div>
        )}
        <DeleteConfirmationSnackbar
          open={deleteConfirmOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName="job"
        />
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
        title={dialogConfig?.title || ''}
        message={dialogConfig?.message || ''}
      />
      </div>
    </>
  );
};

export default JobTable;