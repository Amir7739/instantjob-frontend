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
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { fetchCandidateById, Education } from "@/services/candidates";
import { updateCandidateEducation } from "@/services/candidateDashobardApi";
import DeleteConfirmationSnackbar from "@/components/DeleteConfirmationSnackbar";

interface FormData {
  degree: string;
  stream: string;
  institute: string;
  passingYear: string; // String for form input, converted to number for backend
  score: string;
}

export function ProfileEducation() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    degree: "",
    stream: "",
    institute: "",
    passingYear: "",
    score: "",
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
          setEducationList(data.education || []);
        })
        .catch((error) => {
          setSnackbarMessage(error.message || "Failed to fetch education");
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

  // Open dialog for adding new education
  const handleAddEducation = () => {
    setDialogMode("add");
    setFormData({
      degree: "",
      stream: "",
      institute: "",
      passingYear: "",
      score: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing an education
  const handleEditEducation = (index: number) => {
    const education = educationList[index];
    setDialogMode("edit");
    setEditIndex(index);
    setFormData({
      degree: education.degree,
      stream: education.stream,
      institute: education.institute,
      passingYear: education.passingYear.toString(),
      score: education.score,
    });
    setIsDialogOpen(true);
  };

  // Handle form submission (add or edit)
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const candidateId = localStorage.getItem("id");
      if (!candidateId) throw new Error("Candidate ID not found");

      // Validate required fields
      if (
        !formData.degree ||
        !formData.stream ||
        !formData.institute ||
        !formData.passingYear ||
        !formData.score
      ) {
        throw new Error("All fields are required");
      }

      const passingYear = parseInt(formData.passingYear);
      if (isNaN(passingYear) || passingYear < 1900 || passingYear > new Date().getFullYear()) {
        throw new Error("Invalid passing year");
      }

      const newEducation: Education = {
        degree: formData.degree,
        stream: formData.stream,
        institute: formData.institute,
        passingYear,
        score: formData.score,
        ...(dialogMode === "edit" && { _id: educationList[editIndex!]._id }),
      };

      let updatedEducations: Education[];
      if (dialogMode === "add") {
        updatedEducations = [...educationList, newEducation];
      } else {
        updatedEducations = educationList.map((edu, i) =>
          i === editIndex ? newEducation : edu
        );
      }

      const updatedCandidate = await updateCandidateEducation(candidateId, updatedEducations);

      setEducationList(updatedCandidate.education || []);
      setFormData({
        degree: "",
        stream: "",
        institute: "",
        passingYear: "",
        score: "",
      });
      setIsDialogOpen(false);
      setEditIndex(null);
      setSuccessSnackbar(true);
      setSnackbarMessage(
        dialogMode === "add" ? "Education added successfully!" : "Education updated successfully!"
      );
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || `Failed to ${dialogMode === "add" ? "add" : "update"} education`);
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

      const updatedEducations = educationList.filter((_, i) => i !== deleteIndex);
      const updatedCandidate = await updateCandidateEducation(candidateId, updatedEducations);

      setEducationList(updatedCandidate.education || []);
      setSuccessSnackbar(true);
      setSnackbarMessage("Education deleted successfully!");
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || "Failed to delete education");
    } finally {
      setIsSubmitting(false);
      setDeleteSnackbarOpen(false);
      setDeleteIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Education"
        subheader="Add your educational background"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEducation}
            disabled={isSubmitting}
          >
            Add Education
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {educationList.map((education, index) => (
            <Paper key={education._id || index} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {education.degree}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {education.institute} • {education.stream}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {education.passingYear} • {education.score}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditEducation(index)}
                    disabled={isSubmitting}
                    aria-label="Edit education"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    disabled={isSubmitting}
                    aria-label="Delete education"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}

          {educationList.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SchoolIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No Education Added
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your educational background to showcase your qualifications.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3 }}
                onClick={handleAddEducation}
                disabled={isSubmitting}
              >
                Add Education
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
          <DialogTitle>{dialogMode === "add" ? "Add Education" : "Edit Education"}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {dialogMode === "add"
                ? "Add details about your educational background"
                : "Update details about your educational background"}
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g. B.Tech"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Field of Study"
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="School/University"
                  name="institute"
                  value={formData.institute}
                  onChange={handleInputChange}
                  placeholder="e.g. IIT Delhi"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Passing Year"
                  name="passingYear"
                  type="number"
                  value={formData.passingYear}
                  onChange={handleInputChange}
                  placeholder="e.g. 2020"
                  fullWidth
                  margin="dense"
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Score"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  placeholder="e.g. 70%"
                  fullWidth
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
          itemName="education"
        />
      </CardContent>
    </Card>
  );
}