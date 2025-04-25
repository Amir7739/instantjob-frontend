// components/StatsCard.tsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Box, 
  Chip,
  LinearProgress,
  Divider,
  useTheme
} from '@mui/material';
import { 
  ArrowUpward as ArrowUpwardIcon, 
  ArrowDownward as ArrowDownwardIcon,
  TrendingUp as TrendingUpIcon 
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  progress?: number;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color,
  progress,
  subtitle
}) => {
  const theme = useTheme();
  
  // Determine change indicator properties
  const getChangeIndicator = () => {
    if (changeType === 'positive') {
      return {
        icon: <ArrowUpwardIcon fontSize="small" />,
        color: theme.palette.success.main,
        text: `+${change} from last month`
      };
    } else if (changeType === 'negative') {
      return {
        icon: <ArrowDownwardIcon fontSize="small" />,
        color: theme.palette.error.main,
        text: `-${change} from last month`
      };
    } else {
      return {
        icon: <TrendingUpIcon fontSize="small" />,
        color: theme.palette.text.secondary,
        text: `${change} from last month`
      };
    }
  };

  const changeIndicator = getChangeIndicator();

  return (
    <Card 
      elevation={2}
      sx={{ 
        borderRadius: 2,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -20, 
          left: 24, 
          zIndex: 9 
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: color,
            width: 56, 
            height: 56,
            boxShadow: `0 4px 20px 0 ${alpha(color, 0.4)}`,
            border: `4px solid ${theme.palette.background.paper}`
          }}
        >
          {icon}
        </Avatar>
      </Box>
      
      <CardContent sx={{ pt: 5, pb: 3, px: 3 }}>
        <Box sx={{ ml: '60px', mb: 1 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              my: 0.5,
              color: theme.palette.text.primary
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip
            icon={changeIndicator.icon}
            label={changeIndicator.text}
            size="small"
            sx={{ 
              bgcolor: alpha(changeIndicator.color, 0.1),
              color: changeIndicator.color,
              fontWeight: 500,
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
          />
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: alpha(color, 0.15),
                '& .MuiLinearProgress-bar': {
                  bgcolor: color
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;