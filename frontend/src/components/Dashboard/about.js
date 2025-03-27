import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import image from '../../assets/images/about.jpg';
import { useNavigate } from 'react-router-dom';

export default function About(){

    const navigate = useNavigate();
    const handleSubmit = () => {
      navigate("/requestdemo")
  }

  //Front-end 
  return (
    <Box sx={{ alignItems: 'center', width: '100%', margin: '5px 0px 50px 0px',justifyContent: 'center', minHeight: '400px', display: 'flex'}}>
      <Grid container spacing={6} sx={{ maxWidth: '1300px', display: 'flex',alignItems: 'center', padding: '50px'}}>
        <Grid item xs={12} md={5}>
          <img src={image} style={{width: '100%'}} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} style={{ paddingBottom: '15px'}}>
            What We Do?
          </Typography>
          <Typography style={{paddingBottom: '30px', fontSize: '18px', opacity: '0.7' }}>

            Agriconnect offers different approaches for Investors and Farmers.
            We host the sample Startups from the Farmers and guide  the investors about investment into the projects that interests them.
            At the same time, we help Farmers by guiding them in choosing a capable investors
          </Typography>
        
        </Grid>
      </Grid>
    </Box>
  );
};

