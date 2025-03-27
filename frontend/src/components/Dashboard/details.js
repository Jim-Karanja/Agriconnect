import * as React from "react";
import { Button, Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function Details() {
  const navigate = useNavigate();
  const handleIncubators = () => {
    navigate("/startups");
  };

  const handleInvestors = () => {
    navigate("/investors");
  };

  const handlePayment = () => {
    if (localStorage.getItem("isAuth") === "true"){
      navigate("/payments");
    }
    else{
      Swal.fire({
        icon: "error",
        title: "Hold onn.....",
        text: "Please Login",
      });
    }
  };
 //Front-end 
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 128,
          height: 128,
        }
      }}
    >
      <Paper
        elevation={0}
        style={{
          padding: "30px",
          width: "300px",
          height: "250px",
          backgroundColor: "white",
          borderRadius: "10px",
          textAlign: "center",
          margin: "10px ",
          marginLeft: "120px",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={450}
          style={{ paddingBottom: "15px", color: "#7B3F00" }}
        >
          Farm-Incubators
        </Typography>
        <Typography>
          Startup Incubators is  a program that gives very early-stage 
          projects access to  investors and other support to help them get established
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "150px", fontSize: "16px", marginTop: "50px" }}
          onClick={handleIncubators}
        >
          Products
        </Button>
      </Paper>
      <Paper
        elevation={0}
        style={{
          padding: "30px",
          width: "300px",
          height: "250px",
          backgroundColor: "white",
          borderRadius: "10px",
          textAlign: "center",
          margin: "10px",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={450}
          style={{ paddingBottom: "15px", color: "#7B3F00" }}
        >
         Agri-Investors
        </Typography>
        <Typography>
        Impact investors make investments that help achieve certain 
        social and environmental benefits while generating financial returns.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "150px", fontSize: "16px", marginTop: "50px" }}
          onClick={handleInvestors}
        >
          Investors
        </Button>
      </Paper>
      <Paper
        elevation={0}
        style={{
          padding: "30px",
          width: "300px",
          height: "250px",
          backgroundColor: "white",
          borderRadius: "10px",
          textAlign: "center",
          margin: "10px ",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={450}
          style={{ paddingBottom: "15px", color: "#7B3F00" }}
        >
          Payment
        </Typography>
        <Typography>
          We provide  payment options for our customers.
          Check our payment page for more details.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "150px", fontSize: "16px", marginTop: "50px" }}
          onClick={handlePayment}
        >
          Payment
        </Button>
      </Paper>
    </Box>
  );
}
