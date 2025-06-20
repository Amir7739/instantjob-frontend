"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegister } from "@/hooks/useRegister";
import { RegisterPayload } from "@/types/auth";
import { useRouter } from "next/navigation";

// Validation schema
const validationSchema = Yup.object({
  full_name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
  agreeToTerms: Yup.bool().oneOf([true], "You must agree to continue"),
});

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const router = useRouter();

  const { trigger: register, isMutating } = useRegister();

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      phone: "",
      agreeToTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: RegisterPayload = {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: "candidate",
        };

        const response = await register(payload); // ✅ CORRECT USAGE

        localStorage.setItem("token", response.token);

        setSnackbar({
          open: true,
          message: "Registration successful!",
          severity: "success",
        });

        setTimeout(() => router.push("/login"), 2000);
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error?.response?.data?.message || "Something went wrong",
          severity: "error",
        });
      }
    },
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e8e8e8",
          bgcolor: "white",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
  <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
    <Box
      component="div"
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        overflow: "hidden",
        bgcolor: "#4285f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1,
      }}
    >
      <Image
        src="/images/ij.jpg"
        alt="Logo"
        width={40}
        height={60}
        style={{ objectFit: "cover" }}
      />
    </Box>
    <Typography variant="h6" fontWeight="bold" color="#4285f4">
      InstantJob
    </Typography>
  </Box>
</Link>
        <Typography variant="body2">
          Already Registered?{" "}
          <Link href="/login" style={{ color: "#4285f4", fontWeight: "bold" }}>
            Login
          </Link>{" "}
          here
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 2, height: "80%" }}>
              <Box
                component="img"
                src="/images/2.png"
                alt="Illustration"
                sx={{ maxWidth: "80%", mx: "auto", mb: 4, display: "block" }}
              />
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                On registering, you can
              </Typography>
              {[
                "Build your profile and let recruiters find you",
                "Get job postings delivered right to your email",
                "Find a job and grow your career",
              ].map((text, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "white",
                      bgcolor: "#4caf50",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      mt: 0.5,
                    }}
                  >
                    ✓
                  </Box>
                  <Typography variant="body1">{text}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Right Form Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={10} sx={{ p: 4, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Create your InstantJob profile
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Search & apply to jobs from India's No.1 Job Site
              </Typography>

              <form onSubmit={formik.handleSubmit}>
                {/* Full Name */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ mb: 1 }}
                  >
                    Full name{" "}
                    <Box component="span" sx={{ color: "error.main" }}>
                      *
                    </Box>
                  </Typography>
                  <TextField
                    fullWidth
                    name="full_name"
                    placeholder="What is your name?"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.full_name &&
                      Boolean(formik.errors.full_name)
                    }
                    helperText={
                      formik.touched.full_name && formik.errors.full_name
                    }
                  />
                </Box>

                {/* Email and Mobile */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      Email ID{" "}
                      <Box component="span" sx={{ color: "error.main" }}>
                        *
                      </Box>
                    </Typography>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      placeholder="Tell us your Email ID"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      Mobile number{" "}
                      <Box component="span" sx={{ color: "error.main" }}>
                        *
                      </Box>
                    </Typography>
                    <TextField
                      fullWidth
                      name="phone"
                      placeholder="Enter your mobile number"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.phone && Boolean(formik.errors.phone)
                      }
                      helperText={formik.touched.phone && formik.errors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+91</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Password */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    fontWeight="medium"
                    sx={{ mb: 1 }}
                  >
                    Password{" "}
                    <Box component="span" sx={{ color: "error.main" }}>
                      *
                    </Box>
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="(Minimum 6 characters)"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Terms and Conditions */}
                <Box sx={{ mb: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeToTerms"
                        checked={formik.values.agreeToTerms}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I agree to the Terms & Conditions and Privacy Policy
                      </Typography>
                    }
                  />
                  {formik.touched.agreeToTerms &&
                    formik.errors.agreeToTerms && (
                      <Typography color="error" variant="caption">
                        {formik.errors.agreeToTerms}
                      </Typography>
                    )}
                </Box>

                                  <Stack spacing={3}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isMutating}
                      sx={{
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 2,
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isMutating ? "Creating Account..." : "Register Now"}
                    </Button>

                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        OR
                      </Typography>
                    </Divider>

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
                  </Stack>

              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage;
