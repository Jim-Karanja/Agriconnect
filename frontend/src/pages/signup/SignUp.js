import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const theme = createTheme();

function SignUp() {
  const [role, setRole] = useState(""); // State to store the selected role
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      gender: "male", // Assuming gender is provided here
      address: "", // Address is empty for now
      role: role, // Adding the role selected by the user
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/users/signup",
        userData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Yay! Profile created successfully!",
        });
        navigate("/login");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again!",
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              margin="dense"
              fullWidth
              id="name"
              label="Name"
              name="name"
              required
              autoFocus
            />
            <TextField
              margin="dense"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              required
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              margin="dense"
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
                <MenuItem value="innovator">Innovator</MenuItem>
              </Select>
            </FormControl>
            <Button
              sx={{ mt: 2, mb: 1 }}
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
