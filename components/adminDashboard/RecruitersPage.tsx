import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "@/utils/axios";
import CustomSnackbar from "../CustomSnackbar";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "90vh",
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: theme.shadows[6],
}));

const RecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editRecruiterId, setEditRecruiterId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteRecruiterId, setDeleteRecruiterId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/recruiter/get-all");
        console.log("API Response:", response.data);
        const recruitersData = Array.isArray(response.data.recruiters)
          ? response.data.recruiters.filter(
              (recruiter) =>
                recruiter && typeof recruiter === "object" && recruiter._id
            )
          : [];
        setRecruiters(recruitersData);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
        setError("Failed to fetch recruiters");
        setSnackbar({
          open: true,
          message:
            error.response?.data?.message || "Failed to fetch recruiters",
          severity: "error",
        });
        setRecruiters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiters();
  }, []);

  const handleOpenModal = (recruiter = null) => {
    if (recruiter) {
      setIsEditMode(true);
      setEditRecruiterId(recruiter._id);
      setFormData({
        full_name: recruiter.full_name,
        email: recruiter.email,
        password: "",
      });
    } else {
      setIsEditMode(false);
      setEditRecruiterId(null);
      setFormData({ full_name: "", email: "", password: "" });
    }
    setOpenModal(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ full_name: "", email: "", password: "" });
    setError(null);
    setIsEditMode(false);
    setEditRecruiterId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.full_name ||
      !formData.email ||
      (!formData.password && !isEditMode)
    ) {
      setError("Please fill in all required fields");
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }
    setLoading(true);
    try {
      console.log("Form Data:", formData);
      let response;
      if (isEditMode) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        response = await axiosInstance.put(
          `/recruiter/update/${editRecruiterId}`,
          updateData
        );
        console.log("Update Recruiter Response:", response.data);
        if (
          response.data.recruiter &&
          typeof response.data.recruiter === "object" &&
          response.data.recruiter._id
        ) {
          setRecruiters((prev) =>
            prev.map((rec) =>
              rec._id === editRecruiterId ? response.data.recruiter : rec
            )
          );
          handleCloseModal();
          setSnackbar({
            open: true,
            message: "Recruiter updated successfully",
            severity: "success",
          });
        } else {
          throw new Error("Invalid recruiter data");
        }
      } else {
        response = await axiosInstance.post("/recruiter/signup", formData);
        console.log("New Recruiter Response:", response.data);
        if (
          response.data.recruiter &&
          typeof response.data.recruiter === "object" &&
          response.data.recruiter._id
        ) {
          setRecruiters((prev) => [...prev, response.data.recruiter]);
          handleCloseModal();
          setSnackbar({
            open: true,
            message: "Recruiter added successfully",
            severity: "success",
          });
        } else {
          throw new Error("Invalid recruiter data");
        }
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} recruiter:`,
        error
      );
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} recruiter`;
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteRecruiterId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteRecruiterId(null);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/recruiter/delete/${deleteRecruiterId}`
      );
      console.log("Delete Recruiter Response:", response.data);
      setRecruiters((prev) =>
        prev.filter((rec) => rec._id !== deleteRecruiterId)
      );
      handleCloseDeleteDialog();
      setSnackbar({
        open: true,
        message: "Recruiter deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting recruiter:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete recruiter";
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "R";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      field: "avatar",
      headerName: "",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            fontSize: "0.875rem",
            fontWeight: "bold",
          }}
        >
          {getInitials(params.row.full_name)}
        </Avatar>
      ),
    },
    {
      field: "full_name",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmailIcon color="secondary" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Added Date",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarTodayIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleOpenModal(params.row)}
            color="primary"
            size="small"
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteDialog(params.row._id)}
            color="error"
            size="small"
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%", minHeight: "100vh", bgcolor: "grey.50" }}>
      <HeaderBox>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Recruiters Management
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Manage and view all recruiters in your organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          disabled={loading}
          sx={{
            bgcolor: "white",
            color: "primary.main",
            "&:hover": { bgcolor: "grey.100" },
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Add New Recruiter
        </Button>
      </HeaderBox>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography variant="body2">{error}</Typography>
        </Paper>
      )}

      {recruiters.length > 0 ? (
        <Paper
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 6,
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "grey.100",
              borderBottom: "2px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <DataGrid
            rows={recruiters}
            columns={columns}
            getRowId={(row) =>
              row?._id || `fallback-${Math.random().toString(36).substring(2)}`
            }
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableSelectionOnClick
            loading={loading}
            autoHeight
            sx={{
              minHeight: 400,
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "300px",
              },
            }}
          />
        </Paper>
      ) : (
        <Typography>No recruiters available</Typography>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <ModalBox component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                {isEditMode ? <EditIcon /> : <AddIcon />}
              </Avatar>
              <Box>
                <Typography id="modal-title" variant="h5" fontWeight="bold">
                  {isEditMode ? "Edit Recruiter" : "Add New Recruiter"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isEditMode
                    ? "Update recruiter details"
                    : "Create a new recruiter account"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                "&:hover": {
                  bgcolor: "action.hover",
                  transform: "scale(1.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {error && (
            <Paper
              sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}
            >
              <Typography variant="body2">{error}</Typography>
            </Paper>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              name="full_name"
              label="Full Name"
              value={formData.full_name}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
              InputProps={{
                startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
              variant="outlined"
              InputProps={{
                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required={!isEditMode}
              disabled={loading}
              variant="outlined"
              helperText={
                isEditMode
                  ? "Leave blank to keep current password"
                  : "Password should be at least 8 characters long"
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Divider />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {loading
                ? "Submitting..."
                : isEditMode
                ? "Update Recruiter"
                : "Create Recruiter"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              fullWidth
              disabled={loading}
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Cancel
            </Button>
          </Box>
        </ModalBox>
      </Modal>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recruiter? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default RecruitersPage;
