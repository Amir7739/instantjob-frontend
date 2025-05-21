import { Box, Typography, List, ListItem, ListItemIcon, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface PasswordChecklistProps {
  password: string;
}

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    { label: "One special character", valid: /[@$!%*?&#^()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(password) },
  ];

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
        Password must include:
      </Typography>
      <Grid container spacing={1}>
        {rules.map((rule, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <List dense disablePadding>
              <ListItem sx={{ py: 0 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {rule.valid ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="error" fontSize="small" />
                  )}
                </ListItemIcon>
                <Typography variant="body2">{rule.label}</Typography>
              </ListItem>
            </List>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PasswordChecklist;
