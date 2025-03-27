// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#06402B", // Dark green color
      contrastText: "#ffffff", // White text for contrast
    },
    secondary: {
      main: "#8FBC8F", // Optional: Lighter green for secondary color
    },
  },
});

export default theme;
