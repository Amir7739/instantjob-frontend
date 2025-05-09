"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Chip,
  useTheme,
  alpha,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { fetchCandidateById } from "@/services/candidates";
import axiosInstance from "@/utils/axios";
import { updateCandidateProfile } from "@/services/candidateDashobardApi";


interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  about?: string;
  profileImage?: string;
  skills: string[];
}

export function ProfileBasicInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    about: "",
    profileImage: null as File | null,
    skills: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  // Fetch candidate data on mount
  useEffect(() => {
    const candidateId = localStorage.getItem("id"); // e.g., "680241be318420687c2fea99"
    if (candidateId) {
      fetchCandidateById(candidateId)
        .then((data) => {
          setCandidate(data);
          setFormData({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            about: data.about || "",
            profileImage: null,
            skills: data.skills || [],
          });
        })
        .catch((error) => {
          setSnackbarMessage(error.message);
          setErrorSnackbar(true);
        });
    } else {
      setSnackbarMessage("No candidate ID found in localStorage");
      setErrorSnackbar(true);
    }
  }, []);

  // Handle file input change for profile image
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic client-side validation
      const filetypes = /jpeg|jpg|png|gif/;
      if (!filetypes.test(file.type)) {
        setSnackbarMessage("Only images are allowed (jpg, png, gif)");
        setErrorSnackbar(true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage("File size must be less than 5MB");
        setErrorSnackbar(true);
        return;
      }

      setFormData({ ...formData, profileImage: file });
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setOpenUploadDialog(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle skill addition
  const handleAddSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  // Handle skill change
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData({ ...formData, skills: newSkills });
  };

  // Handle skill deletion
  const handleDeleteSkill = (index: number) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const candidateId = localStorage.getItem("id");
      if (!candidateId) throw new Error("Candidate ID not found");

      const updatedCandidate = await updateCandidateProfile(candidateId, formData);

      setCandidate(updatedCandidate);
      setFormData({
        full_name: updatedCandidate.full_name,
        email: updatedCandidate.email,
        phone: updatedCandidate.phone,
        city: updatedCandidate.city,
        about: updatedCandidate.about || "",
        profileImage: null,
        skills: updatedCandidate.skills || [],
      });
      setIsEditing(false);
      setSuccessSnackbar(true);
      setSnackbarMessage("Profile updated successfully!");
    } catch (error: any) {
      setErrorSnackbar(true);
      setSnackbarMessage(error.message || "Failed to update profile");
    }
  };

  if (!candidate) return <Typography>Loading...</Typography>;

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "visible",
        position: "relative",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <Box
        sx={{
          height: 120,
          bgcolor: theme.palette.primary.main,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          position: "relative",
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0))",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: "white", opacity: 0.8 }}>
          Candidate Profile
        </Typography>
      </Box>

      <CardHeader
        title={
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 6 }}>
            Basic Information
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Update your personal information
          </Typography>
        }
        action={
          <IconButton
          disabled={isEditing}
            onClick={() => setIsEditing(!isEditing)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
              transition: "all 0.2s ease",
              mt: 6,
            }}
          >
            <EditIcon color={!isEditing ? "primary" : "disabled"} />
          </IconButton>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Box
          sx={{
            position: "absolute",
            top: 50,
            left: 30,
            zIndex: 2,
          }}
        >
          <Paper
            elevation={4}
            sx={{
              borderRadius: "50%",
              p: 0.5,
              bgcolor: "background.paper",
              width: 130,
              height: 130,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={
                formData.profileImage
                  ? URL.createObjectURL(formData.profileImage)
                  : candidate.profileImage || "/placeholder-user.jpg"
              }
              alt="Profile"
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${theme.palette.background.paper}`,
              }}
            />
            <IconButton
            disabled={!isEditing}
              onClick={() => setOpenUploadDialog(true)}
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                bgcolor: theme.palette.background.paper,
                "&:hover": { bgcolor: theme.palette.grey[200] },
                boxShadow: theme.shadows[2],
                zIndex: 2,
                width: 36,
                height: 36,
              }}
              size="small"
            >
              <CameraAltIcon fontSize="small" color={isEditing ? "primary" : "disabled"} />
            </IconButton>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-end" },
            justifyContent: { xs: "center", sm: "flex-end" },
            mb: 4,
            ml: { xs: 0, sm: 16 },
            mt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: theme.palette.text.secondary,
              pr: 2,
            }}
          >
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">{candidate.city || "Not specified"}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: theme.palette.text.secondary,
              px: 2,
            }}
          >
            <EmailIcon fontSize="small" />
            <Typography variant="body2">{candidate.email}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              color: theme.palette.text.secondary,
              pl: 2,
            }}
          >
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">{candidate.phone || "Not specified"}</Typography>
          </Box>
        </Box>

        <Box sx={{ ml: { xs: 0, sm: 16 }, mb: 3, textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="h4" fontWeight="bold">
            {candidate.full_name}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Personal Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? "transparent" : alpha(theme.palette.grey[100], 0.5),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? "transparent" : alpha(theme.palette.grey[100], 0.5),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? "transparent" : alpha(theme.palette.grey[100], 0.5),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? "transparent" : alpha(theme.palette.grey[100], 0.5),
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Skills
              </Typography>
            </Box>
            {isEditing && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddSkill}
                sx={{ borderRadius: 2 }}
              >
                Add Skill
              </Button>
            )}
          </Box>

          {isEditing &&
            formData.skills.map((skill, index) => (
              <Grid container spacing={2} sx={{ mb: 2 }} key={index}>
                <Grid item xs={9}>
                  <TextField
                    fullWidth
                    label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    variant="outlined"
                    placeholder="e.g. React, Python"
                    size="small"
                    InputProps={{
                      sx: { borderRadius: 2 },
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <IconButton onClick={() => handleDeleteSkill(index)}>
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                color="primary"
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
                onDelete={isEditing ? () => handleDeleteSkill(index) : undefined}
              />
            ))}
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              About Me
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Professional Summary"
            name="about"
            multiline
            rows={5}
            value={formData.about}
            onChange={handleInputChange}
            disabled={!isEditing}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                bgcolor: isEditing ? "transparent" : alpha(theme.palette.grey[100], 0.5),
              },
            }}
          />
        </Paper>
      </CardContent>

      {isEditing && (
        <CardActions
          sx={{
            justifyContent: "flex-end",
            p: 3,
            bgcolor: alpha(theme.palette.primary.light, 0.05),
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setIsEditing(false);
              setFormData({
                full_name: candidate.full_name,
                email: candidate.email,
                phone: candidate.phone,
                city: candidate.city,
                about: candidate.about || "",
                profileImage: null,
                skills: candidate.skills || [],
              });
              setUploadProgress(0);
            }}
            sx={{
              mr: 1,
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
            startIcon={<EditIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              boxShadow: 2,
            }}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </CardActions>
      )}

      <Dialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>Upload Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                border: `2px dashed ${theme.palette.primary.main}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadFileIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  opacity: 0.7,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Click to upload your photo or drag and drop
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: JPG, PNG, GIF (Max 5MB)
            </Typography>

            {uploadProgress > 0 && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 8,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: "right" }}>
                  {uploadProgress}% uploaded
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="contained"
            sx={{ borderRadius: 2 }}
            startIcon={<UploadFileIcon />}
          >
            Select File
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
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
    </Card>
  );
}