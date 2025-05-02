"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,
  InputAdornment,
  Alert,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  ThemeProvider,
  createTheme,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Work,
  Business,
  LocationOn,
  AttachMoney,
  Category,
  EmojiObjects,
  CalendarToday,
  AddCircle,
  Close,
  Description,
  Assignment,
  School,
  CardGiftcard,
  WorkOutline,
  CloudUpload,
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

// Custom theme (unchanged)
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2", light: "#4791db", dark: "#115293" },
    secondary: { main: "#f50057", light: "#f73378", dark: "#ab003c" },
    background: { default: "#f5f5f5" },
    error: { main: "#f44336" },
    success: { main: "#4caf50" },
  },
  typography: {
    h4: { fontWeight: 700, color: "#1976d2" },
    h5: { fontWeight: 600, color: "#424242" },
    subtitle1: { fontWeight: 500 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { "& .MuiOutlinedInput-root": { borderRadius: 8 } },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", fontWeight: 600 },
        contained: { boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } },
    },
  },
});

// Job types, industry types, job categories (unchanged)
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
];
const industryTypes = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Transportation",
  "Construction",
  "Entertainment",
  "Agriculture",
  "Other",
];
const jobCategories = [
  "Software Development",
  "Data Science",
  "UI/UX Design",
  "Product Management",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Operations",
  "Other",
];

// Validation schema (unchanged)
const JobPostingSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  companyName: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  salaryRange: Yup.string(),
  jobType: Yup.string().required("Job type is required"),
  minExp: Yup.number()
    .min(0, "Minimum experience cannot be negative")
    .required("Minimum experience is required"),
  maxExp: Yup.number()
    .min(0, "Maximum experience cannot be negative")
    .test(
      "greaterThanMin",
      "Maximum experience must be greater than or equal to minimum experience",
      function (value) {
        return !value || value >= this.parent.minExp;
      }
    )
    .required("Maximum experience is required"),
  keySkills: Yup.array().min(1, "At least one skill is required"),
  industryType: Yup.string().required("Industry type is required"),
  category: Yup.string().required("Job category is required"),
  applyBy: Yup.date().required("Application deadline is required"),
  openings: Yup.number()
    .min(1, "Number of openings must be at least 1")
    .required("Number of openings is required"),
  description: Yup.string()
    .min(50, "Description should be at least 50 characters")
    .required("Job description is required"),
  responsibilities: Yup.array().min(
    1,
    "At least one responsibility is required"
  ),
  qualifications: Yup.array().min(1, "At least one qualification is required"),
  benefits: Yup.array(),
  companyDescription: Yup.string()
    .min(50, "Company description should be at least 50 characters")
    .required("Company description is required"),
});

interface JobCreateFormProps {
  isEditing?: boolean;
  initialJobData?: any;
  jobId?: string;
}

const JobCreateForm = ({
  isEditing = false,
  initialJobData,
  jobId,
}: JobCreateFormProps) => {
  console.log("Received initialJobData:", initialJobData);
  const router = useRouter();
  const [tempInput, setTempInput] = useState({
    skill: "",
    responsibility: "",
    qualification: "",
    benefit: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialJobData?.companyLogo || null
  );

  const getInitialValues = () => {
    if (isEditing && initialJobData) {
      return {
        title: initialJobData.title || "",
        companyName: initialJobData.companyName || "",
        location: initialJobData.location || "",
        salaryRange: initialJobData.salaryRange || "",
        jobType: initialJobData.jobType || "Full-time",
        minExp: initialJobData.minExp !== undefined ? initialJobData.minExp : 0,
        maxExp: initialJobData.maxExp !== undefined ? initialJobData.maxExp : 0,
        companyLogo: null as File | null,
        keySkills: Array.isArray(initialJobData.keySkills)
          ? initialJobData.keySkills
          : [],
        industryType: initialJobData.industryType || "",
        category: initialJobData.category || "",
        applyBy: initialJobData.applyBy || "",
        openings:
          initialJobData.openings !== undefined ? initialJobData.openings : 1,
        description: initialJobData.description || "",
        responsibilities: Array.isArray(initialJobData.responsibilities)
          ? initialJobData.responsibilities
          : [],
        qualifications: Array.isArray(initialJobData.qualifications)
          ? initialJobData.qualifications
          : [],
        benefits: Array.isArray(initialJobData.benefits)
          ? initialJobData.benefits
          : [],
        companyDescription: initialJobData.companyDescription || "",
      };
    }
    return {
      title: "",
      companyName: "",
      location: "",
      salaryRange: "",
      jobType: "Full-time",
      minExp: 0,
      maxExp: 0,
      companyLogo: null as File | null,
      keySkills: [],
      industryType: "",
      category: "",
      applyBy: "",
      openings: 1,
      description: "",
      responsibilities: [],
      qualifications: [],
      benefits: [],
      companyDescription: "",
    };
  };

  const initialValues = getInitialValues();

  useEffect(() => {
    console.log("initialValues updated:", initialValues);
  }, [initialValues]);

  const handleArrayAdd = (
    field: string,
    value: string,
    setFieldValue: any,
    values: any
  ) => {
    if (!value.trim()) return;
    const updatedArray = [...values[field], value.trim()];
    setFieldValue(field, updatedArray);
    setTempInput((prev) => ({ ...prev, [field.replace("s", "")]: "" }));
  };

  const handleArrayDelete = (
    field: string,
    index: number,
    setFieldValue: any,
    values: any
  ) => {
    const updatedArray = values[field].filter(
      (_: any, i: number) => i !== index
    );
    setFieldValue(field, updatedArray);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: string,
    value: string,
    setFieldValue: any,
    values: any
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleArrayAdd(field, value, setFieldValue, values);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("companyLogo", file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    if (isEditing && (!jobId || jobId === "undefined")) {
      setSnackbar({
        open: true,
        message: "Error: Invalid job ID",
        severity: "error",
      });
      setSubmitting(false);
      console.error("Invalid jobId:", jobId);
      return;
    }
  
    const data = { ...values };
    delete data.companyLogo;
    if (data.applyBy) {
      data.applyBy = new Date(data.applyBy).toISOString();
    }
    data.minExp = Number(data.minExp);
    data.maxExp = Number(data.maxExp);
    data.openings = Number(data.openings);
  
    console.log("Submitting payload:", data);
  
    try {
      const url = isEditing ? `/jobs/update/${jobId}` : "/jobs/create";
      let res;
      if (values.companyLogo) {
        const formData = new FormData();
        // Append non-array fields and arrays correctly
        for (const key in data) {
          if (Array.isArray(data[key])) {
            // Append each array element individually
            data[key].forEach((item: any) => {
              formData.append(`${key}[]`, item); // Use key[] to indicate an array
            });
          } else {
            formData.append(key, data[key]);
          }
        }
        formData.append("companyLogo", values.companyLogo);
        res = await axiosInstance({
          method: isEditing ? "put" : "post",
          url,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance({
          method: isEditing ? "put" : "post",
          url,
          data,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      console.log("API response:", res.data);
  
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update job");
      }
  
      setSnackbar({
        open: true,
        message: isEditing
          ? "Job updated successfully!"
          : "Job created successfully!",
        severity: "success",
      });
  
      if (!isEditing) {
        resetForm();
        setLogoPreview(null);
      }
  
      setTimeout(() => {
        router.push("/admin-dashboard");
      }, 1000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Error updating job";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("Error during job submission:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ my: 5, mt: "5rem" }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            backgroundImage: "linear-gradient(to bottom, #f9fbff, #ffffff)",
            borderTop: "5px solid #1976d2",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background:
                "linear-gradient(135deg, transparent 50%, rgba(25, 118, 210, 0.1) 50%)",
              zIndex: 0,
            }}
          />

          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              mb: 4,
              position: "relative",
              "&:after": {
                content: '""',
                display: "block",
                width: "80px",
                height: "4px",
                backgroundColor: theme.palette.primary.main,
                margin: "12px auto 0",
                borderRadius: "2px",
              },
            }}
          >
            {isEditing ? "Edit Job Posting" : "Create New Job Posting"}
          </Typography>

          <Formik
            initialValues={initialValues}
            validationSchema={JobPostingSchema}
            onSubmit={handleSubmit}
            enableReinitialize
            key={JSON.stringify(initialValues)}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                {/* Basic Information */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(25, 118, 210, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <Work sx={{ mr: 1, color: "#1976d2" }} /> Basic Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Field name="title">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="Job Title"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WorkOutline color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="companyName">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="Company Name"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Business color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Company Logo
                      </Typography>
                      <Box
                        sx={{
                          border: "2px dashed rgba(25, 118, 210, 0.3)",
                          borderRadius: 2,
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(25, 118, 210, 0.04)",
                          position: "relative",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.06)",
                          },
                        }}
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                      >
                        <input
                          id="logo-upload"
                          type="file"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        {logoPreview ? (
                          <Box sx={{ textAlign: "center" }}>
                            <img
                              src={logoPreview}
                              alt="Company Logo Preview"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "100px",
                                objectFit: "contain",
                                marginBottom: "8px",
                              }}
                            />
                            <Typography variant="body2" color="primary">
                              Click to change logo
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <CloudUpload
                              color="primary"
                              sx={{ fontSize: 40, mb: 1 }}
                            />
                            <Typography
                              variant="body1"
                              color="textSecondary"
                              textAlign="center"
                            >
                              Click to upload your company logo
                              <br />
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Recommended size: 200px × 100px
                              </Typography>
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="location">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            required
                            label="Location"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationOn color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="salaryRange">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Salary Range"
                            placeholder="e.g. ₹60,000 - ₹80,000"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="jobType">
                        {({ field, meta }: FieldProps) => (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                          >
                            <InputLabel id="job-type-label">
                              Job Type
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="job-type-label"
                              label="Job Type"
                            >
                              {jobTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText error>
                                {meta.error}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="openings">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Number of Openings"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              inputProps: { min: 1 },
                              startAdornment: (
                                <InputAdornment position="start">
                                  #
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Box>

                {/* Experience & Category */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(66, 66, 66, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <Category sx={{ mr: 1, color: "#1976d2" }} /> Experience &
                    Classification
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Field name="minExp">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Minimum Experience (Years)"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="maxExp">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Maximum Experience (Years)"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="industryType">
                        {({ field, meta }: FieldProps) => (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                          >
                            <InputLabel id="industry-type-label">
                              Industry Type
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="industry-type-label"
                              label="Industry Type"
                            >
                              {industryTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText error>
                                {meta.error}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="category">
                        {({ field, meta }: FieldProps) => (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                          >
                            <InputLabel id="category-label">
                              Job Category
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="category-label"
                              label="Job Category"
                            >
                              {jobCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                  {category}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <FormHelperText error>
                                {meta.error}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="applyBy">
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Apply By"
                            type="date"
                            variant="outlined"
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarToday color="primary" />
                                </InputAdornment>
                              ),
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                </Box>

                {/* Key Skills */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(25, 118, 210, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    <EmojiObjects sx={{ mr: 1, color: "#1976d2" }} /> Key Skills
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Key Skill"
                      value={tempInput.skill}
                      onChange={(e) =>
                        setTempInput({ ...tempInput, skill: e.target.value })
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "keySkills",
                          tempInput.skill,
                          setFieldValue,
                          values
                        )
                      }
                      variant="outlined"
                      placeholder="e.g. Java (press Enter to add)"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleArrayAdd(
                          "keySkills",
                          tempInput.skill,
                          setFieldValue,
                          values
                        )
                      }
                      startIcon={<AddCircle />}
                      sx={{ minWidth: 120 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f9ff",
                      minHeight: "60px",
                      border:
                        errors.keySkills && touched.keySkills
                          ? "1px solid #f44336"
                          : undefined,
                    }}
                  >
                    {values.keySkills.length > 0 ? (
                      values.keySkills.map((skill: string, i: number) => (
                        <Chip
                          key={i}
                          label={skill}
                          onDelete={() =>
                            handleArrayDelete(
                              "keySkills",
                              i,
                              setFieldValue,
                              values
                            )
                          }
                          sx={{
                            m: 0.5,
                            backgroundColor: "#e3f2fd",
                            color: "#1565c0",
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No skills added yet
                      </Typography>
                    )}
                  </Paper>
                  {errors.keySkills && touched.keySkills && (
                    <FormHelperText error>{errors.keySkills}</FormHelperText>
                  )}
                </Box>

                {/* Responsibilities */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(255, 152, 0, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "#ff6f00",
                    }}
                  >
                    <Assignment sx={{ mr: 1, color: "#ff6f00" }} />{" "}
                    Responsibilities
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Responsibility"
                      value={tempInput.responsibility}
                      onChange={(e) =>
                        setTempInput({
                          ...tempInput,
                          responsibility: e.target.value,
                        })
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "responsibilities",
                          tempInput.responsibility,
                          setFieldValue,
                          values
                        )
                      }
                      variant="outlined"
                      placeholder="e.g. Develop web applications (press Enter to add)"
                    />
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() =>
                        handleArrayAdd(
                          "responsibilities",
                          tempInput.responsibility,
                          setFieldValue,
                          values
                        )
                      }
                      startIcon={<AddCircle />}
                      sx={{ minWidth: 120 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: "#fff8e1",
                      minHeight: "60px",
                      border:
                        errors.responsibilities && touched.responsibilities
                          ? "1px solid #f44336"
                          : undefined,
                    }}
                  >
                    {values.responsibilities.length > 0 ? (
                      values.responsibilities.map((item: string, i: number) => (
                        <Chip
                          key={i}
                          label={item}
                          onDelete={() =>
                            handleArrayDelete(
                              "responsibilities",
                              i,
                              setFieldValue,
                              values
                            )
                          }
                          sx={{
                            m: 0.5,
                            backgroundColor: "#ffecb3",
                            color: "#ff6f00",
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No responsibilities added yet
                      </Typography>
                    )}
                  </Paper>
                  {errors.responsibilities && touched.responsibilities && (
                    <FormHelperText error>
                      {errors.responsibilities}
                    </FormHelperText>
                  )}
                </Box>

                {/* Qualifications */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(76, 175, 80, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "#2e7d32",
                    }}
                  >
                    <School sx={{ mr: 1, color: "#2e7d32" }} /> Qualifications
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Qualification"
                      value={tempInput.qualification}
                      onChange={(e) =>
                        setTempInput({
                          ...tempInput,
                          qualification: e.target.value,
                        })
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "qualifications",
                          tempInput.qualification,
                          setFieldValue,
                          values
                        )
                      }
                      variant="outlined"
                      placeholder="e.g. Bachelor's degree (press Enter to add)"
                    />
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleArrayAdd(
                          "qualifications",
                          tempInput.qualification,
                          setFieldValue,
                          values
                        )
                      }
                      startIcon={<AddCircle />}
                      sx={{ minWidth: 120 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: "#e8f5e9",
                      minHeight: "60px",
                      border:
                        errors.qualifications && touched.qualifications
                          ? "1px solid #f44336"
                          : undefined,
                    }}
                  >
                    {values.qualifications.length > 0 ? (
                      values.qualifications.map((item: string, i: number) => (
                        <Chip
                          key={i}
                          label={item}
                          onDelete={() =>
                            handleArrayDelete(
                              "qualifications",
                              i,
                              setFieldValue,
                              values
                            )
                          }
                          sx={{
                            m: 0.5,
                            backgroundColor: "#c8e6c9",
                            color: "#2e7d32",
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No qualifications added yet
                      </Typography>
                    )}
                  </Paper>
                  {errors.qualifications && touched.qualifications && (
                    <FormHelperText error>
                      {errors.qualifications}
                    </FormHelperText>
                  )}
                </Box>

                {/* Benefits */}
                <Box
                  sx={{
                    mb: 5,
                    p: 3,
                    backgroundColor: "rgba(156, 39, 176, 0.03)",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "#6a1b9a",
                    }}
                  >
                    <CardGiftcard sx={{ mr: 1, color: "#6a1b9a" }} /> Benefits
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add Benefit"
                      value={tempInput.benefit}
                      onChange={(e) =>
                        setTempInput({ ...tempInput, benefit: e.target.value })
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(
                          e,
                          "benefits",
                          tempInput.benefit,
                          setFieldValue,
                          values
                        )
                      }
                      variant="outlined"
                      placeholder="e.g. Health insurance (press Enter to add)"
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        handleArrayAdd(
                          "benefits",
                          tempInput.benefit,
                          setFieldValue,
                          values
                        )
                      }
                      startIcon={<AddCircle />}
                      sx={{ minWidth: 120 }}
                    >
                      Add
                    </Button>
                  </Stack>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, backgroundColor: "#f3e5f5", minHeight: "60px" }}
                  >
                    {values.benefits.length > 0 ? (
                      values.benefits.map((item: string, i: number) => (
                        <Chip
                          key={i}
                          label={item}
                          onDelete={() =>
                            handleArrayDelete(
                              "benefits",
                              i,
                              setFieldValue,
                              values
                            )
                          }
                          sx={{
                            m: 0.5,
                            backgroundColor: "#e1bee7",
                            color: "#6a1b9a",
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        color="textSecondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        No benefits added yet
                      </Typography>
                    )}
                  </Paper>
                </Box>

                {/* Descriptions */}
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: "rgba(96, 125, 139, 0.03)",
                        borderRadius: 3,
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          color: "#455a64",
                        }}
                      >
                        <Business sx={{ mr: 1, color: "#455a64" }} /> Company
                        Description
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Field name="companyDescription">
                        {({ field, meta }: FieldProps) => (
                          <>
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              rows={4}
                              placeholder="Provide information about your company"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 1,
                                textAlign: "right",
                                color:
                                  field.value.length < 50
                                    ? "error.main"
                                    : "text.secondary",
                              }}
                            >
                              {field.value.length} / 50 characters minimum
                            </Typography>
                          </>
                        )}
                      </Field>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: "rgba(0, 121, 107, 0.03)",
                        borderRadius: 3,
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          color: "#00796b",
                        }}
                      >
                        <Description sx={{ mr: 1, color: "#00796b" }} /> Job
                        Description
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      <Field name="description">
                        {({ field, meta }: FieldProps) => (
                          <>
                            <TextField
                              {...field}
                              fullWidth
                              multiline
                              rows={6}
                              placeholder="Provide a detailed description of the job role"
                              variant="outlined"
                              error={meta.touched && Boolean(meta.error)}
                              helperText={meta.touched && meta.error}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 1,
                                textAlign: "right",
                                color:
                                  field.value.length < 50
                                    ? "error.main"
                                    : "text.secondary",
                              }}
                            >
                              {field.value.length} / 50 characters minimum
                            </Typography>
                          </>
                        )}
                      </Field>
                    </Box>
                  </Grid>
                </Grid>

                {/* Buttons */}
                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      px: 6,
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                      "&:hover": {
                        boxShadow: "0 8px 16px rgba(25, 118, 210, 0.4)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s",
                      },
                    }}
                  >
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Creating..."
                      : isEditing
                      ? "Update Job"
                      : "Create Job"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => router.push("/admin-dashboard")}
                    sx={{
                      px: 6,
                      py: 1.8,
                      borderRadius: 2,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>

                {Object.keys(errors).length > 0 && touched.title && (
                  <Alert
                    severity="warning"
                    sx={{ mt: 3, mx: "auto", maxWidth: "500px" }}
                  >
                    Please correct the highlighted errors before submitting.
                  </Alert>
                )}
              </Form>
            )}
          </Formik>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            elevation={6}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setSnackbar({ ...snackbar, open: false })}
              >
                <Close fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default JobCreateForm;