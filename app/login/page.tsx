"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
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
  Grid,
  Divider,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Google as GoogleIcon,
  CheckCircle as CheckCircleIcon,
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
  const redirectUrl = searchParams.get("redirect") || "/cand-dash";

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
      <Box
        sx={{
          minHeight: "100vh",
          py: 12,
        }}
      >
        <Container component="main" maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: "calc(100vh - 120px)"}}>
            {/* Left Side - Illustration and Benefits */}
            <Grid item xs={12} md={6} >
              <Box sx={{ textAlign: "center", mb: 4 , width:{xs:400,sm:550 , md:"auto" ,  '@media (max-width: 428px)': {width: 350, },
                    '@media (max-width: 378px)': {maxWidth: 310, },}}}>
                {/* Illustration */}
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: {xs:400 , sm:550},
                    '@media (max-width: 428px)': {maxWidth: 350, },
                    '@media (max-width: 378px)': {maxWidth: 310, },
                    height: 300,
                    mx: "auto",
                    mb: 4,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    },
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: 250,
                      height: 200,
                      fontSize: 120, color: "white", zIndex: 1,
                    }}
                  >
                    <Image
                      src="/images/Registration (2).png"
                      alt="Logo"
                      width={250}
                      height={300}
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                  {/* Decorative circles */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.2)",
                      animation: "float 3s ease-in-out infinite",
                      "@keyframes float": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-10px)" },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 30,
                      left: 30,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.15)",
                      animation: "float 3s ease-in-out infinite 1s",
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    mb: 2,
                  }}
                >
                  Welcome Back!
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Sign in to continue your journey
                </Typography>

                {/* Benefits */}
                <Box sx={{ textAlign: "center", maxWidth: 300, mx: "auto"}}>
                  {[
                    "Access your personalized dashboard",
                    "Apply to thousands of jobs instantly",
                    "Track your application status",
                    "Connect with top employers",
                  ].map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        opacity: 0,
                        animation: `slideIn 0.6s ease-out ${index * 0.1}s forwards`,
                        "@keyframes slideIn": {
                          from: { opacity: 0, transform: "translateX(-20px)" },
                          to: { opacity: 1, transform: "translateX(0)" },
                        },
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: "#4caf50",
                          mr: 2,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6} >
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: 4,
                  maxWidth: { xs: "100%", md: 450 },
                  mx: "auto",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    component="h1"
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                      mb: 1,
                    }}
                  >
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {/* Success Message */}
                {openSnackbar && (
                  <Alert
                    severity="success"
                    sx={{
                      width: "100%",
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        fontSize: 20,
                      },
                    }}
                  >
                    Login successful! Redirecting...
                  </Alert>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <Alert
                    severity="error"
                    sx={{
                      width: "100%",
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        fontSize: 20,
                      },
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}

                <Box component="form" onSubmit={formik.handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    id="emailOrPhone"
                    name="emailOrPhone"
                    label="Email or Phone"
                    placeholder="Enter your email or phone number"
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
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                          boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{
                              color: "primary.main",
                              fontSize: 20,
                            }}
                          />
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
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={formik.touched.password && formik.errors.password}
                    sx={{
                      mb: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "white",
                          boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            sx={{
                              color: "primary.main",
                              fontSize: 20,
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{
                              color: "text.secondary",
                              "&:hover": {
                                color: "primary.main",
                              },
                            }}
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ textAlign: "right", mb: 3 }}>
                    <Link href="/forgot-password" passHref>
                      <Typography
                        component="a"
                        variant="body2"
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          fontWeight: 500,
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Forgot password?
                      </Typography>
                    </Link>
                  </Box>

                  {/* Enhanced Sign In Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isMutating}
                    sx={{
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
                  >
                    {isMutating ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Signing In...</span>
                      </Box>
                    ) : (
                      "Sign In to Your Account"
                    )}
                  </Button>

                  <Box sx={{ my: 3 }}>
                    <Divider>
                      <Typography variant="body2" color="text.secondary" sx={{ px: 2, fontWeight: 500 }}>
                        or continue with
                      </Typography>
                    </Divider>
                  </Box>

                  {/* Enhanced Google Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    href="http://localhost:5000/api/auth/google"
                    sx={{
                      py: 2,
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

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link href="/register" passHref>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Create Account
                        </Typography>
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
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