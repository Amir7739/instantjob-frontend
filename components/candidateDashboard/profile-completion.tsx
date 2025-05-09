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

const profileTasks = [
  { id: 1, task: "Upload resume", completed: true },
  { id: 2, task: "Add work experience", completed: true },
  { id: 3, task: "Add education", completed: true },
  { id: 4, task: "Add skills", completed: true },
  { id: 5, task: "Complete about section", completed: false },
  { id: 6, task: "Add profile picture", completed: true },
  { id: 7, task: "Add projects", completed: false },
  { id: 8, task: "Add certifications", completed: false },
]

export function ProfileCompletion() {
  const completedTasks = profileTasks.filter((task) => task.completed).length
  const completionPercentage = Math.round((completedTasks / profileTasks.length) * 100)

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
            {completedTasks}/{profileTasks.length} Tasks
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

        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Complete Profile
        </Button>
      </CardContent>
    </Card>
  )
}
