"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ProfileBasicInfo } from "@/components/candidateDashboard/profile/profile-basic-info";
import { ProfileEducation } from "@/components/candidateDashboard/profile/profile-education";
import { ProfileWorkExperience } from "@/components/candidateDashboard/profile/profile-work-experience";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import { Alert, Button, Snackbar } from "@mui/material";
import { fetchCandidateById } from "@/services/candidates";
import { ProfileProjects } from "@/components/candidateDashboard/profile/profile-projects";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      <AnimatePresence mode="wait">
        {value === index && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box sx={{ py: 3 }}>{children}</Box>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const candidateId = localStorage.getItem("id");
        if (candidateId) {
          const candidate = await fetchCandidateById(candidateId);
          setResumeUrl(candidate.resumeUrl);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch resume data",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a file to upload",
        severity: "error",
      });
      return;
    }

    setUploading(true);

    try {
      const candidateId = localStorage.getItem("id");
      if (!candidateId) {
        throw new Error("Candidate ID not found");
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await axiosInstance.put(
        `/candidates/resume/${candidateId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResumeUrl(response.data.candidate.resumeUrl);
      setSnackbar({
        open: true,
        message: "Resume uploaded successfully",
        severity: "success",
      });
      setFile(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: axios.isAxiosError(err)
          ? err.response?.data.error || "Upload failed"
          : "Upload failed",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 4 }}>
      <Typography variant="h6" gutterBottom>
        {resumeUrl ? "Update Your Resume" : "Upload Your Resume"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload your latest resume to showcase your qualifications and experience to potential employers. (PDF format recommended)
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {resumeUrl && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Current Resume:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </Button>
                <Button variant="outlined" href={resumeUrl} download>
                  Download Resume
                </Button>
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: "block", marginBottom: "16px" }}
            />
            {file && (
              <Typography variant="body2" color="text.secondary">
                Selected file: {file.name}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading || !file}
            sx={{ mb: 2 }}
          >
            {uploading
              ? "Uploading..."
              : resumeUrl
              ? "Update Resume"
              : "Upload Resume"}
          </Button>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ProfilePage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto",
            p: { xs: 2, md: 3 }, }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile information to maximize your job opportunities.
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="profile tabs"
            sx={{
              "& .MuiTabs-indicator": { transition: "all 0.3s ease-in-out" },
            }}
          >
            <Tab label="Basic Info" {...a11yProps(0)} />
            <Tab label="Experience" {...a11yProps(1)} />
            <Tab label="Education" {...a11yProps(2)} />
            <Tab label="Project" {...a11yProps(3)} />
            <Tab label="Upload Resume" {...a11yProps(4)} />{" "}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProfileBasicInfo />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProfileWorkExperience />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProfileEducation />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <ProfileProjects />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <ResumeUpload />
        </TabPanel>
      </Box>
    </Box>
  );
}
