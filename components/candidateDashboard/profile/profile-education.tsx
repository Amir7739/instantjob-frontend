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
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import SchoolIcon from "@mui/icons-material/School"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import AddIcon from "@mui/icons-material/Add"

const educations = [
  {
    id: 1,
    degree: "Master of Computer Science",
    school: "Stanford University",
    location: "Stanford, CA",
    startDate: "Sep 2015",
    endDate: "Jun 2017",
    description: "Specialized in Human-Computer Interaction and Web Technologies. Graduated with honors.",
  },
  {
    id: 2,
    degree: "Bachelor of Science in Computer Science",
    school: "MIT",
    location: "Cambridge, MA",
    startDate: "Sep 2011",
    endDate: "Jun 2015",
    description:
      "Focused on Software Engineering and Data Structures. Participated in hackathons and coding competitions.",
  },
]

export function ProfileEducation() {
  const [educationList, setEducationList] = useState(educations)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader
        title="Education"
        subheader="Add your educational background"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
            Add Education
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {educationList.map((education) => (
            <Paper key={education.id} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {education.degree}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <SchoolIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {education.school} • {education.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {education.startDate} - {education.endDate}
                    </Typography>
                  </Box>
                </Box>
                <IconButton color="error">
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {education.description}
              </Typography>
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
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 3 }} onClick={() => setIsDialogOpen(true)}>
                Add Education
              </Button>
            </Box>
          )}
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Education</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Add details about your educational background</DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="School/University" placeholder="e.g. Stanford University" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Degree" placeholder="e.g. Bachelor of Science" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Field of Study" placeholder="e.g. Computer Science" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Location" placeholder="e.g. Stanford, CA" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Start Date" placeholder="e.g. Sep 2015" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="End Date" placeholder="e.g. Jun 2019" fullWidth margin="dense" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  placeholder="Describe your studies, achievements, etc."
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
