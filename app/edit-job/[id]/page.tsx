// app/edit-job/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, CircularProgress, Typography, Button } from "@mui/material";
import JobCreateForm from "@/components/JobCreateForm";
import Navbar from "@/components/Navbar";
import { fetchJobById } from "@/services/fetchJobForAdmin";

const EditJobPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  const [jobData, setJobData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError(null);
      try {
       
        const job = await fetchJobById(jobId);
       
        setJobData({ ...job }); // Ensure new object reference
        
      } catch (err: any) {
        setError(err.message || "Error loading job data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ my: 5, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => router.push("/admin-dashboard")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!jobData) {
    return (
      <Container sx={{ my: 5, textAlign: "center" }}>
        <Typography color="error">No job data available</Typography>
        <Button variant="contained" onClick={() => router.push("/admin-dashboard")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <JobCreateForm isEditing={true} initialJobData={jobData} jobId={jobId} />
    </>
  );
};

export default EditJobPage;