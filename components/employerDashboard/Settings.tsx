import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business as BusinessIcon,
  PhotoCamera,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Employer, fetchEmployerById, updateEmployer, updateEmployerPassword } from '@/services/eployersApi';
import CustomSnackbar from '@/components/CustomSnackbar'; // Adjust path based on your project structure

const Settings: React.FC = () => {
  const [employerData, setEmployerData] = useState<Employer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerId = localStorage.getItem('id');
        if (!employerId) {
          setSnackbar({
            open: true,
            message: 'No employer ID found',
            severity: 'error',
          });
          return;
        }

        const employer = await fetchEmployerById(employerId);
        setEmployerData(employer);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || 'Error fetching employer data',
          severity: 'error',
        });
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof Employer, value: string) => {
    setEmployerData(prev => prev ? ({ ...prev, [field]: value }) : prev);
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);
      // Preview the logo
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && employerData) {
          setEmployerData({ ...employerData, companyLogo: e.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const employerId = localStorage.getItem('id');
      if (!employerId || !employerData) {
        setSnackbar({
          open: true,
          message: 'No employer ID or data found',
          severity: 'error',
        });
        return;
      }

      // Prepare data for update
      const updateData: Partial<Employer> = {
        name: employerData.name,
        email: employerData.email,
        companyName: employerData.companyName,
        website: employerData.website,
        industry: employerData.industry,
        location: employerData.location,
        contactNumber: employerData.contactNumber,
        companySize: employerData.companySize,
        bio: employerData.bio,
      };

      // Handle logo upload if a new file is selected
      if (logoFile) {
        // For now, we'll set a placeholder URL. You'll need to implement actual file upload logic on the backend
        updateData.companyLogo = employerData.companyLogo; // Replace with actual upload logic
      }

      const updatedEmployer = await updateEmployer(employerId, updateData);
      setEmployerData(updatedEmployer);
      setIsEditing(false);
      setLogoFile(null);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Error updating employer data',
        severity: 'error',
      });
      console.error(err);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: 'New passwords do not match',
        severity: 'error',
      });
      return;
    }

    try {
      const employerId = localStorage.getItem('id');
      if (!employerId) {
        setSnackbar({
          open: true,
          message: 'No employer ID found',
          severity: 'error',
        });
        return;
      }

      await updateEmployerPassword(employerId, currentPassword, newPassword);
      setPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSnackbar({
        open: true,
        message: 'Password updated successfully!',
        severity: 'success',
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Error updating employer password',
        severity: 'error',
      });
      console.error(err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const industries = [
    'Software Development', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Non-profit', 'Other'
  ];

  const companySizes = [
    '1-10', '11-50', '51-200',
    '201-500', '501-1000', '1000+'
  ];

  if (!employerData) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
        <Typography>Loading...</Typography>
        <CustomSnackbar
          open={snackbar.open}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <CustomSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 4 }}>
        Company Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
            Company Profile
          </Typography>
          <Button
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            variant={isEditing ? "contained" : "outlined"}
            onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            sx={{
              color: isEditing ? 'white' : '#4F46E5',
              bgcolor: isEditing ? '#4F46E5' : 'transparent',
              borderColor: '#4F46E5',
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#4338CA',
                bgcolor: isEditing ? '#4338CA' : 'rgba(79, 70, 229, 0.04)'
              }
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={employerData.companyLogo}
            sx={{ 
              width: 100, 
              height: 100, 
              border: '3px solid #E5E7EB',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <BusinessIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Company Logo
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              disabled={!isEditing}
              component="label"
              sx={{
                color: '#4F46E5',
                borderColor: '#4F46E5',
                '&:hover': { borderColor: '#4338CA', color: '#4338CA' },
                '&:disabled': { 
                  borderColor: '#D1D5DB', 
                  color: '#9CA3AF' 
                }
              }}
            >
              Upload New Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Company Name"
              value={employerData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Contact Name"
              value={employerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={employerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              value={employerData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Website"
              value={employerData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company Description"
              value={employerData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              multiline
              rows={4}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl 
              fullWidth 
              disabled={!isEditing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            >
              <InputLabel>Industry</InputLabel>
              <Select
                value={employerData.industry}
                label="Industry"
                onChange={(e) => handleInputChange('industry', e.target.value)}
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl 
              fullWidth 
              disabled={!isEditing}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            >
              <InputLabel>Company Size</InputLabel>
              <Select
                value={employerData.companySize}
                label="Company Size"
                onChange={(e) => handleInputChange('companySize', e.target.value)}
              >
                {companySizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              value={employerData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
              Security Settings
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Manage your account security and password
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setPasswordDialog(true)}
            sx={{
              color: '#4F46E5',
              borderColor: '#4F46E5',
              px: 3,
              py: 1,
              '&:hover': { 
                borderColor: '#4338CA', 
                color: '#4338CA',
                bgcolor: 'rgba(79, 70, 229, 0.04)'
              }
            }}
          >
            Change Password
          </Button>
        </Box>

        {isEditing && (
          <Box sx={{ display: 'flex', gap: 2, mt: 4, pt: 3, borderTop: '1px solid #E5E7EB' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => {
                setIsEditing(false);
                setLogoFile(null);
                // Reset to original data if needed
                fetchEmployerById(localStorage.getItem('id')!).then(setEmployerData).catch((err) => {
                  setSnackbar({
                    open: true,
                    message: err.message || 'Error fetching employer data',
                    severity: 'error',
                  });
                });
              }}
              sx={{ 
                color: '#6B7280', 
                borderColor: '#6B7280',
                '&:hover': {
                  borderColor: '#4B5563',
                  color: '#4B5563'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Paper>

      <Dialog 
        open={passwordDialog} 
        onClose={() => setPasswordDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#4F46E5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4F46E5',
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => {
              setPasswordDialog(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            }}
            sx={{ color: '#6B7280' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordUpdate}
            sx={{ 
              bgcolor: '#4F46E5', 
              '&:hover': { bgcolor: '#4338CA' },
              px: 3
            }}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;