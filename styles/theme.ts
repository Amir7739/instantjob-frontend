import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: "red",
          fontSize: "1.2rem",
        },
      },
    },
  },
});

export default theme;
