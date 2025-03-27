import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ChatIcon from "@mui/icons-material/Chat";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotificationDialog from "../notification/notificationDialog";

function Home() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const authStatus = localStorage.getItem("isAuth");
    if (authStatus === "true") {
      setIsVerified(true);
    } else {
      navigate("/login"); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePayment = () => navigate("/payments");
  const handleChat = () => navigate("/chat");
  const handleHome = () => navigate("/");

  return (
    <>
      {isVerified && (
        <NotificationDialog open={open} handleClose={handleClose} />
      )}
      {isVerified && (
        <AppBar color="primary" position="sticky" elevation={5}>
          <Toolbar>
            <Grid container spacing={0.5} alignItems="center" sx={{ flexGrow: 1 }}>
              <Grid item xs>
                <Typography
                  onClick={handleHome}
                  color="inherit"
                  variant="h5"
                  component="h1"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "white",
                    boxShadow: 10,
                    borderRadius: 2,
                    borderColor: "black",
                    border: 2,
                    p: 2,
                  }}
                >
                  ConnectNow
                </Typography>
              </Grid>
              <Box
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {/* Conditional Buttons */}
                {isVerified && (
                  <>
                    <Typography
                      variant="body"
                      component="div"
                      sx={{
                        display: { xs: "none", sm: "block", alignContent: "center" },
                        cursor: "pointer",
                        color: "white",
                        fontSize: "18px",
                        p: 1.5,
                      }}
                      onClick={() => navigate("/investors")}
                    >
                      Investors
                    </Typography>
                    <Typography
                      variant="body"
                      component="div"
                      sx={{
                        display: { xs: "none", sm: "block", alignContent: "center" },
                        cursor: "pointer",
                        color: "white",
                        fontSize: "18px",
                        p: 1.5,
                      }}
                      onClick={() => navigate("/startups")}
                    >
                      Startups
                    </Typography>
                    
                    <Typography
                      variant="body"
                      component="div"
                      sx={{
                        display: { xs: "none", sm: "block", alignContent: "center" },
                        cursor: "pointer",
                        color: "white",
                        fontSize: "18px",
                        p: 1.5,
                      }}
                      onClick={() => navigate("/profile")}
                    >
                      User Management
                    </Typography>
                  </>
                )}
              </Box>
              <Grid item xs />
              {/* Notification, Payment, and Chat Buttons */}
              {isVerified && (
                <>
                  <Grid item>
                    <Tooltip title="View Notifications">
                      <IconButton color="inherit" onClick={handleClickOpen}>
                        <NotificationsIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Payment">
                      <IconButton color="inherit" onClick={handlePayment}>
                        <LocalAtmIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Chat">
                      <IconButton color="inherit" onClick={handleChat}>
                        <ChatIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}

export default Home;
