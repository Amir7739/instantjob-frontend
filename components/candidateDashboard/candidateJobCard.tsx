"use client"

import { useCallback, useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  Tooltip,
  Snackbar,
  Alert
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import BusinessIcon from "@mui/icons-material/Business"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import { applyJob, checkJobAppliedOrNot } from "@/services/applyJob"
import { useRouter } from "next/navigation"
import { CandidateJob } from "@/services/candidateDashobardApi"


interface JobCardProps {
  job: CandidateJob
  savedJobs: any[]
  toggleSaveJob: (jobId: any) => void
  candidateId: string | null
  onJobApplied?: (jobId: string) => void
}

export function CandidateJobCard({ job, savedJobs, toggleSaveJob, candidateId,onJobApplied }: JobCardProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isApplied, setIsApplied] = useState(job.isApplied || false)

  const isSaved = savedJobs.includes(job.id)

  const router = useRouter()

  useEffect(() => {
    const checkAppliedStatus = async () => {
      if (candidateId && !job.isApplied) {
        try {
          const appliedStatus = await checkJobAppliedOrNot(candidateId, job.id.toString())
          setIsApplied(appliedStatus === 1)
        } catch (error: any) {
          console.error("Error checking applied status:", error.message)
        }
      }
    }
    checkAppliedStatus()
  }, [candidateId, job.id, job.isApplied])

  const handleBookmarkClick = useCallback(() => {
    if (isApplied) return;
    toggleSaveJob(job.id)
    setSnackbarMessage(isSaved ? "Job unsaved successfully" : "Job saved successfully")
    setSnackbarOpen(true)
  }, [job.id, toggleSaveJob, isSaved])

  const handleApplyClick = useCallback(async () => {
    if (!candidateId) {
      setSnackbarMessage("You must be logged in to apply for jobs")
      setSnackbarOpen(true)
      return
    }
    try {
      await applyJob(candidateId, job.id.toString())
      setSnackbarMessage("Job applied successfully")
      setSnackbarOpen(true)
      setIsApplied(true)
      if (onJobApplied) {
        onJobApplied(job.id.toString())
      }
    } catch (error: any) {
      setSnackbarMessage("Failed to apply for job. Please try again.")
      setSnackbarOpen(true)
    }
  }, [candidateId, job.id,onJobApplied])

  const handleJobDescription = useCallback(() => {
    router.push(`/jobs-desc/${job.id}`)
  }, [job.id, router])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h6">{job.title}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">{job.company}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">{job.location}</Typography>
              </Box>
            </Box>
            <Chip 
              label={`${job.matchScore}% Match`} 
              color="primary" 
              size="small" 
              sx={{ fontWeight: "medium" }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Salary: {job.salary} • Posted: {job.posted}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {job.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </CardContent>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,gap: 3 }}>
          <Tooltip title={isApplied ? "Already applied" : "Apply for this job"}>
            <span>
              <Button 
                variant="contained" 
                fullWidth={!isMobile}
                onClick={handleApplyClick}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </Button>
            </span>
          </Tooltip>
          <Button 
            variant="outlined" 
            size="small"
            onClick={handleJobDescription}
            sx={{ flex: 1,textAlign: 'center' }}
          >
            View Details
          </Button>
          { !isApplied && <Tooltip title={isApplied ? "Applied job cannot be saved" : isSaved ? "Unsave this job" : "Save this job"}>
            <span>
              <IconButton 
                onClick={handleBookmarkClick} 
                aria-label={isSaved ? "Unsave job" : "Save job"}
                disabled={isApplied}
              >
                {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </span>
          </Tooltip>}
        </Box>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarMessage.includes("Failed") ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}