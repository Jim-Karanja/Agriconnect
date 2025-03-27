import React from "react";
import {
  Button,
  Container,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const theme = createTheme();

export default function EditProfile() {
  const navigate = useNavigate();

  const handleProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name"),
      password: formData.get("password"),
      address: formData.get("address"),
      gender: formData.get("gender"),
    };

    try {
      // Update user profile
      const updateResponse = await axios.put(
        `http://localhost:8080/users/updateUserProfile?email=${localStorage.getItem("user")}`,
        userData
      );

      if (updateResponse.status === 200) {
        // Fetch updated user details
        const userDetailsResponse = await axios.get(
          `http://localhost:8080/users/fetchUserByEmail?email=${localStorage.getItem("user")}`
        );

        // Update localStorage with the new user details
        const userDetails = userDetailsResponse.data[0];
        localStorage.setItem("name", userDetails.name);
        localStorage.setItem("key", userDetails.password);
        localStorage.setItem("addr", userDetails.address);
        localStorage.setItem("gender", userDetails.gender);

        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: `Hey ${userData.name}, your profile was successfully updated.`,
        });

        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while updating the profile. Please try again.",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 3 }}>
            Update Profile
          </Typography>
          <Box component="form" onSubmit={handleProfile}>
            <TextField
              label="Name"
              fullWidth
              defaultValue={localStorage.getItem("name")}
              variant="outlined"
              id="name"
              name="name"
              required
            />
            <TextField
              margin="dense"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              defaultValue={localStorage.getItem("user")}
              disabled
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              defaultValue={localStorage.getItem("key")}
              margin="dense"
              required
            />
            <TextField
              label="Address"
              fullWidth
              defaultValue={localStorage.getItem("addr")}
              variant="outlined"
              id="address"
              name="address"
              margin="dense"
              required
            />
            <TextField
              label="Gender"
              fullWidth
              defaultValue={localStorage.getItem("gender")}
              variant="outlined"
              id="gender"
              name="gender"
              margin="dense"
              required
            />
            <Button
              sx={{ mt: 2, mb: 1 }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
