"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signupEmployer } from "@/services/employerAuthApi";
import AuthLayout from "./AuthLayout";
import CustomSnackbar from "../CustomSnackbar";

const SignupSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .matches(/[a-z]/, "One lowercase letter required")
    .matches(/[A-Z]/, "One uppercase letter required")
    .matches(/\d/, "One number required")
    .matches(/[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,.?/~`]/, "One special character required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  terms: Yup.boolean().oneOf([true], "Must accept the terms"),
});

const EmployerSignupPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(null);
    setSuccessMessage(null);
  };



  return (
    <AuthLayout title="Start Hiring – Sign Up Now">
      <Formik
        initialValues={{
          companyName: "",
          email: "",
          password: "",
          contactNumber: "",
          terms: false,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signupEmployer({
              companyName: values.companyName,
              email: values.email,
              password: values.password,
              contactNumber: values.contactNumber,
            });
            setSuccessMessage("Thank You! Our team will verify your details and update you soon.");
            setOpenSnackbar(true);
            setTimeout(() => {
              router.push("/employer-dash/login");
            }, 3000);
          } catch (err: any) {
            setError(err.response?.message || err.message || "Signup Failed");
            // setOpenSnackbar(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 , maxWidth:"100%" }}>
              {error && <Alert severity="error">{error}</Alert>}
              <Field name="companyName">
                {({ field, meta }: any) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    fullWidth
                    variant="outlined"
                    required
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 1.5 },
                    }}
                  />
                )}
              </Field>
              <Field name="email">
                {({ field, meta }: any) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    variant="outlined"
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 1.5 },
                    }}
                  />
                )}
              </Field>
              <Field name="password">
                {({ field, meta }: any) => (
                  <TextField
                    {...field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    required
                    variant="outlined"
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error ? meta.error : "Must be at least 8 characters"}
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
                      sx: { borderRadius: 1.5 },
                    }}
                  />
                )}
              </Field>
              <Field name="contactNumber">
                {({ field, meta }: any) => (
                  <TextField
                    {...field}
                    label="Mobile Number"
                    fullWidth
                    required
                    variant="outlined"
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 1.5 },
                    }}
                  />
                )}
              </Field>
              <Field name="terms">
                {({ field, meta }: any) => (
                  <Box>
                    <FormControlLabel
                      control={<Checkbox {...field} color="primary" />}
                      label={
                        <Typography variant="body2">
                          I agree to the{" "}
                          <Link href="/terms" target="_blank">
                            Terms & Conditions
                          </Link>
                        </Typography>
                      }
                    />
                    {meta.touched && meta.error && (
                      <Typography color="error" variant="caption" sx={{ mt: -1, ml: 2 }}>
                        {meta.error}
                      </Typography>
                    )}
                  </Box>
                )}
              </Field>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  py: 1.2,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 12px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Link href="/employer-dash/login">Log In</Link>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>

      <CustomSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={successMessage || error || ""}
        severity={successMessage ? "success" : "error"}
      />
    </AuthLayout>
  );
};

export default EmployerSignupPage;