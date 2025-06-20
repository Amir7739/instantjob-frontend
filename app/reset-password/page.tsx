"use client";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axiosInstance from "@/utils/axios";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    setStatus("loading");

    try {
      const res = await axiosInstance.post(
        `/auth/reset-password?token=${token}`,
        {
          newPassword: password,
          confirmPassword,
        }
      );
      setStatus("success");
      setMessage(res.data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Reset Password
        </Typography>

        {status === "success" && <Alert severity="success">{message}</Alert>}
        {status === "error" && <Alert severity="error">{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={status === "loading"}
          >
            {status === "loading" ? <CircularProgress size={20} /> : "Reset Password"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
