"use client"

import { useState } from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import CodeIcon from "@mui/icons-material/Code"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"

const initialSkills = [
  { id: 1, name: "React", level: "Expert" },
  { id: 2, name: "TypeScript", level: "Expert" },
  { id: 3, name: "JavaScript", level: "Expert" },
  { id: 4, name: "HTML/CSS", level: "Expert" },
  { id: 5, name: "Next.js", level: "Advanced" },
  { id: 6, name: "Redux", level: "Advanced" },
  { id: 7, name: "Node.js", level: "Intermediate" },
  { id: 8, name: "GraphQL", level: "Intermediate" },
  { id: 9, name: "Tailwind CSS", level: "Advanced" },
  { id: 10, name: "Material UI", level: "Advanced" },
  { id: 11, name: "Jest", level: "Intermediate" },
  { id: 12, name: "Cypress", level: "Intermediate" },
]

export function ProfileSkills() {
  const [skills, setSkills] = useState(initialSkills)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [skillLevel, setSkillLevel] = useState("Intermediate")

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { id: skills.length + 1, name: newSkill.trim(), level: skillLevel }])
      setNewSkill("")
      setSkillLevel("Intermediate")
      setIsDialogOpen(false)
    }
  }

  const removeSkill = (id: number) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  return (
    <Card>
      <CardHeader
        title="Skills"
        subheader="Add your technical and professional skills"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
            Add Skill
          </Button>
        }
      />
      <CardContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {skills.map((skill) => (
            <Chip
              key={skill.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {skill.name}
                  <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
                    ({skill.level})
                  </Typography>
                </Box>
              }
              onDelete={() => removeSkill(skill.id)}
              deleteIcon={<CloseIcon fontSize="small" />}
              sx={{ px: 1, py: 2.5 }}
            />
          ))}

          {skills.length === 0 && (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
              <CodeIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                No Skills Added
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your skills to showcase your expertise to employers.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 3 }} onClick={() => setIsDialogOpen(true)}>
                Add Skill
              </Button>
            </Box>
          )}
        </Box>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>Add a new skill to your profile</DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Skill Name"
                  placeholder="e.g. React, Project Management"
                  fullWidth
                  margin="dense"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Proficiency Level"
                  fullWidth
                  margin="dense"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setIsDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={addSkill} variant="contained">
              Add Skill
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}
