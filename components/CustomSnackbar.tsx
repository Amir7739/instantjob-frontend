import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity: AlertColor;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          borderRadius: 1,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          bgcolor: severity === "success" ? "green" : undefined,
          color: severity === "success" ? "white" : undefined,
          "& .MuiAlert-icon": {
            color: severity === "success" ? "white" : undefined,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;