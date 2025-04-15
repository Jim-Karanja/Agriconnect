import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Avatar } from '@mui/material';

export default function Success() {
  
  const responses = [
    {
      id: 1,
      name: 'John',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      imgPath:
        'https://imgur.com/gDjslG9',
        designation: ' Rally Assets'
    },
    {
      id: 2,
      name: 'Jane',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        imgPath:
        'https://imgur.com/gDjslG9',
        designation: 'DMZ Incubator',
    },
    {
      id: 3,
      name: 'Robert',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        imgPath:
        'https://imgur.com/gDjslG9',
        designation: ' MaRS',
    },
  ];

   //Front-end 
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
      }}
    >
      <Grid container spacing={2}>
        {responses.map((element) => (
          <Grid item sm={12} md={4} key={element.id}>
            <Card style={{alignItems: 'center', backgroundColor: '#fff', minHeight: '200px',display: 'flex',padding: '10px'  }}>
              <CardContent>
                <Typography style={{ paddingBottom: '25px'}}>
                  "{element.review}"
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  <Avatar
                    src={element.imgPath}
                    size="large"
                    style={{ marginRight: '10px'}}
                  />
                  <Box>
                    <Typography>{element.name}</Typography>
                    <Typography style={{fontSize: '14px', opacity: '0.6',}}>
                      {element.designation}
                    </Typography>
                  </Box>
                </Box> 
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
