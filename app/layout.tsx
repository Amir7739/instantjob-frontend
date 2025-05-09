'use client';

import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '../styles/theme';
import Footer from '../components/Footer';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                position: 'relative',
              }}
            >
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  overflow: 'hidden', // Prevent outer scrolling
                  paddingBottom: '64px', // Reserve space for fixed footer
                }}
              >
                {children}
              </Box>
              <Box
                component="footer"
                sx={{
                  
                  zIndex: 1300, // Above all other elements
                  // position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              >
                <Footer />
              </Box>
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}