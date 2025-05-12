import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import { useEffect, useState } from "react"
import { getProfileTasks } from "@/services/candidateDashobardApi"
import Link from "next/link"



export function ProfileCompletion() {
  const [profileData, setProfileData] = useState({
    profileTasks: [],
    completedTasks: 0,
    totalTasks: 0,
    completionPercentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileTasks = async () => {
      try {
        const candidateId = localStorage.getItem("id");
        if (!candidateId) {
          throw new Error("Candidate ID not found in localStorage");
        }

        const data = await getProfileTasks(candidateId);
        setProfileData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileTasks();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const { profileTasks, completedTasks, totalTasks, completionPercentage } =
    profileData;

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Completion
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Complete your profile to attract more recruiters
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="body2" fontWeight="medium">
            {completionPercentage}% Complete
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedTasks}/{totalTasks} Tasks
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ mt: 1, mb: 2, height: 6, borderRadius: 3 }} 
        />

        <List dense sx={{ mt: 2 }}>
          {profileTasks.map((task) => (
            <ListItem key={task.id} disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {task.completed ? (
                  <CheckCircleIcon color="primary" fontSize="small" />
                ) : (
                  <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={task.task} 
                primaryTypographyProps={{ 
                  variant: "body2",
                  sx: task.completed ? { 
                    textDecoration: "line-through", 
                    color: "text.secondary" 
                  } : { fontWeight: "medium" }
                }} 
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          component={Link}
          href="/cand-dash/profile"
        >
          Complete Profile
        </Button>
      </CardContent>
    </Card>
  )
}
