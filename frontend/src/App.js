import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme"; // Import your custom theme
import "./App.css";

import Home from "./pages/header/Home";
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
        <Home /> {/* Rendering the Home component here */}
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
          <Route exact path="/Home" element={<Home />} /> {/* Correct route to render Home */}
          <Route exact path="/Header" element={<Home />} /> {/* Correct route to render Home */}
          
          <Route exact path="/" element={<Dashboard />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
