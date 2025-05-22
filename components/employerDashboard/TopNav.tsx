import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Notifications as BellIcon } from "@mui/icons-material";

interface TopNavProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ isMobile, toggleSidebar }) => {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#FFF", boxShadow: 1, p: 1 }}
      elevation={0}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 1, color: "#4B5EAA" }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flex: 1 }} /> {/* Spacer to push avatar to the right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          
          <Avatar
            src="/api/placeholder/40/40"
            sx={{ width: 32, height: 32 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;