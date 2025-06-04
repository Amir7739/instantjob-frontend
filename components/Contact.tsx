import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Avatar, Divider, Snackbar, Alert, LinearProgress, Chip, styled } from '@mui/material';
import { Email, Phone, LocationOn, Work, Send, Help, Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Custom theme for job portal branding
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Vibrant blue for job portal
    secondary: { main: '#ff4081' }, // Accent for urgency
    background: { default: '#f5f7fa' },
  },
  typography: {
    h3: { fontWeight: 700, letterSpacing: '0.5px' },
    h6: { fontWeight: 600, color: '#1976d2' },
    body1: { color: '#555' },
  },
});

// Styled components for enhanced design
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
  '&:hover': { background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)' },
}));

const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: theme.spacing(1, 2),
  minWidth: '48px',
  color: '#fff',
  '&:hover': { opacity: 0.9 },
}));

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for form submission
    setTimeout(() => {
      setLoading(false);
      setSnackbar({ open: true, message: 'Your query has been sent! We’ll respond within 24 hours.', severity: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Grid container justifyContent="center" sx={{ px: 2 }}>
            <Grid item xs={12} md={8} lg={6}>
              <StyledPaper elevation={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                    <Work fontSize="large" />
                  </Avatar>
                  <Typography variant="h3" color="primary">
                    Contact Instant Job Portal
                  </Typography>
                </Box>
                <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                  Got a question? Need help with your job search or posting? Reach out to us instantly!
                </Typography>

                <Divider sx={{ mb: 4 }}>
                  <Chip label="Get in Touch" color="primary" icon={<Send />} />
                </Divider>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: '12px' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledButton
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<Send />}
                        fullWidth
                      >
                        {loading ? 'Sending...' : 'Submit Query'}
                      </StyledButton>
                      {loading && <LinearProgress sx={{ mt: 2, borderRadius: '8px' }} />}
                    </Grid>
                  </Grid>
                </form>

                <Divider sx={{ my: 4 }}>
                  <Chip label="Company Addresses" color="secondary" />
                </Divider>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Typography variant="h6">Headquarters</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOn color="primary" sx={{ mr: 2 }} />
                        <Typography variant="body1">123 Job St, Career City, CA 90001, USA</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Typography variant="h6">Regional Office</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOn color="primary" sx={{ mr: 2 }} />
                        <Typography variant="body1">456 Work Ave, Opportunity Town, NY 10001, USA</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }}>
                  <Chip label="Quick Help" color="primary" icon={<Help />} />
                </Divider>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Typography variant="h6">Live Chat</Typography>
                      <Typography variant="body1">Chat with our team 24/7 for instant support.</Typography>
                      <StyledButton variant="contained" sx={{ mt: 2 }}>Start Chat</StyledButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Typography variant="h6">FAQ</Typography>
                      <Typography variant="body1">Find answers to common job portal questions.</Typography>
                      <StyledButton variant="contained" sx={{ mt: 2 }}>Visit FAQ</StyledButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Typography variant="h6">Support Ticket</Typography>
                      <Typography variant="body1">Submit a ticket for personalized help.</Typography>
                      <StyledButton variant="contained" sx={{ mt: 2 }}>Create Ticket</StyledButton>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }}>
                  <Chip label="Follow Us" color="secondary" />
                </Divider>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <SocialButton
                      sx={{ bgcolor: '#3b5998' }}
                      href="https://facebook.com/instantjobportal"
                      target="_blank"
                    >
                      <Facebook />
                    </SocialButton>
                  </Grid>
                  <Grid item>
                    <SocialButton
                      sx={{ bgcolor: '#1da1f2' }}
                      href="https://twitter.com/instantjobportal"
                      target="_blank"
                    >
                      <Twitter />
                    </SocialButton>
                  </Grid>
                  <Grid item>
                    <SocialButton
                      sx={{ bgcolor: '#0077b5' }}
                      href="https://linkedin.com/company/instantjobportal"
                      target="_blank"
                    >
                      <LinkedIn />
                    </SocialButton>
                  </Grid>
                  <Grid item>
                    <SocialButton
                      sx={{ bgcolor: '#e1306c' }}
                      href="https://instagram.com/instantjobportal"
                      target="_blank"
                    >
                      <Instagram />
                    </SocialButton>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }}>
                  <Chip label="Other Ways to Reach Us" color="primary" />
                </Divider>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Email color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">support@instantjobportal.com</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <Phone color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">+1 (800) 555-JOBS</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
                      <LocationOn color="primary" sx={{ mr: 2 }} />
                      <Typography variant="body1">123 Job St, Career City, USA</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>
          </Grid>
        </motion.div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ContactUs;