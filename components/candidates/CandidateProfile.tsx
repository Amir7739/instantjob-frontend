import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';

import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
  } from '@mui/lab';
  
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CreditCard as SalaryIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  LocationCity as CityIcon,
  Public as StateIcon,
  PinDrop as PincodeIcon,
  Wc as GenderIcon,
  Description as ResumeIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { fetchCandidateById } from '@/services/candidates';

interface Education {
  degree: string;
  stream: string;
  institute: string;
  passingYear: number;
  score: string;
  _id: string;
}

interface Experience {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  _id: string;
}

interface Candidate {
  id?: string;
  _id?: string;
  full_name: string;
  phone: string;
  email: string;
  resumeUrl?: string;
  totalExperience?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dob?: string;
  gender?: string;
  expectedSalary?: string;
  skills?: string[];
  preferredJobType?: string;
  preferredLocation?: string;
  noticePeriod?: string;
  education?: Education[];
  experience?: Experience[];
  createdAt: string;
  updatedAt: string;
  status?: string;
}

const CandidateGetProfile: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidate = async () => {
      setLoading(true);
      setError(null);
      try {
        const candidateId = params.id as string;
        const response = await fetchCandidateById(candidateId);
        setCandidate(response);
      } catch (err) {
        setError('Failed to fetch candidate details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCandidate();
    }
  }, [params.id]);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Calculate age from DOB
  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">Loading candidate profile...</Typography>
      </Box>
    );
  }

  if (error || !candidate) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: isMobile ? 2 : 4 }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ 
            borderRadius: 2, 
            fontSize: '1rem',
            '& .MuiAlert-icon': { fontSize: '2rem' }
          }}
        >
          {error || 'Candidate not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin-dashboard')}
          sx={{ mt: 3 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: isMobile ? 2 : 4,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
        minHeight: '100vh'
      }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/admin-dashboard')}
        sx={{ 
          mb: 3,
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4
          }
        }}
      >
        Back to Dashboard
      </Button>

      {/* Header Card */}
      <Card 
        elevation={3} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative',
          boxShadow: theme.shadows[6],
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <CardContent sx={{ p: isMobile ? 3 : 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={2} md={1.5}>
              <Avatar 
                sx={{ 
                  width: isMobile ? 80 : 100, 
                  height: isMobile ? 80 : 100,
                  bgcolor: theme.palette.secondary.main,
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  boxShadow: 4
                }}
              >
                {getInitials(candidate.full_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" gutterBottom>
                {candidate.full_name}
              </Typography>
              <Stack direction={isMedium ? 'column' : 'row'} spacing={isMedium ? 1 : 3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body1">{candidate.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body1">{candidate.phone}</Typography>
                </Box>
                {candidate.totalExperience && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    <Typography variant="body1">{candidate.totalExperience}</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={2} md={1.5} sx={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
              {candidate.status && (
                <Chip
                  label={candidate.status}
                  color={candidate.status.toLowerCase() === 'active' ? 'success' : 'error'}
                  sx={{ 
                    fontWeight: 'bold',
                    px: 1,
                    boxShadow: 2
                  }}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          {/* Personal Information Card */}
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                pb: 1, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center'
              }}>
                <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Personal Information
              </Typography>
              
              <List disablePadding>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location" 
                    secondary={`${candidate.city || 'N/A'}, ${candidate.state || 'N/A'} ${candidate.pincode || ''}`} 
                  />
                </ListItem>
                
                {candidate.dob && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date of Birth" 
                      secondary={`${formatDate(candidate.dob)} (${calculateAge(candidate.dob)} years)`} 
                    />
                  </ListItem>
                )}
                
                {candidate.gender && (
                  <ListItem>
                    <ListItemIcon>
                      <GenderIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Gender" 
                      secondary={candidate.gender.charAt(0).toUpperCase() + candidate.gender.slice(1)} 
                    />
                  </ListItem>
                )}
              </List>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                pb: 1, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                mt: 3,
                display: 'flex',
                alignItems: 'center'
              }}>
                <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Job Preferences
              </Typography>
              
              <List disablePadding>
                {candidate.expectedSalary && (
                  <ListItem>
                    <ListItemIcon>
                      <SalaryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Expected Salary" secondary={candidate.expectedSalary} />
                  </ListItem>
                )}
                
                {candidate.preferredJobType && (
                  <ListItem>
                    <ListItemIcon>
                      <WorkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Preferred Job Type" secondary={candidate.preferredJobType} />
                  </ListItem>
                )}
                
                {candidate.preferredLocation && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Preferred Location" secondary={candidate.preferredLocation} />
                  </ListItem>
                )}
                
                {candidate.noticePeriod && (
                  <ListItem>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Notice Period" secondary={candidate.noticePeriod} />
                  </ListItem>
                )}
              </List>
              
              {/* Resume Button */}
              {candidate.resumeUrl && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    startIcon={<ResumeIcon />}
                    endIcon={<DownloadIcon />}
                    size="large"
                    sx={{ 
                      py: 1,
                      boxShadow: 3,
                      '&:hover': {
                        boxShadow: 5
                      }
                    }}
                  >
                    View Resume
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          {/* Skills Card */}
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                pb: 1, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center'
              }}>
                <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Skills
              </Typography>

              <Box sx={{ mt: 2 }}>
                {candidate.skills && candidate.skills.length > 0 ? (
                  candidate.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{ 
                        mr: 1, 
                        mb: 1, 
                        py: 2.5,
                        backgroundColor: theme.palette.primary.light, 
                        color: 'white',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          boxShadow: 2
                        }
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills listed
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Experience Timeline Card */}
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                pb: 1, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center'
              }}>
                <WorkIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Work Experience
              </Typography>

              {candidate.experience && candidate.experience.length > 0 ? (
                <Timeline position="alternate" sx={{ mt: 2 }}>
                  {candidate.experience.map((exp, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate || '')}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                        <TimelineDot color="primary" variant="outlined">
                          <WorkIcon />
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span" fontWeight="bold">
                          {exp.jobTitle}
                        </Typography>
                        <Typography color="primary" fontWeight="medium">{exp.companyName}</Typography>
                        <Typography>{exp.description}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No work experience listed
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Education Timeline Card */}
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                pb: 1, 
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                display: 'flex',
                alignItems: 'center'
              }}>
                <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                Education
              </Typography>

              {candidate.education && candidate.education.length > 0 ? (
                <Timeline position="alternate" sx={{ mt: 2 }}>
                  {candidate.education.map((edu, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                        <Typography variant="body2" color="text.secondary">
                          {edu.passingYear}
                        </Typography>
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                        <TimelineDot color="primary" variant="outlined">
                          <SchoolIcon />
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span" fontWeight="bold">
                          {edu.degree} in {edu.stream}
                        </Typography>
                        <Typography color="primary" fontWeight="medium">{edu.institute}</Typography>
                        <Typography>{edu.score}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No education details listed
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card elevation={1} sx={{ borderRadius: 2, mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <strong>Created:</strong> {formatDate(candidate.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <CalendarIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'text-bottom' }} />
                    <strong>Updated:</strong> {formatDate(candidate.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CandidateGetProfile;