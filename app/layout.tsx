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
              
            >
              <Box
                component="main"
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
