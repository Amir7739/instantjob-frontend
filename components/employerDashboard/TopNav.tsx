import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, Search as SearchIcon, Notifications as BellIcon } from "@mui/icons-material";

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#F3F4F6",
            p: 1,
            borderRadius: 1,
            flex: 1,
            maxWidth: isMobile ? "100%" : 400,
            mx: isMobile ? 0 : 2,
          }}
        >
          <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} />
          <InputBase
            placeholder="Search jobs, applicants..."
            sx={{ flex: 1 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton sx={{ p: 1 }}>
            <Badge badgeContent={""} color="error">
              <BellIcon
                sx={{ color: "#9CA3AF", "&:hover": { color: "#4B5563" } }}
              />
            </Badge>
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src="/api/placeholder/40/40"
              sx={{ width: 32, height: 32 }}
            />
            {!isMobile && (
              <Typography sx={{ color: "#374151", fontWeight: "medium" }}>
                Acme Inc.
              </Typography>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;