import React from 'react';
import {
  Snackbar,
  Alert,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DeleteConfirmationSnackbarProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string; // e.g., "job", "user", etc.
}

const DeleteConfirmationSnackbar = ({
  open,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationSnackbarProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || `Error deleting ${itemName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ maxWidth: '90%', width: 'auto' }}
    >
      <Alert
        severity="warning"
        variant="filled"
        sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="error"
              size="small"
              onClick={handleConfirm}
              disabled={isDeleting}
              sx={{ fontWeight: 'bold' }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={onClose}
              disabled={isDeleting}
              sx={{ fontWeight: 'bold' }}
            >
              Cancel
            </Button>
            <IconButton
              size="small"
              color="inherit"
              onClick={onClose}
              disabled={isDeleting}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        {error ? (
          error
        ) : (
          `Are you sure you want to delete this ${itemName}?`
        )}
      </Alert>
    </Snackbar>
  );
};

export default DeleteConfirmationSnackbar;