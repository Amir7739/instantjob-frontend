"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { loginEmployer } from "@/services/employerAuthApi";
import AuthLayout from "./AuthLayout";

// Schema to validate either email or contactNumber
const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required("Email or contact number is required"),
  password: Yup.string().required("Password is required"),
});

const EmployerLoginPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout title="Employer Login">
      <Box>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Log in to manage your hiring and access top talent
        </Typography>
        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const isEmail = values.identifier.includes("@");
              await loginEmployer({
                ...(isEmail
                  ? { email: values.identifier }
                  : { contactNumber: values.identifier }),
                password: values.password,
              });
              router.push("/employer-dash");
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {error && (
                  <Alert severity="error" sx={{ borderRadius: 1 }}>
                    {error}
                  </Alert>
                )}
                <Field name="identifier">
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label="Email or Contact Number"
                      type="text"
                      fullWidth
                      variant="outlined"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {field.value.includes("@") ? (
                              <EmailIcon color="primary" />
                            ) : (
                              <PhoneAndroidIcon color="primary" />
                            )}
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
                      variant="outlined"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
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
                  {isSubmitting ? "Logging In..." : "Log In"}
                </Button>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  Don’t have an account?{" "}
                  <Link href="/employer-dash/signup">Sign Up</Link>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </AuthLayout>
  );
};

export default EmployerLoginPage;
