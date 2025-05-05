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
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Button,
  
} from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

import PreviewIcon from '@mui/icons-material/Preview';
import {
  fetchInitialCandidates,
  fetchMoreCandidates,
  fetchInitialInActiveCandidates,
  fetchMoreInActiveCandidates,
  updateCandidateStatus,
} from "@/services/candidates";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../ActivateDeactivateConfirmation";

const CandidateList = ({
  getStatusColor = (status) => (status === "Active" ? "success" : "error"),
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [windowWidth, setWindowWidth] = useState(0);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch initial candidates on mount or when showInactive changes
  useEffect(() => {
    const loadInitialCandidates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = showInactive
          ? await fetchInitialInActiveCandidates()
          : await fetchInitialCandidates();
        setCandidates(response.candidates);
        setTotalCandidates(response.pagination.totalCandidates);
      } catch (error) {
        setError(error.message || "Error fetching initial candidates");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialCandidates();

    // Reset scroll position to top
    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, [showInactive]);

  // Scroll handler for infinite scrolling with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    const retryInterval = 200;

    const attachScrollListener = () => {
      const gridElement = gridRef.current?.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (gridElement) {
        gridElement.addEventListener("scroll", handleScroll);
        return true;
      }
      return false;
    };

    const tryAttachListener = () => {
      if (retryCount < maxRetries) {
        if (!attachScrollListener()) {
          retryCount++;
          setTimeout(tryAttachListener, retryInterval);
        }
      } else {
        console.error("Failed to attach scroll listener after max retries");
      }
    };

    const handleScroll = () => {
      if (!gridRef.current || isLoading) {
        return;
      }
      const gridElement = gridRef.current.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (!gridElement) {
        console.error("Virtual scroller not found during scroll");
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = gridElement;

      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        candidates.length < totalCandidates
      ) {
        setIsLoading(true);
        fetchMoreCandidatesHandler();
      }
    };

    const fetchMoreCandidatesHandler = async () => {
      try {
        const nextPage = Math.floor(candidates.length / 10) + 2;
        const response = showInactive
          ? await fetchMoreInActiveCandidates(nextPage)
          : await fetchMoreCandidates(nextPage);
        if (response.candidates.length > 0) {
          setCandidates((prev) => {
            const newCandidates = [...prev, ...response.candidates];
            return newCandidates;
          });
        } else {
          console.log("No more candidates to load");
        }
      } catch (error) {
        setError(error.message || "Error fetching more candidates");
      } finally {
        setIsLoading(false);
      }
    };

    tryAttachListener();

    return () => {
      const gridElement = gridRef.current?.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [candidates.length, isLoading, totalCandidates, showInactive]);

  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialogConfig({ title, message, onConfirm });
    setDialogOpen(true);
  };

  // Function to close dialog
  const closeConfirmDialog = () => {
    setDialogOpen(false);
    setDialogConfig(null);
  };

  // Responsive column config
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      {
        field: "fullName",
        headerName: "Candidate Name",
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: "phone",
        headerName: "Phone",
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: "resumeUrl",
        headerName: "Resume",
        flex: 0.15,
        minWidth: 100,
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) =>
          params.value ? (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                mt: 1,
              }}
            >
              <Tooltip title="View Resume" arrow>
                <IconButton
                  size="small"
                  color="info"
                  component="a"
                  href={params.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                >
                  <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download Resume" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  component="a"
                  href={params.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                >
                  <DownloadIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <span>No Resume</span>
            </Box>
          ),
      },
      {
        field: "totalExperience",
        headerName: "Experience",
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: "noticePeriod",
        headerName: "Notice Period",
        flex: 0.1,
        minWidth: 100,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.15,
        minWidth: 150,
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
            <Tooltip title="Preview Candidate" arrow>
              <IconButton
                size="small"
                color="info"
                sx={{ padding: isMobile ? "1px" : "2px" }}
                onClick={() => router.push(`/candidate-profile/${params.row.id}`)}
              >
                <PreviewIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
            {showInactive ? (
              <Tooltip title="Activate Candidate" arrow>
                <IconButton
                  size="small"
                  color="success"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      'Activate Candidate',
                      'Are you sure you want to activate this candidate?',
                      async () => {
                        try {
                          await updateCandidateStatus(params.row.id, 'Active');
                          setSuccessMessage("Candidate activated successfully");
                          const response = await fetchInitialInActiveCandidates();
                          setCandidates(response.candidates);
                          setTotalCandidates(response.pagination.totalCandidates);
                        } catch (error: any) {
                          setError(error.message || "Error activating candidate");
                        }
                      }
                    );
                  }}
                >
                  <PersonAddIcon fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Deactivate Candidate" arrow>
                <IconButton
                  size="small"
                  color="error"
                  sx={{ padding: isMobile ? "1px" : "2px" }}
                  onClick={() => {
                    openConfirmDialog(
                      'Deactivate Candidate',
                      'Are you sure you want to deactivate this candidate?',
                      async () => {
                        try {
                          await updateCandidateStatus(params.row.id, 'In-Active');
                          setSuccessMessage("Candidate deactivated successfully");
                          const response = await fetchInitialCandidates();
                          setCandidates(response.candidates);
                          setTotalCandidates(response.pagination.totalCandidates);
                        } catch (error: any) {
                          setError(error.message || "Error deactivating candidate");
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
  const rows: GridRowsProp = candidates.map((candidate) => ({
    id: candidate.id,
    fullName: candidate.full_name,
    phone: candidate.phone,
    email: candidate.email,
    resumeUrl: candidate.resumeUrl,
    totalExperience: candidate.totalExperience || "N/A",
    city: candidate.city || "N/A",
    expectedSalary: candidate.expectedSalary || "N/A",
    skills: candidate.skills,
    preferredJobType: candidate.preferredJobType || "N/A",
    preferredLocation: candidate.preferredLocation || "N/A",
    noticePeriod: candidate.noticePeriod || "N/A",
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  }));

  return (
    <>
     <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          variant="contained"
          onClick={() => setShowInactive(!showInactive)}
          sx={{ backgroundColor: showInactive ? "#f44336" : "#5e35b1" }}
        >
          {showInactive ? "Show Active Candidates" : "Show Inactive Candidates"}
        </Button>
      </Box>
    <div style={{ height: 700, width: "100%" }} ref={gridRef}>
      {error && (
        <div style={{ color: "red", textAlign: "center", padding: "8px" }}>
          {error}
        </div>
      )}
     
      <DataGrid
      
        showToolbar
        rows={rows}
        columns={columns}
        rowHeight={isMobile ? 50 : 60}
        autoHeight={false}
        disableSelectionOnClick
        loading={isLoading}
        rowCount={totalCandidates}
        // slots={{
        //   toolbar: (props) => (
        //     <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, alignItems: "center" }}>
        //       <Button
        //         variant="contained"
        //         onClick={() => setShowInactive(!showInactive)}
        //         sx={{ backgroundColor: showInactive ? "#f44336" : "#5e35b1", ml: 1 }}
        //       >
        //         {showInactive ? "Show Active Candidates" : "Show Inactive Candidates"}
        //       </Button>
        //     </Box>
        //   ),
        // }}
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
          Loading more candidates...
        </div>
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
        title={dialogConfig?.title || ''}
        message={dialogConfig?.message || ''}
      />
    </div>
    </>
  );
};

export default CandidateList;