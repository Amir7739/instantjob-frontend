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
  TextareaAutosize,
} from "@mui/material";

import { useState } from "react";
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
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";
import Navbar from "./Navbar";

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
    },
    secondary: {
      main: "#f50057",
      light: "#f73378",
      dark: "#ab003c",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: "#1976d2",
    },
    h5: {
      fontWeight: 500,
      color: "#424242",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Job types options
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
];

const JobCreateForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salaryRange: "",
    jobType: "Full-time",
    minExp: 0,
    maxExp: 0,
    keySkills: [] as string[],
    industryType: "",
    category: "",
    applyBy: "",
    openings: 1,
    description: "",
    responsibilities: [] as string[],
    qualifications: [] as string[],
    benefits: [] as string[],
    companyDescription: "",
  });

  const [tempInput, setTempInput] = useState({
    skill: "",
    responsibility: "",
    qualification: "",
    benefit: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleArrayAdd = (field: string, value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev as any)[field], value.trim()],
    }));
    setTempInput((prev) => ({ ...prev, [field.replace("s", "")]: "" }));
  };

  const handleArrayDelete = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: string,
    value: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleArrayAdd(field, value);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/jobs/create", formData);
      setSnackbar({
        open: true,
        message: "Job created successfully!",
        severity: "success",
      });
      console.log("✅ Response:", res.data);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setSnackbar({
        open: true,
        message: "Failed to create job",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ my: 5, mt: "5rem" }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: "#f9fbff",
              borderTop: "4px solid #1976d2",
            }}
          >
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Create New Job Posting
            </Typography>

            {/* Basic Information */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Work sx={{ mr: 1, color: "#1976d2" }} /> Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Job Title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkOutline color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Salary Range"
                    placeholder="e.g. ₹60,000 - ₹80,000"
                    value={formData.salaryRange}
                    onChange={(e) =>
                      setFormData({ ...formData, salaryRange: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="job-type-label">Job Type</InputLabel>
                    <Select
                      labelId="job-type-label"
                      value={formData.jobType}
                      onChange={(e) =>
                        setFormData({ ...formData, jobType: e.target.value })
                      }
                      label="Job Type"
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Openings"
                    value={formData.openings}
                    onChange={(e) =>
                      setFormData({ ...formData, openings: +e.target.value })
                    }
                    variant="outlined"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Experience & Category */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Category sx={{ mr: 1, color: "#1976d2" }} /> Experience &
                Classification
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Experience (Years)"
                    value={formData.minExp}
                    onChange={(e) =>
                      setFormData({ ...formData, minExp: +e.target.value })
                    }
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Experience (Years)"
                    value={formData.maxExp}
                    onChange={(e) =>
                      setFormData({ ...formData, maxExp: +e.target.value })
                    }
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Industry Type"
                    value={formData.industryType}
                    onChange={(e) =>
                      setFormData({ ...formData, industryType: e.target.value })
                    }
                    variant="outlined"
                    placeholder="e.g. Technology, Healthcare"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    variant="outlined"
                    placeholder="e.g. Software Development"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Category color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apply By"
                    type="date"
                    value={formData.applyBy}
                    onChange={(e) =>
                      setFormData({ ...formData, applyBy: e.target.value })
                    }
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Key Skills */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
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
                    handleKeyPress(e, "keySkills", tempInput.skill)
                  }
                  variant="outlined"
                  placeholder="e.g. JavaScript, Project Management (press Enter to add)"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleArrayAdd("keySkills", tempInput.skill)}
                  startIcon={<AddCircle />}
                  sx={{ minWidth: 120 }}
                >
                  Add
                </Button>
              </Stack>

              <Paper
                variant="outlined"
                sx={{ p: 2, backgroundColor: "#f5f9ff", minHeight: "60px" }}
              >
                {formData.keySkills.length > 0 ? (
                  formData.keySkills.map((skill, i) => (
                    <Chip
                      key={i}
                      label={skill}
                      onDelete={() => handleArrayDelete("keySkills", i)}
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
            </Box>

            {/* Responsibilities */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <Assignment sx={{ mr: 1, color: "#1976d2" }} /> Responsibilities
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
                      tempInput.responsibility
                    )
                  }
                  variant="outlined"
                  placeholder="e.g. Develop and maintain web applications (press Enter to add)"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleArrayAdd("responsibilities", tempInput.responsibility)
                  }
                  startIcon={<AddCircle />}
                  sx={{ minWidth: 120 }}
                >
                  Add
                </Button>
              </Stack>

              <Paper
                variant="outlined"
                sx={{ p: 2, backgroundColor: "#fff8e1", minHeight: "60px" }}
              >
                {formData.responsibilities.length > 0 ? (
                  formData.responsibilities.map((item, i) => (
                    <Chip
                      key={i}
                      label={item}
                      onDelete={() => handleArrayDelete("responsibilities", i)}
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
            </Box>

            {/* Qualifications */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <School sx={{ mr: 1, color: "#1976d2" }} /> Qualifications
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
                    handleKeyPress(e, "qualifications", tempInput.qualification)
                  }
                  variant="outlined"
                  placeholder="e.g. Bachelor's degree in Computer Science (press Enter to add)"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleArrayAdd("qualifications", tempInput.qualification)
                  }
                  startIcon={<AddCircle />}
                  sx={{ minWidth: 120 }}
                >
                  Add
                </Button>
              </Stack>

              <Paper
                variant="outlined"
                sx={{ p: 2, backgroundColor: "#e8f5e9", minHeight: "60px" }}
              >
                {formData.qualifications.length > 0 ? (
                  formData.qualifications.map((item, i) => (
                    <Chip
                      key={i}
                      label={item}
                      onDelete={() => handleArrayDelete("qualifications", i)}
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
            </Box>

            {/* Benefits */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <CardGiftcard sx={{ mr: 1, color: "#1976d2" }} /> Benefits
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
                    handleKeyPress(e, "benefits", tempInput.benefit)
                  }
                  variant="outlined"
                  placeholder="e.g. Health insurance, Remote work options (press Enter to add)"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleArrayAdd("benefits", tempInput.benefit)}
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
                {formData.benefits.length > 0 ? (
                  formData.benefits.map((item, i) => (
                    <Chip
                      key={i}
                      label={item}
                      onDelete={() => handleArrayDelete("benefits", i)}
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

            {/* Descriptions - Moved to the bottom */}
            <Grid container spacing={3}>
              {/* Company Description */}
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Description sx={{ mr: 1, color: "#1976d2" }} /> Company
                  Description
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextareaAutosize
                  minRows={4}
                  placeholder="Provide information about your company"
                  value={formData.companyDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyDescription: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "1rem",
                    resize: "both", // Allow resizing both horizontally and vertically
                  }}
                />
              </Grid>

              {/* Job Description */}
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Description sx={{ mr: 1, color: "#1976d2" }} /> Job
                  Description
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextareaAutosize
                  minRows={5}
                  placeholder="Provide a detailed description of the job role"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    fontSize: "1rem",
                    resize: "both", // Allow resizing both horizontally and vertically
                  }}
                />
              </Grid>
            </Grid>
            {/* Submit */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                Create Job Posting
              </Button>
            </Box>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={snackbar.severity as "success" | "error"}
              variant="filled"
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
    </>
  );
};

export default JobCreateForm;
