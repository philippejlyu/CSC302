import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PublishIcon from '@mui/icons-material/Publish';
import BarChartIcon from '@mui/icons-material/BarChart';
import DatasetIcon from '@mui/icons-material/Dataset';
import { Link } from 'react-router-dom'

const SideBar = () => {
  const drawerWidth = 275;
    console.log("SideBar rendered");
    return (
      <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" sx={{ boxShadow: 3, bgcolor:'#673ab7', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" noWrap component="div">
            Visualyze
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
       variant="permanent"
       sx={{
         width: drawerWidth,
         flexShrink: 0,
         [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box',bgcolor:'white', boxShadow: 3 },
       }}
      >
        <Toolbar/>
        <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText primary={'Import Data'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/datasets">
                <ListItemIcon>
                  <DatasetIcon />
                </ListItemIcon>
                <ListItemText primary={'My Datasets'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/visualize">
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary={'Visualize'} />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider />
      </Drawer>
      </React.Fragment>
    )
}

export default SideBar;