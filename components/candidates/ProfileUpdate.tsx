import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Add, Delete } from "@mui/icons-material";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

// Define types for candidate data
interface Education {
  degree: string;
  stream: string;
  institute: string;
  passingYear: number;
  score: string;
}

interface Experience {
  companyName: string;
  jobTitle: string;
  startDate: Date;
  endDate: Date;
  currentlyWorking: boolean;
  description: string;
}

interface Candidate {
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  pincode: string;
  education: Education[];
  experience: Experience[];
  totalExperience: string;
  skills: string[];
  resumeUrl: string;
  preferredJobType: string;
  preferredLocation: string;
  expectedSalary: string;
  noticePeriod: string;
}

const ProfileUpdate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [candidateData, setCandidateData] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<Candidate | null>(null);

  useEffect(() => {
    // Get the user ID from localStorage
    const userId = localStorage.getItem("id");

    if (userId) {
      // Fetch candidate data using the user ID from localStorage
      const fetchCandidateData = async () => {
        try {
          const res = await axiosInstance.get(`/candidates/get/${userId}`);

          setCandidateData(res.data.candidate);
          setFormData(res.data.candidate);
        } catch (err) {
          toast.error("Error fetching candidate data.");
        }
      };

      fetchCandidateData();
    } else {
      toast.error("No user ID found in localStorage.");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name!]: value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
    index: number,
    field: string
  ) => {
    const { name, value } = e.target;
    const newArray = [...(formData?.[name as keyof Candidate] as any[])];
    newArray[index][field] = value;
    setFormData((prev) => ({
      ...prev!,
      [name!]: newArray,
    }));
  };

  const handleAddEducation = () => {
    const newEducation = {
      degree: "",
      stream: "",
      institute: "",
      passingYear: 0,
      score: "",
    };
    setFormData((prev) => ({
      ...prev!,
      education: [...(prev?.education || []), newEducation],
    }));
  };

  const handleAddExperience = () => {
    const newExperience = {
      companyName: "",
      jobTitle: "",
      startDate: new Date(),
      endDate: new Date(),
      currentlyWorking: false,
      description: "",
    };
    setFormData((prev) => ({
      ...prev!,
      experience: [...(prev?.experience || []), newExperience],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...(formData?.education || [])];
    newEducation.splice(index, 1);
    setFormData((prev) => ({
      ...prev!,
      education: newEducation,
    }));
  };

  const handleRemoveExperience = (index: number) => {
    const newExperience = [...(formData?.experience || [])];
    newExperience.splice(index, 1);
    setFormData((prev) => ({
      ...prev!,
      experience: newExperience,
    }));
  };

  const handleSkillChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData((prev) => ({
      ...prev!,
      skills: e.target.value as string[],
    }));
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setLoading(true);
    const userId = localStorage.getItem("id");

    if (userId) {
      try {
        await axiosInstance.put(`/candidates/update/${userId}`, formData);
        toast.success("Profile updated successfully!");
        router.push("/dashboard"); // Redirect to dashboard or another page
      } catch (err) {
        toast.error("Error updating profile.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("No user ID found in localStorage.");
    }
  };

  if (loading || !formData) return <CircularProgress />;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4">Update Profile</Typography>
      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={formData.full_name}
            name="full_name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            value={formData.phone}
            name="phone"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={formData.email}
            name="email"
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            value={formData.city}
            name="city"
            onChange={handleChange}
          />
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <TextField
            label="Skills (comma separated)"
            variant="outlined"
            fullWidth
            value={formData.skills.join(", ")}
            name="skills"
            onChange={(e) => handleSkillChange(e)}
          />
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          <Typography variant="h6">Education</Typography>
          {formData.education.map((edu, index) => (
            <Grid container spacing={3} key={index}>
              <Grid item xs={3}>
                <TextField
                  label="Degree"
                  variant="outlined"
                  fullWidth
                  value={edu.degree}
                  name="education"
                  onChange={(e) => handleArrayChange(e, index, "degree")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Stream"
                  variant="outlined"
                  fullWidth
                  value={edu.stream}
                  name="education"
                  onChange={(e) => handleArrayChange(e, index, "stream")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Institute"
                  variant="outlined"
                  fullWidth
                  value={edu.institute}
                  name="education"
                  onChange={(e) => handleArrayChange(e, index, "institute")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Passing Year"
                  variant="outlined"
                  fullWidth
                  value={edu.passingYear}
                  name="education"
                  onChange={(e) => handleArrayChange(e, index, "passingYear")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Score"
                  variant="outlined"
                  fullWidth
                  value={edu.score}
                  name="education"
                  onChange={(e) => handleArrayChange(e, index, "score")}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveEducation(index)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={handleAddEducation}
            variant="contained"
            color="primary"
          >
            Add Education
          </Button>
        </Grid>

        {/* Experience */}
        <Grid item xs={12}>
          <Typography variant="h6">Experience</Typography>
          {formData.experience.map((exp, index) => (
            <Grid container spacing={3} key={index}>
              <Grid item xs={3}>
                <TextField
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  value={exp.companyName}
                  name="experience"
                  onChange={(e) => handleArrayChange(e, index, "companyName")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  value={exp.jobTitle}
                  name="experience"
                  onChange={(e) => handleArrayChange(e, index, "jobTitle")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={exp.startDate}
                  name="experience"
                  onChange={(e) => handleArrayChange(e, index, "startDate")}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="End Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={exp.endDate}
                  name="experience"
                  onChange={(e) => handleArrayChange(e, index, "endDate")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={exp.description}
                  name="experience"
                  onChange={(e) => handleArrayChange(e, index, "description")}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveExperience(index)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            onClick={handleAddExperience}
            variant="contained"
            color="primary"
          >
            Add Experience
          </Button>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Profile
          </Button>
        </Grid>
      </Grid>

      <ToastContainer />
    </div>
  );
};

export default ProfileUpdate;
