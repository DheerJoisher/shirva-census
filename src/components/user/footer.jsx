import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Shirva Census
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connecting our community, preserving our heritage. A digital platform to bring together the people of Shirva across the globe.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="/user/dashboard" color="inherit" underline="hover">
                  Dashboard
                </Link>
              </Box>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="/user/add-member" color="inherit" underline="hover">
                  Add Member
                </Link>
              </Box>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Family Profile
                </Link>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Help
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  FAQs
                </Link>
              </Box>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Contact Us
                </Link>
              </Box>
              <Box component="li" sx={{ pb: 1 }}>
                <Link href="#" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 3, mb: 3 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Shirva Census. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
