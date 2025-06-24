'use client';

import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import theme from '../styles/theme';
import Footer from '../components/Footer';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const hideFooterRoutes = ['/employer-dash', '/admin-dashboard']; // add more if needed

  const shouldShowFooter = !hideFooterRoutes.includes(pathname);

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
                }}
              >
                {children}
              </Box>
              {shouldShowFooter && (
                <Box
                  component="footer"
                  sx={{

                    // Above all other elements
                    // position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  <Footer />
                </Box>
              )}
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}