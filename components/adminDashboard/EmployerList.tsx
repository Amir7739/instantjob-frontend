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
} from "@mui/material";

import * as XLSX from "xlsx";

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from "@mui/icons-material/Add";

import PreviewIcon from '@mui/icons-material/Preview';
import UploadFileIcon from "@mui/icons-material/UploadFile";


import { useRouter } from "next/navigation";
import ConfirmDialog from "../ActivateDeactivateConfirmation";
import { debounce } from "lodash";
import { fetchInitialEmployers, fetchMoreEmployers, updateEmployerStatus } from "@/services/eployersApi";
import CandidateListSkeleton from "../CandidateListSkeleton";
import AddEmployerModal from "./AddEmployerModal";
import CustomSnackbar from "../CustomSnackbar";
import { bulkSignupEmployers } from "@/services/employerAuthApi";

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

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fetch initial employers on mount or when showInactive changes
  useEffect(() => {
    const loadInitialEmployers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchInitialEmployers(); // Always fetch all employers (filter on frontend)
        const filteredEmployers = response.employers.filter(
          (employer) => employer.verified === !showInactive
        );
        setEmployers(filteredEmployers);
        setTotalEmployers(
          showInactive
            ? response.employers.filter((e) => !e.verified).length
            : response.employers.filter((e) => e.verified).length
        );
      } catch (error) {
        setError(error.message || "Error fetching initial employers");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialEmployers();

    // Reset scroll position to top
    const gridElement = gridRef.current?.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (gridElement) {
      gridElement.scrollTop = 0;
    }
  }, [showInactive]);

  // Debounced scroll handler for smooth infinite scrolling
  const fetchMoreEmployersHandler = useCallback(async () => {
    if (isLoading || employers.length >= totalEmployers) return;
    try {
      setIsLoading(true);
      const page = Math.floor(employers.length / 10) + 1; // Calculate page number
      const response = await fetchMoreEmployers(page);
      const filteredEmployers = response.employers.filter(
        (employer) => employer.verified === !showInactive
      );
      if (filteredEmployers.length > 0) {
        setEmployers((prev) => [...prev, ...filteredEmployers]);
      } else {
        if (employers.length < totalEmployers) {
          console.warn(
            `Expected more employers but received none. Current: ${employers.length}, Total: ${totalEmployers}`
          );
        }
      }
    } catch (error) {
      setError(error.message || "Error fetching more employers");
    } finally {
      setIsLoading(false);
    }
  }, [employers.length, isLoading, totalEmployers, showInactive]);

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
        employers.length < totalEmployers
      ) {
        fetchMoreEmployersHandler();
      }
    }, 200),
    [fetchMoreEmployersHandler, isLoading, employers.length, totalEmployers]
  );

  // Scroll handler for infinite scrolling
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
      await handleAddEmployerSuccess(); // Refresh the employer list
      setSnackbar({
        open: true,
        message: `Bulk upload completed: ${response.totalSuccess} succeeded, ${response.totalErrors} failed`,
        severity: response.totalErrors > 0 ? "error" : "success",
      });

      // Reset file input
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


  // Responsive column config
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      // {
      //   field: "name",
      //   headerName: "Employer Name",
      //   flex: 0.15,
      //   minWidth: 120,
      // },
      {
        field: "email",
        headerName: "Email",
        flex: 0.15,
        minWidth: 120,
      },
            {
        field: "contactNumber",
        headerName: "phone",
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: "companyName",
        headerName: "Company Name",
        flex: 0.15,
        minWidth: 120,
      },
      {
        field: "createdAt",
        headerName: "Registered Date",
        flex: 0.15,
        minWidth: 120,
         renderCell: (params) => new Date(params.value).toLocaleDateString(),
      },
      
      {
        field: "industry",
        headerName: "Industry",
        flex: 0.1,
        minWidth: 100,
      },

      {
        field: "status",
        headerName: "Status",
        flex: 0.1,
        minWidth: 100,
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
                          // Assuming an API to update employer status
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
                          // Assuming an API to update employer status
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
              key={employers.length}
              rows={rows}
              columns={columns}
              rowHeight={isMobile ? 50 : 60}
              autoHeight={false}
              disableSelectionOnClick
              loading={false} // Controlled by skeleton
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
      </div>
    </>
  );
};

export default EmployerList;