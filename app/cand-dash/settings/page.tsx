'use client'

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  useTheme,
  Stack,
  Fade,
  alpha,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { fetchCandidateById } from '@/services/candidates';
import { useRouter } from 'next/navigation';
import { updateCandidatePassword } from '@/services/candidateDashobardApi';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const SettingsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.16)',
    transform: 'translateY(-4px)',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 'auto',
    padding: theme.spacing(2),
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    transition: 'all 0.2s',
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
}));

const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  boxShadow: theme.shadows[3],
  border: `4px solid ${theme.palette.background.paper}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.2s',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 2,
      },
    },
  },
}));

const CheckboxLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontWeight: 500,
  },
  marginLeft: 0,
  marginRight: 0,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

// Types for settings data
interface Settings {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  password: {
    newPassword: string;
    confirmPassword: string;
  };
  notifications: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityStatus: boolean;
    searchable: boolean;
  };
}

// Tab panel component with fade animation
interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ minHeight: '400px' }}>
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <TabContent>{children}</TabContent>
        </Fade>
      )}
    </div>
  );
};

// Main component
const SettingsPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    profile: {
      name: '',
      email: '',
      phone: '',
      avatar: '',
    },
    password: {
      newPassword: '',
      confirmPassword: '',
    },
    notifications: {
      emailNotifications: true,
      inAppNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
      searchable: true,
    },
  });
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Check role and redirect if not candidate
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'candidate') {
      router.push('/unauthorized'); // Redirect to an unauthorized page
    }
  }, [router]);

  // Fetch candidate data on mount
  useEffect(() => {
    const candidateId = localStorage.getItem('id');
    if (candidateId) {
      fetchCandidateById(candidateId)
        .then((data) => {
          setSettings((prev) => ({
            ...prev,
            profile: {
              name: data.full_name || '',
              email: data.email || '',
              phone: data.phone || '',
              avatar: data.profileImage || '/placeholder-user.jpg',
            },
          }));
        })
        .catch((err) => {
          setProfileError(err.message || 'Failed to fetch candidate details');
        });
    } else {
      setProfileError('No candidate ID found in localStorage');
    }
  }, []);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      password: { ...prev.password, [name]: value },
    }));
  };

  // Handle notification checkbox changes
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [name]: checked },
    }));
  };

  // Handle privacy changes
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (name === 'profileVisibility') {
      setSettings((prev) => ({
        ...prev,
        privacy: { ...prev.privacy, profileVisibility: value as 'public' | 'private' | 'friends' },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        privacy: { ...prev.privacy, [name]: (e as React.ChangeEvent<HTMLInputElement>).target.checked },
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle password update
  const handleSavePassword = async () => {
    try {
      setPasswordError(null);
      const candidateId = localStorage.getItem('id');
      if (!candidateId) {
        throw new Error('No candidate ID found in localStorage');
      }
      await updateCandidatePassword(candidateId, {
        newPassword: settings.password.newPassword,
        confirmNewPassword: settings.password.confirmPassword,
      });
      setSettings((prev) => ({
        ...prev,
        password: { newPassword: '', confirmPassword: '' },
      }));
      setPasswordSuccess('Password updated successfully!');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <PageHeader>
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: '50%',
            padding: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PersonIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        </Box>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Account Settings
        </Typography>
      </PageHeader>

      <SettingsCard>
        <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs" variant="fullWidth">
          <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
          <Tab icon={<LockIcon />} label="Password" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<PrivacyTipIcon />} label="Privacy" iconPosition="start" />
        </StyledTabs>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          {profileError && (
            <Fade in={!!profileError}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {profileError}
              </Alert>
            </Fade>
          )}
          <ProfileHeader>
            <StyledAvatar src={settings.profile.avatar} alt={settings.profile.name} />
            <Typography variant="h6" fontWeight="bold">
              {settings.profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {settings.profile.email}
            </Typography>
          </ProfileHeader>

          <SectionTitle variant="h6">Personal Information</SectionTitle>
          <StyledTextField
            label="Full Name"
            name="name"
            value={settings.profile.name}
            fullWidth
            disabled
            variant="outlined"
          />
          <StyledTextField
            label="Email Address"
            name="email"
            type="email"
            value={settings.profile.email}
            fullWidth
            disabled
            variant="outlined"
          />
          <StyledTextField
            label="Phone Number"
            name="phone"
            value={settings.profile.phone}
            fullWidth
            disabled
            variant="outlined"
          />
        </TabPanel>

        {/* Password Tab */}
        <TabPanel value={tabValue} index={1}>
          <SectionTitle variant="h6">Change Password</SectionTitle>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your new password and confirm it to update your account.
            </Typography>
          </Box>
          <StyledTextField
            label="New Password"
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={settings.password.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => togglePasswordVisibility('new')}>
                  {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <StyledTextField
            label="Confirm New Password"
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={settings.password.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                  {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            error={
              settings.password.newPassword !== settings.password.confirmPassword &&
              settings.password.confirmPassword !== ''
            }
            helperText={
              settings.password.newPassword !== settings.password.confirmPassword &&
              settings.password.confirmPassword !== ''
                ? "Passwords don't match"
                : ""
            }
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePassword}
              disabled={
                !settings.password.newPassword ||
                settings.password.newPassword !== settings.password.confirmPassword
              }
            >
              Save Password
            </Button>
          </Box>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <SectionTitle variant="h6">Notification Preferences</SectionTitle>
          <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Email Notifications
              </Typography>
              <Stack spacing={1}>
                <CheckboxLabel
                  control={
                    <Checkbox
                      name="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  }
                  label="Receive email notifications"
                />
                <CheckboxLabel
                  control={
                    <Checkbox
                      name="securityAlerts"
                      checked={settings.notifications.securityAlerts}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  }
                  label="Security alerts and warnings"
                />
                <CheckboxLabel
                  control={
                    <Checkbox
                      name="marketingEmails"
                      checked={settings.notifications.marketingEmails}
                      onChange={handleNotificationChange}
                      color="primary"
                    />
                  }
                  label="Marketing and promotional emails"
                />
              </Stack>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                In-App Notifications
              </Typography>
              <CheckboxLabel
                control={
                  <Checkbox
                    name="inAppNotifications"
                    checked={settings.notifications.inAppNotifications}
                    onChange={handleNotificationChange}
                    color="primary"
                  />
                }
                label="Receive in-app notifications"
              />
            </CardContent>
          </Card>
        </TabPanel>

        {/* Privacy Tab */}
        <TabPanel value={tabValue} index={3}>
          <SectionTitle variant="h6">Privacy Settings</SectionTitle>
          <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Profile Visibility
              </Typography>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Who can see your profile</InputLabel>
                <Select
                  name="profileVisibility"
                  value={settings.privacy.profileVisibility}
                  onChange={handlePrivacyChange}
                  label="Who can see your profile"
                >
                  <MenuItem value="public">Everyone (Public)</MenuItem>
                  <MenuItem value="friends">Friends Only</MenuItem>
                  <MenuItem value="private">Only Me (Private)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Additional Privacy Options
              </Typography>
              <Stack spacing={1}>
                <CheckboxLabel
                  control={
                    <Checkbox
                      name="activityStatus"
                      checked={settings.privacy.activityStatus}
                      onChange={handlePrivacyChange}
                      color="primary"
                    />
                  }
                  label="Show activity status"
                />
                <CheckboxLabel
                  control={
                    <Checkbox
                      name="searchable"
                      checked={settings.privacy.searchable}
                      onChange={handlePrivacyChange}
                      color="primary"
                    />
                  }
                  label="Allow others to find you in search"
                />
              </Stack>
            </CardContent>
          </Card>
        </TabPanel>
      </SettingsCard>

      <Snackbar
        open={!!passwordSuccess}
        autoHideDuration={4000}
        onClose={() => setPasswordSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setPasswordSuccess(null)}>
          {passwordSuccess}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!passwordError}
        autoHideDuration={4000}
        onClose={() => setPasswordError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setPasswordError(null)}>
          {passwordError}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default SettingsPage;