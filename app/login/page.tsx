"use client";

import React, { useState } from "react";
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

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/emp-dashboard"; // Get redirect URL from query params or default to home

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
          }, 1500);
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
                  formik.touched.emailOrPhone && Boolean(formik.errors.emailOrPhone)
                }
                helperText={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
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
                error={formik.touched.password && Boolean(formik.errors.password)}
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
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                Forgot password?
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
                disabled={isMutating}
              >
                {isMutating ? (
                  <CircularProgress size={24} color="inherit" />
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
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
