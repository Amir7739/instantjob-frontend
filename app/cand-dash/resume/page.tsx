'use client'

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Input,
  Avatar,
  Stack,
  Grid,
  Card,
  CardContent,
  Tooltip,
  alpha,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tabs,
  Tab,
  Fade,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#10b981', // Green
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  overflow: 'visible',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: alpha(theme.palette.primary.main, 0.9),
  fontSize: '2.5rem',
  fontWeight: 'bold',
  boxShadow: theme.shadows[3],
  border: `4px solid ${theme.palette.background.paper}`,
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'visible',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
}));

const HeaderContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
  paddingBottom: `${theme.spacing(3)}px !important`,
  color: '#fff',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

const HeaderInfo = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    marginTop: theme.spacing(2),
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  margin: theme.spacing(0.5),
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: theme.shadows[2],
  zIndex: 2,
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Types
interface Education {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Resume {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  resumeFile?: File | null;
}

// Sample data
const initialResume: Resume = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(123) 456-7890',
  address: '123 Main St, San Francisco, CA',
  education: [
    {
      degree: 'Master of Computer Science',
      institution: 'Stanford University',
      year: '2019-2021',
      description: 'Specialized in Artificial Intelligence and Machine Learning.'
    },
    {
      degree: 'B.Sc. Computer Science',
      institution: 'MIT',
      year: '2015-2019',
      description: 'Graduated with honors. Focus on Software Engineering.'
    },
  ],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Google',
      duration: '2022-Present',
      description: 'Leading a team of 5 engineers developing cloud-based solutions. Implemented microservices architecture that improved system performance by 35%.'
    },
    {
      title: 'Software Engineer',
      company: 'Microsoft',
      duration: '2020-2022',
      description: 'Developed web applications using React and Node.js. Created RESTful APIs and improved test coverage by 40%.'
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'Machine Learning'],
  resumeFile: null,
};

// Form step types
interface FormStep {
  label: string;
  fields: string[];
}

const formSteps: FormStep[] = [
  {
    label: 'Personal Info',
    fields: ['name', 'email', 'phone', 'address'],
  },
  {
    label: 'Education',
    fields: ['education'],
  },
  {
    label: 'Experience',
    fields: ['experience'],
  },
  {
    label: 'Skills & Resume',
    fields: ['skills', 'resumeFile'],
  },
];

// Main Component
const ResumePage: React.FC = () => {
  const muiTheme = useTheme();
  const [resume, setResume] = useState<Resume>(initialResume);
  
  // Form state
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [editResume, setEditResume] = useState<Resume>({...initialResume});
  
  // Loading state for save action
  const [saving, setSaving] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle modal open/close
  const handleOpen = () => {
    setEditResume({...resume});
    setActiveStep(0);
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  // Handle basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditResume(prev => ({ ...prev, [name]: value }));
  };

  // Handle education changes
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...editResume.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEditResume(prev => ({ ...prev, education: updatedEducation }));
  };

  // Add new education
  const handleAddEducation = () => {
    setEditResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '', description: '' },
      ],
    }));
  };

  // Remove education
  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...editResume.education];
    updatedEducation.splice(index, 1);
    setEditResume(prev => ({ ...prev, education: updatedEducation }));
  };

  // Handle experience changes
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...editResume.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setEditResume(prev => ({ ...prev, experience: updatedExperience }));
  };

  // Add new experience
  const handleAddExperience = () => {
    setEditResume(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', duration: '', description: '' },
      ],
    }));
  };

  // Remove experience
  const handleRemoveExperience = (index: number) => {
    const updatedExperience = [...editResume.experience];
    updatedExperience.splice(index, 1);
    setEditResume(prev => ({ ...prev, experience: updatedExperience }));
  };

  // Handle skills input change
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setEditResume(prev => ({ ...prev, skills }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditResume(prev => ({ ...prev, resumeFile: file }));
  };

  // Handle form submission
  const handleSubmit = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setResume(editResume);
      setSaving(false);
      handleClose();
    }, 800);
  };

  // Handle file view/download
  const handleViewFile = () => {
    if (resume.resumeFile) {
      const url = URL.createObjectURL(resume.resumeFile);
      window.open(url, '_blank');
      // Clean up the URL object after use
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  // Step navigation
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const isLastStep = activeStep === formSteps.length - 1;

  // Render form step content
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Info
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="name"
                value={editResume.name}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={editResume.email}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                name="phone"
                value={editResume.phone}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={editResume.address}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      
      case 1: // Education
        return (
          <Box>
            {editResume.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderLeft: `4px solid ${muiTheme.palette.primary.main}`,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Year"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description (optional)"
                        value={edu.description || ''}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  
                  {editResume.education.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveEducation(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddEducation}
              sx={{ mt: 1 }}
            >
              Add Education
            </Button>
          </Box>
        );
      
      case 2: // Experience
        return (
          <Box>
            {editResume.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderLeft: `4px solid ${muiTheme.palette.secondary.main}`,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Job Title"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Company"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Duration"
                        value={exp.duration}
                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        required
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  
                  {editResume.experience.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveExperience(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Paper>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddExperience}
              sx={{ mt: 1 }}
            >
              Add Experience
            </Button>
          </Box>
        );
      
      case 3: // Skills & Resume
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma-separated)"
                value={editResume.skills.join(', ')}
                onChange={handleSkillsChange}
                fullWidth
                helperText="Enter skills separated by commas"
                multiline
                rows={2}
                variant="outlined"
              />
              
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {editResume.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Resume
              </Typography>
              <Box
                sx={{
                  border: `1px dashed ${muiTheme.palette.divider}`,
                  borderRadius: 1,
                  p: 2,
                  bgcolor: alpha(muiTheme.palette.primary.light, 0.05),
                  textAlign: 'center',
                }}
              >
                <Input
                  type="file"
                  inputProps={{ accept: '.pdf,.doc,.docx' }}
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<DescriptionIcon />}
                  >
                    Choose File
                  </Button>
                </label>
                {editResume.resumeFile ? (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Selected: {editResume.resumeFile.name}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Accepted formats: PDF, DOC, DOCX
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledContainer maxWidth="md">
        {/* Header with Avatar and Basic Info */}
        <HeaderCard>
          <EditButton color="primary" onClick={handleOpen}>
            <EditIcon />
          </EditButton>
          
          <HeaderContent>
            <ProfileAvatar>{getInitials(resume.name)}</ProfileAvatar>
            
            <HeaderInfo>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                {resume.name}
              </Typography>
              
              <Box>
                <ContactItem>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body1">{resume.email}</Typography>
                </ContactItem>
                
                <ContactItem>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="body1">{resume.phone}</Typography>
                </ContactItem>
                
                <ContactItem>
                  <LocationIcon fontSize="small" />
                  <Typography variant="body1">{resume.address}</Typography>
                </ContactItem>
              </Box>
            </HeaderInfo>
          </HeaderContent>
        </HeaderCard>

        {/* Education Section */}
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <SchoolIcon fontSize="medium" />
              <Typography variant="h6">Education</Typography>
            </SectionHeader>
            
            <List>
              {resume.education.map((edu, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="500">
                          {edu.degree}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="text.primary">
                            {edu.institution}
                          </Typography>
                          <Typography variant="body2" component="span" color="text.secondary" sx={{ ml: 1 }}>
                            • {edu.year}
                          </Typography>
                          {edu.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {edu.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < resume.education.length - 1 && (
                    <Divider component="li" sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </SectionCard>

        {/* Experience Section */}
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <WorkIcon fontSize="medium" />
              <Typography variant="h6">Work Experience</Typography>
            </SectionHeader>
            
            <List>
              {resume.experience.map((exp, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="500">
                            {exp.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.duration}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span" color="text.primary" fontWeight="500">
                            {exp.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {exp.description}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < resume.experience.length - 1 && (
                    <Divider component="li" sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </SectionCard>

        {/* Skills Section */}
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <CodeIcon fontSize="medium" />
              <Typography variant="h6">Skills</Typography>
            </SectionHeader>
            
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
              {resume.skills.map((skill, index) => (
                <StyledChip 
                  key={index} 
                  label={skill} 
                  color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "default"} 
                  variant={index % 2 === 0 ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </CardContent>
        </SectionCard>

        {/* Resume File Section */}
        <SectionCard>
          <CardContent>
            <SectionHeader>
              <DescriptionIcon fontSize="medium" />
              <Typography variant="h6">Resume File</Typography>
            </SectionHeader>
            
            {resume.resumeFile ? (
              <Box 
                display="flex" 
                alignItems="center" 
                gap={2} 
                p={2} 
                bgcolor={alpha(theme.palette.primary.light, 0.1)}
                borderRadius={1}
              >
                <DescriptionIcon color="primary" />
                <Typography sx={{ flexGrow: 1 }}>{resume.resumeFile.name}</Typography>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={handleViewFile}
                  size="small"
                >
                  View
                </Button>
              </Box>
            ) : (
              <Box 
                p={2} 
                bgcolor={alpha(theme.palette.grey[200], 0.5)}
                borderRadius={1}
                textAlign="center"
              >
                <Typography color="textSecondary">No resume uploaded</Typography>
              </Box>
            )}
          </CardContent>
        </SectionCard>

        {/* Edit Resume Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">Edit Resume</Typography>
          </DialogTitle>
          
          <DialogContent dividers>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {formSteps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {renderStepContent(activeStep)}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={saving}
            >
              Cancel
            </Button>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                disabled={saving}
              >
                Back
              </Button>
            )}
            
            {!isLastStep ? (
              <Button 
                onClick={handleNext}
                variant="contained"
                color="primary"
                disabled={saving}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Resume'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default ResumePage;