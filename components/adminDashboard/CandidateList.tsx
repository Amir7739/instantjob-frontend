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
  Menu,
  MenuItem,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddIcon from "@mui/icons-material/Add";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  fetchInitialCandidates,
  fetchMoreCandidates,
  fetchInitialInActiveCandidates,
  fetchMoreInActiveCandidates,
  updateCandidateStatus,
} from "@/services/candidates";
import { useRouter } from "next/navigation";
import ConfirmDialog from "../ActivateDeactivateConfirmation";
import { handleExcelUpload } from "@/utils/excelUpload";
import { debounce } from "lodash";
import CandidateListSkeleton from "../CandidateListSkeleton";
import AddCandidateModal from "./AddCandidateModal";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const loadInitialCandidates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = showInactive
          ? await fetchInitialInActiveCandidates()
          : await fetchInitialCandidates();
        console.log("Initial candidates response:", response);
        console.log(
          "Total candidates set to:",
          response.pagination.totalCandidates
        );
        setCandidates(response.candidates);
        setTotalCandidates(response.pagination.totalCandidates);
      } catch (error) {
        setError(error.message || "Error fetching initial candidates");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialCandidates();

    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, [showInactive]);

  const fetchMoreCandidatesHandler = useCallback(async () => {
    if (isLoading || candidates.length >= totalCandidates) return;
    try {
      setIsLoading(true);
      const page = Math.floor(candidates.length / 10) + 1;
      console.log("Fetching more candidates, page:", page);
      const response = showInactive
        ? await fetchMoreInActiveCandidates(page)
        : await fetchMoreCandidates(page);
      console.log("More candidates response:", response);
      if (response.candidates.length > 0) {
        setCandidates((prev) => [...prev, ...response.candidates]);
      } else {
        console.log("No more candidates to load");
        if (candidates.length < totalCandidates) {
          console.warn(
            `Expected more candidates but received none. Current: ${candidates.length}, Total: ${totalCandidates}`
          );
        }
      }
    } catch (error) {
      setError(error.message || "Error fetching more candidates");
    } finally {
      setIsLoading(false);
    }
  }, [candidates.length, isLoading, totalCandidates, showInactive]);

  const handleScroll = useCallback(
    debounce(() => {
      if (!gridRef.current || isLoading) return;
      const gridElement = gridRef.current.querySelector(
        ".MuiDataGrid-virtualScroller"
      );
      if (!gridElement) {
        console.error("Virtual scroller not found during scroll");
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = gridElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        candidates.length < totalCandidates
      ) {
        fetchMoreCandidatesHandler();
      }
    }, 200),
    [fetchMoreCandidatesHandler, isLoading, candidates.length, totalCandidates]
  );

  useEffect(() => {
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
  }, [handleScroll]);

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

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleExcelUpload({
        file,
        setIsLoading,
        setError,
        setSuccessMessage,
        setCandidates,
        setTotalCandidates,
        showInactive,
      });
      event.target.value = "";
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddCandidateSuccess = async () => {
    try {
      const response = showInactive
        ? await fetchInitialInActiveCandidates()
        : await fetchInitialCandidates();
      setCandidates(response.candidates);
      setTotalCandidates(response.pagination.totalCandidates);
      setSuccessMessage("Candidate added successfully");
    } catch (error: any) {
      setError(error.message || "Error refreshing candidate list");
    }
  };

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
                onClick={() =>
                  router.push(`/candidate-profile/${params.row.id}`)
                }
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
                      "Activate Candidate",
                      "Are you sure you want to activate this candidate?",
                      async () => {
                        try {
                          await updateCandidateStatus(params.row.id, "Active");
                          setSuccessMessage("Candidate activated successfully");
                          const response = await fetchInitialInActiveCandidates();
                          setCandidates(response.candidates);
                          setTotalCandidates(
                            response.pagination.totalCandidates
                          );
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
                      "Deactivate Candidate",
                      "Are you sure you want to deactivate this candidate?",
                      async () => {
                        try {
                          await updateCandidateStatus(
                            params.row.id,
                            "In-Active"
                          );
                          setSuccessMessage(
                            "Candidate deactivated successfully"
                          );
                          const response = await fetchInitialCandidates();
                          setCandidates(response.candidates);
                          setTotalCandidates(
                            response.pagination.totalCandidates
                          );
                        } catch (error: any) {
                          setError(
                            error.message || "Error deactivating candidate"
                          );
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}>
        <Button
          variant="contained"
          onClick={() => setShowInactive(!showInactive)}
          sx={{ backgroundColor: showInactive ? "#f44336" : "#5e35b1" }}
        >
          {showInactive ? "Show Active Candidates" : "Show Inactive Candidates"}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleMenuClick}
          sx={{ backgroundColor: "#1976d2" }}
        >
          Add Candidate
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
            Add Single Candidate
          </MenuItem>
          <MenuItem
            onClick={() => {
              fileInputRef.current?.click();
              handleMenuClose();
            }}
          >
            <UploadFileIcon sx={{ mr: 1 }} />
            Upload Bulk Candidates
          </MenuItem>
        </Menu>
        <Input
          type="file"
          inputRef={fileInputRef}
          style={{ display: "none" }}
          inputProps={{ accept: ".xlsx, .xls" }}
          onChange={onFileChange}
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
              key={candidates.length}
              rows={rows}
              columns={columns}
              rowHeight={isMobile ? 50 : 60}
              autoHeight={false}
              disableSelectionOnClick
              loading={false}
              rowCount={totalCandidates}
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
        <AddCandidateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleAddCandidateSuccess}
        />
      </div>
    </>
  );
};

export default CandidateList;