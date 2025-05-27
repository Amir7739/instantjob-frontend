'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { loginRecruiter } from '@/services/recruiter';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const data = await loginRecruiter(formData);
      localStorage.setItem('id', data.recruiter.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'recruiter');
      router.push('/recruiter/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recruiter Login
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          required
          margin="normal"
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          required
          margin="normal"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Container>
  );
}
