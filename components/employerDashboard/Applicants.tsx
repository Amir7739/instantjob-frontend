"use client";

import {
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as Trash2Icon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  fetchRecentApplicants,
  updateApplicantStatus,
} from "@/services/eployersApi";
import CustomSnackbar from "../CustomSnackbar";
import { useRouter } from "next/navigation";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const router = useRouter();

  const loadApplicants = async (pageNum) => {
    if (loading) return; // Prevent multiple simultaneous calls
    setLoading(true);
    try {
      const employerId = localStorage.getItem("id");
      if (!employerId) {
        console.error("No employerId found in localStorage");
        setLoading(false);
        setInitialLoading(false);
        return;
      }
      console.log(`Fetching applicants for page ${pageNum}`);
      const response = await fetchRecentApplicants(employerId, pageNum);
      console.log("API Response:", response);
      setApplicants((prev) => {
        const newApplicants =
          pageNum === 1
            ? response.applicants
            : [...prev, ...response.applicants];
        console.log("Updated applicants:", newApplicants);
        return newApplicants;
      });
      setTotalPages(response.pagination.totalPages);
      setHasMore(pageNum < response.pagination.totalPages);
    } catch (error) {
      console.error("Error loading applicants:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleEditClick = (applicant) => {
    setSelectedApplicant(applicant);
    setNewStatus(applicant.status);
    setEditDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplicant || !newStatus) return;
    try {
      const response = await updateApplicantStatus(
        selectedApplicant.id,
        newStatus
      );
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === selectedApplicant.id ? { ...app, status: newStatus } : app
        )
      );
      setSnackbarMessage(response.message || "Status updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      setSelectedApplicant(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbarMessage(error.message || "Failed to update status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    loadApplicants(1); // Initial load
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Applicant",
      flex: 1,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 14 },
              fontWeight: "medium",
              color: "#1F2937",
            }}
          >
            {row.name}
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 10, sm: 12 }, color: "#6B7280", ml: 1 }}
          >
            {row.experience}
          </Typography>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "Apply For",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "#1F2937" }}>
          {row.position}
        </Typography>
      ),
    },
    {
      field: "applied",
      headerName: "Applied",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography sx={{ fontSize: { xs: 12, sm: 14 }, color: "#6B7280" }}>
          {row.applied}
        </Typography>
      ),
      hide: window.innerWidth < 900,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row.status}
          sx={{
            bgcolor:
              row.status.toLowerCase() === "new"
                ? "#DBEAFE"
                : row.status.toLowerCase() === "shortlisted"
                ? "#D1FAE5"
                : row.status.toLowerCase() === "interview"
                ? "#E9D5FF"
                : row.status.toLowerCase() === "hired"
                ? "#BBF7D0"
                : row.status.toLowerCase() === "rejected"
                ? "#FEE2E2"
                : "#FEF3C7",
            color:
              row.status.toLowerCase() === "new"
                ? "#1E40AF"
                : row.status.toLowerCase() === "shortlisted"
                ? "#065F46"
                : row.status.toLowerCase() === "interview"
                ? "#6B21A8"
                : row.status.toLowerCase() === "hired"
                ? "#15803D"
                : row.status.toLowerCase() === "rejected"
                ? "#B91C1C"
                : "#92400E",
            fontSize: { xs: 10, sm: 12 },
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            sx={{ color: "#4F46E5", p: { xs: 0.5, sm: 1 } }}
            onClick={() => router.push(`/candidate-profile/${row.applicantId}`)}
          >
            <EyeIcon fontSize="small" />
          </IconButton>
          <IconButton
            sx={{ color: "#10B981", p: { xs: 0.5, sm: 1 } }}
            onClick={() => handleEditClick(row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ color: "#EF4444", p: { xs: 0.5, sm: 1 } }}>
            <Trash2Icon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 , 
               m: { xs: 2, md: 3 },}}>
      <Typography sx={{ fontSize: 18, fontWeight: "medium", color: "#1F2937" }}>
        Recent Applicants
      </Typography>
      {initialLoading ? (
        <Box sx={{ height: 620, width: "100%" }}>
          <DataGrid
            rows={[]}
            columns={columns}
            disableRowSelectionOnClick
            loading={false}
            getRowId={(row) => row.id}
            hideFooter
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: "#F9FAFB" },
              "& .MuiDataGrid-cell": { py: 1 },
            }}
          />
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={applicants.length}
          next={() => {
            const nextPage = page + 1;
            if (nextPage <= totalPages && !loading) {
              loadApplicants(nextPage);
              setPage(nextPage);
            }
          }}
          hasMore={hasMore}
          loader={
            <Typography sx={{ textAlign: "center", mt: 2, color: "#1F2937" }}>
              Loading...
            </Typography>
          }
          endMessage={
            applicants.length === 0 ? (
              <Typography sx={{ textAlign: "center", mt: 2, color: "#6B7280" }}>
                No applicants found
              </Typography>
            ) : (
              !hasMore && (
                <Typography
                  sx={{ textAlign: "center", mt: 2, color: "#6B7280" }}
                >
                  No more applicants
                </Typography>
              )
            )
          }
          style={{ overflow: "visible" }}
        >
          <Box sx={{ height: 630, width: "100%" }}>
            <DataGrid
              showToolbar
              rows={applicants}
              columns={columns}
              disableRowSelectionOnClick
              loading={false}
              getRowId={(row) => row.id}
              hideFooter
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#F9FAFB",
                  color: "blue",
                },
                "& .MuiDataGrid-cell": { py: 1 },
              }}
            />
          </Box>
        </InfiniteScroll>
      )}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Applicant Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="hired">Hired</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default Applicants;
