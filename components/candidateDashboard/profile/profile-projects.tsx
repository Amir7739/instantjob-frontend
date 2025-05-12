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
  Chip,
  Autocomplete,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { fetchCandidateById } from "@/services/candidates";
import { Project, updateCandidateProjects } from "@/services/candidateDashobardApi"; // Adjust path
import DeleteConfirmationSnackbar from "@/components/DeleteConfirmationSnackbar";

interface FormData {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  technologies: string[];
  link: string;
}

export function ProfileProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    technologies: [],
    link: "",
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
          setProjects(data.projects || []);
        })
        .catch((error) => {
          setSnackbarMessage(error.message || "Failed to fetch projects");
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

  // Handle technologies change
  const handleTechnologiesChange = (_event: any, newValue: string[]) => {
    setFormData({ ...formData, technologies: newValue });
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      currentlyWorking: e.target.checked,
      endDate: e.target.checked ? "" : formData.endDate,
    });
  };

  // Open dialog for adding new project
  const handleAddProject = () => {
    setDialogMode("add");
    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      technologies: [],
      link: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing a project
  const handleEditProject = (index: number) => {
    const project = projects[index];
    setDialogMode("edit");
    setEditIndex(index);
    setFormData({
      projectName: project.projectName,
      description: project.description,
      startDate: new Date(project.startDate).toISOString().split("T")[0],
      endDate: project.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
      currentlyWorking: project.currentlyWorking,
      technologies: project.technologies || [],
      link: project.link || "",
    });
    setIsDialogOpen(true);
  };

  // Handle form submission (add or edit)
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const candidateId = localStorage.getItem("id");
      if (!candidateId) throw new Error("Candidate ID not found");

      const newProject: Project = {
        projectName: formData.projectName,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.currentlyWorking ? null : formData.endDate ? new Date(formData.endDate).toISOString() : null,
        currentlyWorking: formData.currentlyWorking,
        technologies: formData.technologies,
        link: formData.link,
        ...(dialogMode === "edit" && { _id: projects[editIndex!]._id }),
      };

      let updatedProjects: Project[];
      if (dialogMode === "add") {
        updatedProjects = [...projects, newProject];
      } else {
        updatedProjects = projects.map((proj, i) =>
          i === editIndex ? newProject : proj
        );
      }

      const updatedCandidate = await updateCandidateProjects(candidateId, updatedProjects);

      setProjects(updatedCandidate.projects || []);
      setFormData({
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        technologies: [],
        link: "",
      });
      setIsDialogOpen(false);
      setEditIndex(null);
      setSuccessSnackbar(true);
      setSnackbarMessage(
        dialogMode === "add" ? "Project added successfully!" : "Project updated successfully!"
      );
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || `Failed to ${dialogMode === "add" ? "add" : "update"} project`);
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

      const updatedProjects = projects.filter((_, i) => i !== deleteIndex);
      const updatedCandidate = await updateCandidateProjects(candidateId, updatedProjects);

      setProjects(updatedCandidate.projects || []);
      setSuccessSnackbar(true);
      setSnackbarMessage("Project deleted successfully!");
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || "Failed to delete project");
    } finally {
      setIsSubmitting(false);
      setDeleteSnackbarOpen(false);
      setDeleteIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Projects"
        subheader="Add your projects to showcase your skills and achievements"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProject}
            disabled={isSubmitting}
          >
            Add Project
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projects.map((project, index) => (
            <Paper key={project._id || index} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {project.projectName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(project.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {project.currentlyWorking || !project.endDate
                        ? "Present"
                        : new Date(project.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                    </Typography>
                  </Box>
                  {project.technologies.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {project.technologies.map((tech, techIndex) => (
                        <Chip key={techIndex} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  )}
                  {project.link && (
                    <Typography
                      variant="body2"
                      color="primary"
                      component="a"
                      href={project.link}
                      target="_blank"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Project Link
                    </Typography>
                  )}
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProject(index)}
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
                {project.description}
              </Typography>
            </Paper>
          ))}

          {projects.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <WorkIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No Projects
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your projects to showcase your skills and achievements.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3 }}
                onClick={handleAddProject}
                disabled={isSubmitting}
              >
                Add Project
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
          <DialogTitle>{dialogMode === "add" ? "Add Project" : "Edit Project"}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {dialogMode === "add"
                ? "Add details about your project"
                : "Update details about your project"}
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g. E-commerce Platform"
                  fullWidth
                  margin="dense"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="technologies"
                  options={[]}
                  freeSolo
                  value={formData.technologies}
                  onChange={handleTechnologiesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Technologies"
                      placeholder="e.g. React, Node.js"
                      margin="dense"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Project Link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="e.g. https://github.com/your-repo"
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
                  label="I am currently working on this project"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project and contributions"
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
          itemName="project"
        />
       </CardContent>
    </Card>
  );
}