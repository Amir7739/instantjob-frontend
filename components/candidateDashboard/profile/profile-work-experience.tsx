"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { fetchCandidateById, Experience } from "@/services/candidates";
import { updateCandidateExperience } from "@/services/candidateDashobardApi";
import DeleteConfirmationSnackbar from "@/components/DeleteConfirmationSnackbar";

interface FormData {
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export function ProfileWorkExperience() {
  const [workExperiences, setWorkExperiences] = useState<Experience[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  });
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch candidate data on mount
  useEffect(() => {
    const candidateId = localStorage.getItem("id");
    if (candidateId) {
      fetchCandidateById(candidateId)
        .then((data) => {
          setWorkExperiences(data.experience || []);
        })
        .catch((error) => {
          setSnackbarMessage(error.message || "Failed to fetch work experience");
          setErrorSnackbar(true);
        });
    } else {
      setSnackbarMessage("No candidate ID found in localStorage");
      setErrorSnackbar(true);
    }
  }, []);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      currentlyWorking: e.target.checked,
      endDate: "",
    });
  };

  // Open dialog for adding new experience
  const handleAddExperience = () => {
    setDialogMode("add");
    setFormData({
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing an experience
  const handleEditExperience = (index: number) => {
    const experience = workExperiences[index];
    setDialogMode("edit");
    setEditIndex(index);
    setFormData({
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      location: experience.location || "",
      startDate: new Date(experience.startDate).toISOString().split("T")[0],
      endDate: experience.endDate ? new Date(experience.endDate).toISOString().split("T")[0] : "",
      currentlyWorking: experience.currentlyWorking,
      description: experience.description,
    });
    setIsDialogOpen(true);
  };

  // Handle form submission (add or edit)
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const candidateId = localStorage.getItem("id");
      if (!candidateId) throw new Error("Candidate ID not found");

      const newExperience: Experience = {
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        location: formData.location,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.currentlyWorking ? null : new Date(formData.endDate).toISOString(),
        currentlyWorking: formData.currentlyWorking,
        description: formData.description,
        ...(dialogMode === "edit" && { _id: workExperiences[editIndex!]._id }),
      };

      let updatedExperiences: Experience[];
      if (dialogMode === "add") {
        updatedExperiences = [...workExperiences, newExperience];
      } else {
        updatedExperiences = workExperiences.map((exp, i) =>
          i === editIndex ? newExperience : exp
        );
      }

      const updatedCandidate = await updateCandidateExperience(candidateId, updatedExperiences);

      setWorkExperiences(updatedCandidate.experience || []);
      setFormData({
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: "",
      });
      setIsDialogOpen(false);
      setEditIndex(null);
      setSuccessSnackbar(true);
      setSnackbarMessage(
        dialogMode === "add" ? "Experience added successfully!" : "Experience updated successfully!"
      );
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || `Failed to ${dialogMode === "add" ? "add" : "update"} experience`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteSnackbarOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (deleteIndex === null) return;
    try {
      setIsSubmitting(true);
      const candidateId = localStorage.getItem("id");
      if (!candidateId) throw new Error("Candidate ID not found");

      const updatedExperiences = workExperiences.filter((_, i) => i !== deleteIndex);
      const updatedCandidate = await updateCandidateExperience(candidateId, updatedExperiences);

      setWorkExperiences(updatedCandidate.experience || []);
      setSuccessSnackbar(true);
      setSnackbarMessage("Experience deleted successfully!");
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || "Failed to delete experience");
    } finally {
      setIsSubmitting(false);
      setDeleteSnackbarOpen(false);
      setDeleteIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Work Experience"
        subheader="Add your professional experience to showcase your career path"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddExperience}
            disabled={isSubmitting}
          >
            Add Experience
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {workExperiences.map((experience, index) => (
            <Paper key={experience._id || index} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {experience.jobTitle}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <BusinessIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {experience.companyName} {experience.location ? `• ${experience.location}` : ""}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(experience.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {experience.currentlyWorking || !experience.endDate
                        ? "Present"
                        : new Date(experience.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditExperience(index)}
                    disabled={isSubmitting}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    disabled={isSubmitting}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {experience.description}
              </Typography>
            </Paper>
          ))}

          {workExperiences.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <BusinessIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No Work Experience
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your work experience to showcase your career path.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3 }}
                onClick={handleAddExperience}
                disabled={isSubmitting}
              >
                Add Experience
              </Button>
            </Box>
          )}
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditIndex(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{dialogMode === "add" ? "Add Work Experience" : "Edit Work Experience"}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {dialogMode === "add"
                ? "Add details about your work experience"
                : "Update details about your work experience"}
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Backend Developer"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. TCS"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Bangalore, India"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  disabled={formData.currentlyWorking}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.currentlyWorking}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="I currently work here"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and achievements"
                  fullWidth
                  multiline
                  rows={4}
                  margin="dense"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                setEditIndex(null);
              }}
              variant="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={isSubmitting}>
              {dialogMode === "add" ? "Save" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={successSnackbar}
          autoHideDuration={4000}
          onClose={() => setSuccessSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessSnackbar(false)}
            severity="success"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={errorSnackbar}
          autoHideDuration={3000}
          onClose={() => setErrorSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setErrorSnackbar(false)}
            severity="error"
            sx={{ width: "100%", borderRadius: 2 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <DeleteConfirmationSnackbar
          open={deleteSnackbarOpen}
          onClose={() => {
            setDeleteSnackbarOpen(false);
            setDeleteIndex(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName="experience"
        />
      </CardContent>
    </Card>
  );
}