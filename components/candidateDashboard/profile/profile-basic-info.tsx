"use client"

import { useState, useRef } from "react"
import { 
  Card, CardContent, CardHeader, CardActions,
  Typography, Box, Grid, TextField, Button,
  IconButton, Avatar, Divider, Paper, Chip,
  useTheme, alpha, Stack, Dialog, DialogContent,
  DialogActions, DialogTitle, LinearProgress,
  MenuItem, Select, InputLabel, FormControl,
  Tooltip, Snackbar, Alert
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import WorkIcon from "@mui/icons-material/Work"
import SaveIcon from "@mui/icons-material/Save"
import PersonIcon from "@mui/icons-material/Person"
import AddIcon from "@mui/icons-material/Add"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import SchoolIcon from "@mui/icons-material/School"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"

export function ProfileBasicInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [openUploadDialog, setOpenUploadDialog] = useState(false)
  const [successSnackbar, setSuccessSnackbar] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [skills, setSkills] = useState([
    { name: 'React', level: 'Expert', years: 5 },
    { name: 'TypeScript', level: 'Expert', years: 4 },
    { name: 'Next.js', level: 'Advanced', years: 3 },
    { name: 'Material UI', level: 'Advanced', years: 3 },
    { name: 'CSS', level: 'Expert', years: 6 },
    { name: 'JavaScript', level: 'Expert', years: 6 }
  ])
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', years: 1 })
  const fileInputRef = useRef(null)
  const theme = useTheme()

  const handleUploadClick = () => {
    setOpenUploadDialog(true)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate file upload
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setOpenUploadDialog(false)
              setSuccessSnackbar(true)
            }, 500)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.name.trim() !== '') {
      setSkills([...skills, { ...newSkill }])
      setNewSkill({ name: '', level: 'Beginner', years: 1 })
    }
  }

  const getSkillLevelColor = (level) => {
    switch(level) {
      case 'Expert': return theme.palette.success.main
      case 'Advanced': return theme.palette.info.main
      case 'Intermediate': return theme.palette.warning.main
      default: return theme.palette.primary.main
    }
  }

  return (
    <Card 
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6]
        }
      }}
    >
      {/* Colored top section */}
      <Box 
        sx={{ 
          height: 120, 
          bgcolor: theme.palette.primary.main,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          position: 'relative',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0))',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 2
        }}
      >
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
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
            onClick={() => setIsEditing(!isEditing)}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              },
              transition: 'all 0.2s ease',
              mt: 6
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ pt: 1 }}>
        {/* Profile Avatar with shadow overlay */}
        <Box sx={{ 
          position: 'absolute', 
          top: 50, 
          left: 30, 
          zIndex: 2,
        }}>
          <Paper 
            elevation={4}
            sx={{ 
              borderRadius: '50%', 
              p: 0.5, 
              bgcolor: 'background.paper',
              width: 130,
              height: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar 
              src="/placeholder-user.jpg" 
              alt="Profile" 
              sx={{ 
                width: 120, 
                height: 120,
                border: `3px solid ${theme.palette.background.paper}`
              }}
            />
            <IconButton
              onClick={handleUploadClick}
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                bgcolor: theme.palette.background.paper,
                '&:hover': { bgcolor: theme.palette.grey[200] },
                boxShadow: theme.shadows[2],
                zIndex: 2,
                width: 36,
                height: 36
              }}
              size="small"
            >
              <CameraAltIcon fontSize="small" color="primary" />
            </IconButton>
          </Paper>
        </Box>

        {/* User info summary */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          alignItems: { xs: "center", sm: "flex-end" }, 
          justifyContent: { xs: "center", sm: "flex-end" }, 
          mb: 4, 
          ml: { xs: 0, sm: 16 },
          mt: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center', 
            color: theme.palette.text.secondary,
            pr: 2
          }}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">New York, NY</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center', 
            color: theme.palette.text.secondary,
            px: 2
          }}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">john.peterson@example.com</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center', 
            color: theme.palette.text.secondary,
            pl: 2
          }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Box>
        </Box>

        {/* Name and title */}
        <Box sx={{ ml: { xs: 0, sm: 16 }, mb: 3, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h4" fontWeight="bold">John Peterson</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <WorkIcon fontSize="small" color="primary" />
            <Typography variant="subtitle1" color="text.secondary">
              Senior Frontend Developer
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Form fields - Personal Info */}
        <Paper 
          elevation={1} 
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BusinessCenterIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              Personal Information
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue="Amir Alam"
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
                  }
                }}
              />
            </Grid>
           
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue="john.peterson@example.com"
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                defaultValue="+1 (555) 123-4567"
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                defaultValue="New York, NY"
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Headline"
                defaultValue="Senior Frontend Developer with 5+ years of experience"
                disabled={!isEditing}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Professional Skills */}
        <Paper 
          elevation={1} 
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Professional Skills
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

          {isEditing && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  variant="outlined"
                  placeholder="e.g. React, Python, Project Management"
                  size="small"
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="skill-level-label">Proficiency Level</InputLabel>
                  <Select
                    labelId="skill-level-label"
                    value={newSkill.level}
                    label="Proficiency Level"
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                    <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Years"
                  type="number"
                  value={newSkill.years}
                  onChange={(e) => setNewSkill({...newSkill, years: parseInt(e.target.value) || 0})}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
            {skills.map((skill, index) => (
              <Tooltip 
                key={index} 
                title={`${skill.level} · ${skill.years} year${skill.years !== 1 ? 's' : ''}`}
                arrow
              >
                <Chip 
                  label={skill.name} 
                  color="primary" 
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: alpha(getSkillLevelColor(skill.level), 0.1),
                    border: `1px solid ${alpha(getSkillLevelColor(skill.level), 0.3)}`,
                    color: getSkillLevelColor(skill.level),
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: alpha(getSkillLevelColor(skill.level), 0.2),
                    }
                  }}
                  onDelete={isEditing ? () => {
                    setSkills(skills.filter((_, i) => i !== index))
                  } : undefined}
                />
              </Tooltip>
            ))}
          </Box>
        </Paper>

        {/* About Me */}
        <Paper 
          elevation={1} 
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="medium">
              About Me
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Professional Summary"
            multiline
            rows={5}
            defaultValue="Experienced Frontend Developer with a passion for creating intuitive and responsive web applications. Proficient in React, TypeScript, and Next.js with a strong understanding of modern web development practices. I have successfully delivered multiple projects for enterprise clients, focusing on performance optimization and accessibility."
            disabled={!isEditing}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                bgcolor: isEditing ? 'transparent' : alpha(theme.palette.grey[100], 0.5)
              }
            }}
          />
        </Paper>
      </CardContent>
      
      {isEditing && (
        <CardActions sx={{ 
          justifyContent: "flex-end", 
          p: 3,
          bgcolor: alpha(theme.palette.primary.light, 0.05)
        }}>
          <Button 
            variant="outlined" 
            onClick={() => setIsEditing(false)} 
            sx={{ 
              mr: 1, 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
            startIcon={<EditIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setIsEditing(false)
              setSuccessSnackbar(true)
            }}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              boxShadow: 2
            }}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </CardActions>
      )}

      {/* Image Upload Dialog */}
      <Dialog 
        open={openUploadDialog} 
        onClose={() => setOpenUploadDialog(false)}
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>Upload Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
                              style={{ display: 'none' }}
              />
              <Box 
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 2
                }}
              >
                <Box 
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    border: `2px dashed ${theme.palette.primary.main}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    cursor: 'pointer'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadFileIcon 
                    sx={{ 
                      fontSize: 40, 
                      color: theme.palette.primary.main,
                      opacity: 0.7 
                    }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Click to upload your photo or drag and drop
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </Typography>
              </Box>
              
              {uploadProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    display="block" 
                    sx={{ mt: 1, textAlign: 'right' }}
                  >
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenUploadDialog(false)}
              sx={{ borderRadius: 2 }}
            >
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
      
      {/* Success Snackbar */}
      <Snackbar 
        open={successSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {isEditing ? "Profile updated successfully!" : "Profile photo uploaded successfully!"}
        </Alert>
      </Snackbar>
    </Card>
  )
}