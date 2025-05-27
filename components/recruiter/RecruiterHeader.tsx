import { FC } from 'react';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { HeaderBox } from './StyledComponents';

interface RecruiterHeaderProps {
  onAddClick: () => void;
  loading: boolean;
}

const RecruiterHeader: FC<RecruiterHeaderProps> = ({ onAddClick, loading }) => (
  <HeaderBox>
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Recruiters Management
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9 }}>
        Manage and view all recruiters in your organization
      </Typography>
    </Box>
    <Button
      variant="contained"
      size="large"
      startIcon={<AddIcon />}
      onClick={onAddClick}
      disabled={loading}
      sx={{
        bgcolor: 'white',
        color: 'primary.main',
        '&:hover': { bgcolor: 'grey.100' },
        px: 3,
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 'bold',
      }}
    >
      Add New Recruiter
    </Button>
  </HeaderBox>
);

export default RecruiterHeader;