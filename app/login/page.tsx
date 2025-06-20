"use client";

import React, { Suspense, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLogin } from "@/hooks/useLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";

const validationSchema = Yup.object({
  emailOrPhone: Yup.string().required("Email or Phone is required"),
  password: Yup.string()
    .min(8, "Password should be of minimum 8 characters")
    .required("Password is required"),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { trigger: login, isMutating } = useLogin();

  // Wrap useSearchParams() inside Suspense for client-side rendering (CSR)
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/cand-dash"; // Get redirect URL from query params or default to home

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setErrorMessage(null);
      try {
        const res = await login(values);
        const role = res.user.role;
        const id = res.user?.id;
        if (res && res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("role", role);
          localStorage.setItem("id", id);
          dispatch(setAuth(res));
          setOpenSnackbar(true);

          setTimeout(() => {
            if (role === "admin") {
              router.push("/admin-dashboard");
            } else if (role === "candidate") {
              router.push(redirectUrl);
            } else {
              router.push("/");
            }
          }, 500);
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || "Invalid credentials");
      }
    },
  });

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: "4rem",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "50%",
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>

            <Typography component="h1" variant="h5" fontWeight="bold" mb={3}>
              Sign In
            </Typography>

            {/* Success Message */}
            {openSnackbar && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                Login successful!
              </Alert>
            )}

            {/* Error Message */}
            {errorMessage && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                fullWidth
                id="emailOrPhone"
                name="emailOrPhone"
                label="Email or Phone"
                value={formik.values.emailOrPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.emailOrPhone &&
                  Boolean(formik.errors.emailOrPhone)
                }
                helperText={
                  formik.touched.emailOrPhone && formik.errors.emailOrPhone
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

<Typography
  variant="body2"
  align="right"
  sx={{
    mt: 1,
    color: "primary.main",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  }}
>
  <Link href="/forgot-password">Forgot password?</Link>
</Typography>

              {/* Enhanced Sign In Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #cccccc 0%, #999999 100%)",
                    transform: "none",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  },
                }}
                disabled={isMutating}
              >
                {isMutating ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Signing In...</span>
                  </Box>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link href="/register" passHref>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        "&:hover": {
                          cursor: "pointer",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign Up
                    </Typography>
                  </Link>
                </Typography>

                {/* Enhanced Google Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  href="http://localhost:5000/api/auth/google"
                  sx={{
                    mt: 2,
                    py: 1.8,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#4285f4",
                    borderColor: "#dadce0",
                    borderWidth: "2px",
                    background: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "#f8f9fa",
                      borderColor: "#4285f4",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 16px rgba(66, 133, 244, 0.2)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    },
                  }}
                  startIcon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        background: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M20 10.227c0-.709-.064-1.39-.182-2.045H10.2v3.868h5.513a4.707 4.707 0 01-2.04 3.088v2.555h3.302c1.932-1.778 3.025-4.39 3.025-7.466z' fill='%234285F4'/%3E%3Cpath d='M10.2 20c2.76 0 5.077-.914 6.769-2.477l-3.302-2.555c-.914.614-2.083.978-3.467.978-2.668 0-4.926-1.8-5.732-4.22H1.137v2.636C2.818 17.195 6.226 20 10.2 20z' fill='%2334A853'/%3E%3Cpath d='M4.468 11.726a5.827 5.827 0 010-3.732V5.358H1.137A9.73 9.73 0 000 10.1c0 1.587.386 3.088 1.137 4.421l3.331-2.795z' fill='%23FBBC05'/%3E%3Cpath d='M10.2 4.774c1.506 0 2.855.518 3.916 1.54l2.931-2.93C15.273 1.64 13.013.727 10.2.727c-3.974 0-7.382 2.386-9.063 5.858l3.331 2.795c.806-2.42 3.064-4.606 5.732-4.606z' fill='%23EA4335'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  }
                >
                  Continue with Google
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

// Wrap the component in Suspense for client-side rendering (CSR) support
export default function LoginWithSuspense() {
  return (
    <Suspense fallback={<CircularProgress size={24} />}>
      <LoginPage />
    </Suspense>
  );
}