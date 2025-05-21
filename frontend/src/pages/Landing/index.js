import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Container,
  Button,
  Paper,
  Menu,
  MenuItem
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import NotificationDialog from "../notification/notificationDialog";

// Import images
import picture from "../../assets/images/Picture.png";
import startup2 from "../../assets/images/startup2.jpeg";
import startup3 from "../../assets/images/startup3.jpeg";
import logo from "../../assets/images/logo.png"; // Logo image

function Home() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuth");
    if (authStatus === "true") {
      setIsVerified(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePayment = () => navigate("/payments");
  const handleChat = () => navigate("/chat");
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <>
      {/* GLOBAL HEADER */}
      {isVerified && (
        <Box
          sx={{
            bgcolor: "#06402B",
            color: "#fff",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1100,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Logo (non-clickable) */}
            <img
              src={logo}
              alt="Agriconnect Logo"
              style={{ height: "40px", width: "auto", cursor: "default" }}
            />

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                cursor: "pointer"
              }}
              
            >
              Agriconnect
            </Typography>

            {/* Dropdown Menu */}
            <Button
              onClick={handleMenuClick}
              sx={{ color: "#fff", fontSize: "16px" }}
              endIcon={<ArrowDropDownIcon sx={{ color: "#fff" }} />}
            >
              Menu
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem onClick={() => handleNavigate("/investors")}>Investors</MenuItem>
              <MenuItem onClick={() => handleNavigate("/startups")}>Startups</MenuItem>
              <MenuItem onClick={() => handleNavigate("/Analysis")}>Analysis</MenuItem>
              <MenuItem onClick={() => handleNavigate("/profile")}>User Management</MenuItem>
            </Menu>
          </Box>

          <Box>
            <Tooltip title="View Notifications">
              <IconButton onClick={handleClickOpen} sx={{ color: "#fff" }}>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Payment">
              <IconButton onClick={handlePayment} sx={{ color: "#fff" }}>
                <LocalAtmIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat">
              <IconButton onClick={handleChat} sx={{ color: "#fff" }}>
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* DIALOG */}
      {isVerified && <NotificationDialog open={open} handleClose={handleClose} />}

      {/* MAIN HOMEPAGE SECTION */}
      {isVerified && (
        <Container maxWidth="lg" sx={{ mt: "120px" }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: "16px" }}>
            {/* Large Logo Above Welcome Message */}
            <Box display="flex" justifyContent="center" mb={3}>
              <img
                src={logo}
                alt="Agriconnect Logo"
                style={{ height: "120px", width: "auto" }}
              />
            </Box>

            <Typography variant="h3" gutterBottom align="center" color="primary">
              Welcome to Agriconnect
            </Typography>

            <Typography variant="h6" align="center" gutterBottom>
              Bridging the gap between agricultural startups and forward-thinking investors.
            </Typography>

            {/* IMAGE SECTION */}
            <Typography variant="h5" align="center" gutterBottom sx={{ mt: 6 }}>
              Explore Innovative Agricultural Startups
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <img
                  src={picture}
                  alt="Startup 1"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    height: "200px"
                  }}
                />
                <Typography variant="subtitle1" align="center" mt={1}>
                  Smart Farming Solutions
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <img
                  src={startup2}
                  alt="Startup 2"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    height: "200px"
                  }}
                />
                <Typography variant="subtitle1" align="center" mt={1}>
                  Greenhouse Innovations
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <img
                  src={startup3}
                  alt="Startup 3"
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    height: "200px"
                  }}
                />
                <Typography variant="subtitle1" align="center" mt={1}>
                  AgriTech Machinery
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default Home;
