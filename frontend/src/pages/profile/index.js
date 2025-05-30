import {
    Avatar,
    Button,
    Container,
    Typography,
    Grid,
    Stack,
    Paper,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
  } from "@mui/material";
  import moment from "moment";
  import { grey } from "@mui/material/colors";
  import { createTheme } from "@mui/material/styles";
  import { useNavigate } from "react-router-dom";
  import React, { useState } from 'react';
  
  export default function Profile() {
    const loggedInUser = {
      image:
          "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
    };
  
    const navigate = useNavigate();
    
    // Adding state to manage role selection
    const [role, setRole] = useState(localStorage.getItem("role") || "");
  
    const handleCancel = () => {
      navigate("/");
    };
  
    const handleEditProfile = () => {
      navigate("/editprofile");
    };
  
    const handleRoleChange = (event) => {
      setRole(event.target.value);
      localStorage.setItem("role", event.target.value); // Store the selected role
    };
  
    const theme = createTheme({
      palette: {
        mode: "light",
        background: {
          default: grey[100],
        },
        primary: {
          main: "#263238",
        },
        secondary: {
          main: "#ecf0f1",
        },
      },
      typography: {
        button: {
          textTransform: "none",
        },
      },
    });
  
     //Front-end 
    return (
      <>
        <Container maxWidth="sm" component="main" justifyContent={"center"}>
          <Grid
            container
            spacing={2}
            style={{ minHeight: "100vh" }}
            direction={"column"}
            justifyContent="center"
          >
            <Paper elevation={3} sx={{ padding: 7 }}>
              <form>
                <Typography
                  component="h1"
                  variant="h5"
                  align={"center"}
                  marginBottom={3}
                >
                  Profile
                </Typography>
                <Stack direction="row" spacing={4} alignItems={"center"}>
                  <Avatar
                    src={loggedInUser.image}
                    sx={{
                      width: 100,
                      height: 100,
                      borderStyle: "solid",
                      borderWidth: 0.5,
                      borderColor: theme.palette.primary,
                    }}
                  />
                  <Stack direction="column" spacing={2}>
                    <TextField
                      label="Name"
                      fullWidth
                      defaultValue={localStorage.getItem("name")}
                      variant="outlined"
                      required
                      disabled
                    />
                    <TextField
                      label="Address"
                      fullWidth
                      defaultValue={localStorage.getItem("addr")}
                      variant="outlined"
                      required
                      disabled
                    />                  
                    <TextField
                      label="Gender"
                      fullWidth
                      defaultValue={localStorage.getItem("gender")}
                      variant="outlined"
                      required
                      disabled
                    />
                    <TextField
                      type={"email"}
                      label="Email Address"
                      fullWidth
                      defaultValue={localStorage.getItem("user")}
                      variant="outlined"
                      required
                      disabled
                    />
  
                    {/* Role selection */}
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={role}
                        onChange={handleRoleChange}
                        label="Role"
                        
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="investor">Investor</MenuItem>
                        <MenuItem value="innovator">Innovator</MenuItem>
                      </Select>
                    </FormControl>
  
                    <Stack direction={"row"} spacing={2}>
                      <Button type="submit" fullWidth variant="contained" onClick={handleEditProfile}>
                        Edit Profile
                      </Button>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Container>
      </>
    );
  }
  