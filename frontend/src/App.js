import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import theme from "./theme"; // Import your custom theme
import "./App.css";
import Payment from "./pages/payment/Payment";
import InvSearchBar from "./pages/investorSearch/InvSearchBar";
import StartupSearchBar from "./pages/startupSearch/StartupSearchBar";
import Chat from "./pages/chat/chat";
import LogIn from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import Profile from "./pages/profile";
import EditProfile from "./pages/editprofile";
import ForgotPassword from "./pages/forgot-password/forgot-password";
import Dashboard from "./pages/dashboard";
import Investorprofile from "./pages/investors/Investorprofile";
import DocumentVerification from "./pages/documentVerification/DocumentVerification";
import Footer from "./pages/footer/Footer";
import StartupProfile from "./pages/product/StartupProfile";
import Aibot from "./pages/Aibot";
import Landing from "./pages/Landing";

function App() {
  const [isUserAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("isAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* ✅ Green Header */}
        <AppBar position="static" sx={{ backgroundColor: "primary" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ConnectNow
            </Typography>
          </Toolbar>
        </AppBar>

        {/* ✅ Routes */}
        <Routes>
          {isUserAuthenticated && (
            <>
              <Route exact path="/payments" element={<Payment />} />
              <Route exact path="/chat" element={<Chat />} />
              <Route exact path="/documentVerification" element={<DocumentVerification />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/editprofile" element={<EditProfile />} />
            </>
          )}
          <Route exact path="/invSearchBar" element={<InvSearchBar />} />
          <Route exact path="/startupSearchBar" element={<StartupSearchBar />} />
          <Route exact path="/investors" element={<Investorprofile />} />
          <Route exact path="/startups" element={<StartupProfile />} />
          <Route exact path="/login" element={<LogIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/Aibot" element={<Aibot />} />
          <Route exact path="/Landing" element={<Landing />} />
          <Route exact path="/" element={<Dashboard />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
