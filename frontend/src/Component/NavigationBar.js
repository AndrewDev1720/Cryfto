import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavigationBar = ({ username }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar>
        {/* Logo or brand name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 0.5 }}>
          CRYFTO.US
        </Typography>

        {/* Navigation Tabs */}
        <Tabs value={value} onChange={handleChange} textColor="inherit">
          <Tab label="Buy Crypto" />
          <Tab label="Prices" />
          <Tab label="Account History" />
          <Tab label="Deposit" />
          {/* ... other options */}
        </Tabs>

        {/* User and authentication */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {/* User's name and icon */}
          {username ? (
            <>
              <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                {username}
              </Typography>
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit">Log In</Button>
              <Button color="inherit" variant="outlined" sx={{ marginLeft: 1 }}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
