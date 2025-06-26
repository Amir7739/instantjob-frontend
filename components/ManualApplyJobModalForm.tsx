import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import axiosInstance from "@/utils/axios";
import CustomSnackbar from "./CustomSnackbar";

// Validation schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  contact: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Contact must be a valid 10-digit number"),
  experience: Yup.string()
    .required("Experience level is required")
    .oneOf(["fresher", "experienced"], "Invalid experience level"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  resume: Yup.mixed()
    .required("Resume is required")
    .test("fileType", "Only PDF files are allowed", (value) => {
      return value && value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return value && value.size <= 5 * 1024 * 1024;
    }),
});

// Thank You Modal Component
const ThankYouModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          p: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Thank You!
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "medium" }}>
            Your Application Has Been Submitted Successfully
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We appreciate your interest in joining our team! You’ll hear from us soon regarding the next steps.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            If you have any questions, feel free to contact us at support@instantjob.in.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: 120,
            borderRadius: 1,
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CandidateForm = () => {
  // State for modal and snackbar
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error",
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      contact: "",
      experience: "",
      email: "",
      title: "",
      resume: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      // Append fields to formData
      formData.append("firstName", values.firstName);
      formData.append("middleName", values.middleName);
      formData.append("lastName", values.lastName);
      formData.append("contact", values.contact);
      formData.append("experience", values.experience);
      formData.append("email", values.email);
      formData.append("title", values.title);
      formData.append("resume", values.resume); // PDF file

      try {
        const response = await axiosInstance.post(
          "/apply-job-by-careers",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        if (response.status === 201) {
          setModalOpen(true); // Show Thank You modal
          formik.resetForm();
        } else {
          setSnackbar({
            open: true,
            message: `${response.data.message}`,
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSnackbar({
          open: true,
          message: "Something went wrong. Please try again.",
          severity: "error",
        });
      }
    },
  });

  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3, mt: 10 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Job Application Form
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Take a few minutes to apply — we’ll help you get hired fast.{" "}
            </Typography>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            {/* Personal Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="contact"
                  name="contact"
                  label="Contact Number"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contact && Boolean(formik.errors.contact)
                  }
                  helperText={formik.touched.contact && formik.errors.contact}
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Professional Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Professional Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Job Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                style={{width: '10rem'}}
                  error={
                    formik.touched.experience &&
                    Boolean(formik.errors.experience)
                  }
                  required
                >
                  <InputLabel id="experience-label">
                    Experience Level
                  </InputLabel>
                  <Select
                    labelId="experience-label"
                    id="experience"
                    name="experience"
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Experience Level"
                  >
                    <MenuItem value="">
                      <em>Select experience level</em>
                    </MenuItem>
                    <MenuItem value="fresher">Fresher</MenuItem>
                    <MenuItem value="experienced">Experienced</MenuItem>
                  </Select>
                  {formik.touched.experience && formik.errors.experience && (
                    <FormHelperText>{formik.errors.experience}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Resume Upload */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Resume Upload
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  p: 2,
                  borderStyle: "dashed",
                  borderWidth: 2,
                  "&:hover": {
                    borderStyle: "dashed",
                    borderWidth: 2,
                  },
                }}
              >
                {formik.values.resume
                  ? "Change Resume (PDF only)"
                  : "Upload Resume (PDF only)"}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    formik.setFieldValue("resume", file || null);
                  }}
                />
              </Button>

              {formik.values.resume && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2">
                    Selected file: {formik.values.resume.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Size:{" "}
                    {(formik.values.resume.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                </Box>
              )}

              {formik.touched.resume && formik.errors.resume && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {formik.errors.resume}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Form Actions */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{ minWidth: 100 }}
              >
                Reset
              </Button>
              <Button type="submit" variant="contained" sx={{ minWidth: 100 }}>
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      {/* Thank You Modal */}
      <ThankYouModal open={modalOpen} onClose={handleModalClose} />

      {/* Custom Snackbar for Errors */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default CandidateForm;