"use client"

import { useState } from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import BusinessIcon from "@mui/icons-material/Business"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import AddIcon from "@mui/icons-material/Add"

const experiences = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "New York, NY",
    startDate: "Jan 2022",
    endDate: "Present",
    current: true,
    description:
      "Led the development of the company's flagship product using React and TypeScript. Implemented responsive designs and improved performance by 40%.",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "WebSolutions",
    location: "San Francisco, CA",
    startDate: "Mar 2019",
    endDate: "Dec 2021",
    current: false,
    description:
      "Developed and maintained client websites using React, Redux, and CSS-in-JS. Collaborated with designers to implement pixel-perfect UIs.",
  },
  {
    id: 3,
    title: "Junior Web Developer",
    company: "StartupHub",
    location: "Boston, MA",
    startDate: "Jun 2017",
    endDate: "Feb 2019",
    current: false,
    description:
      "Built responsive websites for clients using HTML, CSS, and JavaScript. Assisted in the development of a company-wide design system.",
  },
]

export function ProfileWorkExperience() {
  const [workExperiences, setWorkExperiences] = useState(experiences)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentExperience, setCurrentExperience] = useState(true)

  return (
    <Card>
      <CardHeader
        title="Work Experience"
        subheader="Add your professional experience to showcase your career path"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
            Add Experience
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {workExperiences.map((experience) => (
            <Paper key={experience.id} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {experience.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <BusinessIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {experience.company} • {experience.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {experience.startDate} - {experience.endDate}
                    </Typography>
                  </Box>
                </Box>
                <IconButton color="error">
                  <DeleteOutlineIcon />
                </IconButton>
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
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 3 }} onClick={() => setIsDialogOpen(true)}>
                Add Experience
              </Button>
            </Box>
          )}
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Work Experience</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Add details about your work experience</DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Job Title" placeholder="e.g. Frontend Developer" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Company" placeholder="e.g. TechCorp Inc." fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Location" placeholder="e.g. New York, NY" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Start Date" placeholder="e.g. Jan 2022" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  placeholder="e.g. Present"
                  fullWidth
                  margin="dense"
                  disabled={currentExperience}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox checked={currentExperience} onChange={(e) => setCurrentExperience(e.target.checked)} />
                  }
                  label="I currently work here"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
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
            <Button onClick={() => setIsDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}
