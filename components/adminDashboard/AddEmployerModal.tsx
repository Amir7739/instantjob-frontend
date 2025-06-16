import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Divider,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Lock as LockIcon,
  Image as ImageIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signupEmployer } from "@/services/employerAuthApi";
import CustomSnackbar from "../CustomSnackbar";

interface AddEmployerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface EmployerFormValues {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyLogo: string;
  website: string;
  industry: string;
  location: string;
  contactNumber: string;
  companySize: string;
  bio: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  companyName: Yup.string().required("Company name is required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact number must be 10 digits")
    .required("Contact number is required"),
  name: Yup.string(),
  companyLogo: Yup.string().url("Invalid URL"),
  website: Yup.string().url("Invalid URL"),
  industry: Yup.string(),
  location: Yup.string(),
  companySize: Yup.string(),
  bio: Yup.string(),
});

const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001+",
];

const AddEmployerModal: React.FC<AddEmployerModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            textAlign: 'center',
            py: 3,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 48, height: 48 }}>
              <BusinessIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Add New Employer
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Create a new employer account with company details
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            companyName: "",
            companyLogo: "",
            website: "",
            industry: "",
            location: "",
            contactNumber: "",
            companySize: "1-10",
            bio: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await signupEmployer({
                email: values.email,
                password: values.password,
                companyName: values.companyName,
                contactNumber: values.contactNumber,
              });
              resetForm();
              onSuccess();
              setSnackbar({
                open: true,
                message: "Employer added successfully",
                severity: "success",
              });
              onClose();
            } catch (error: any) {
              setSnackbar({
                open: true,
                message: error.message || "Failed to add employer",
                severity: "error",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent sx={{ px: 4, py: 3 }}>
                <Grid container spacing={3}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        border: '1px solid rgba(103, 126, 234, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ color: '#667eea', mr: 1 }} />
                        <Typography variant="h6" color="#667eea" fontWeight="600">
                          Personal Information
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="name"
                            label="Full Name"
                            fullWidth
                            variant="outlined"
                            error={touched.name && !!errors.name}
                            helperText={touched.name && errors.name}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ color: '#667eea', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="email"
                            label="Email Address"
                            fullWidth
                            variant="outlined"
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ color: '#667eea', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            error={touched.password && !!errors.password}
                            helperText={touched.password && errors.password}
                            InputProps={{
                              startAdornment: <LockIcon sx={{ color: '#667eea', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="contactNumber"
                            label="Contact Number"
                            fullWidth
                            variant="outlined"
                            error={touched.contactNumber && !!errors.contactNumber}
                            helperText={touched.contactNumber && errors.contactNumber}
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ color: '#667eea', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Company Information Section */}
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        border: '1px solid rgba(118, 75, 162, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <BusinessIcon sx={{ color: '#764ba2', mr: 1 }} />
                        <Typography variant="h6" color="#764ba2" fontWeight="600">
                          Company Information
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="companyName"
                            label="Company Name"
                            fullWidth
                            variant="outlined"
                            error={touched.companyName && !!errors.companyName}
                            helperText={touched.companyName && errors.companyName}
                            InputProps={{
                              startAdornment: <BusinessIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                            sx={{ mt: 0.5, height: 20 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="industry"
                            label="Industry"
                            fullWidth
                            variant="outlined"
                            error={touched.industry && !!errors.industry}
                            helperText={touched.industry && errors.industry}
                            InputProps={{
                              startAdornment: <WorkIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="website"
                            label="Website URL"
                            fullWidth
                            variant="outlined"
                            error={touched.website && !!errors.website}
                            helperText={touched.website && errors.website}
                            InputProps={{
                              startAdornment: <WebsiteIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="companyLogo"
                            label="Company Logo URL"
                            fullWidth
                            variant="outlined"
                            error={touched.companyLogo && !!errors.companyLogo}
                            helperText={touched.companyLogo && errors.companyLogo}
                            InputProps={{
                              startAdornment: <ImageIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="location"
                            label="Location"
                            fullWidth
                            variant="outlined"
                            error={touched.location && !!errors.location}
                            helperText={touched.location && errors.location}
                            InputProps={{
                              startAdornment: <LocationIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Field
                            as={TextField}
                            name="companySize"
                            label="Company Size"
                            select
                            fullWidth
                            variant="outlined"
                            error={touched.companySize && !!errors.companySize}
                            helperText={touched.companySize && errors.companySize}
                            InputProps={{
                              startAdornment: <PeopleIcon sx={{ color: '#764ba2', mr: 1 }} />,
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          >
                            {companySizeOptions.map((size) => (
                              <MenuItem key={size} value={size}>
                                {size} employees
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            name="bio"
                            label="Company Bio"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            error={touched.bio && !!errors.bio}
                            helperText={touched.bio && errors.bio}
                            InputProps={{
                              startAdornment: (
                                <DescriptionIcon 
                                  sx={{ 
                                    color: '#764ba2', 
                                    mr: 1, 
                                    alignSelf: 'flex-start', 
                                    mt: 1 
                                  }} 
                                />
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>

              <Divider />

              <DialogActions 
                sx={{ 
                  px: 4, 
                  py: 3, 
                  background: 'rgba(255, 255, 255, 0.9)',
                  gap: 2 
                }}
              >
                <Button 
                  onClick={onClose} 
                  disabled={isSubmitting}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(103, 126, 234, 0.04)',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px 0 rgba(103, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px 0 rgba(103, 126, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                    }
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Adding Employer...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon />
                      <span>Add Employer</span>
                    </Box>
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default AddEmployerModal;