'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Paper,
  Container,
  Fade,
  Avatar
} from '@mui/material';
import { CheckCircle, Google } from '@mui/icons-material';

const GoogleSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const id = searchParams.get('id');

    if (token) {
      localStorage.setItem('token', token);
    }

    if (role) {
      localStorage.setItem('role', role);
    }

    if (id) {
      localStorage.setItem('id', id);
    }

    // 👇 Role-based redirect
    if (role === 'admin') {
      router.push('/admin-dashboard');
    } else if (role === 'candidate') {
      router.push('/cand-dash');
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
              },
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 0.5,
                },
                '50%': {
                  opacity: 1,
                },
              },
            }}
          >
            {/* Google Icon with Success Checkmark */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  mx: 'auto',
                }}
              >
                <Google sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
              <CheckCircle
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  fontSize: 32,
                  color: '#4caf50',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  animation: 'checkmark 0.6s ease-in-out 0.5s both',
                  transform: 'scale(0)',
                  '@keyframes checkmark': {
                    'to': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            </Box>

            {/* Success Message */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Authentication Successful!
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: '1.1rem',
              }}
            >
              Logging you in with Google...
            </Typography>

            {/* Loading Animation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                size={32}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Redirecting you to your dashboard...
              </Typography>
            </Box>

            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0px) rotate(0deg)',
                  },
                  '50%': {
                    transform: 'translateY(-10px) rotate(180deg)',
                  },
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                animation: 'float 3s ease-in-out infinite 1s',
              }}
            />
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
};

export default GoogleSuccess;