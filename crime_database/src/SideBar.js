import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PublishIcon from '@mui/icons-material/Publish';
import BarChartIcon from '@mui/icons-material/BarChart';
import DatasetIcon from '@mui/icons-material/Dataset';

const SideBar = () => {
    const drawerWidth = 275;
    const [open, setOpen] = React.useState(false);
    const openDrawer = () => {
      setOpen(true);
      let el = document.getElementById("navbar-comp");
      ReactDOM.findDOMNode(el).style.width = 'calc(100% - 275px)';
      ReactDOM.findDOMNode(el).style.marginLeft = drawerWidth;
    };
    const closeDrawer = () => {
      setOpen(false);
      let el = document.getElementById("navbar-comp");
      ReactDOM.findDOMNode(el).style.width = 'calc(100%)';
      ReactDOM.findDOMNode(el).style.marginLeft = 0;
    };

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

    return (
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar id="navbar-comp" position="fixed" open={open} backgroundColor='#3f51b5'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Visualyze
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={closeDrawer}>
           <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText primary={'Import Data'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DatasetIcon />
                </ListItemIcon>
                <ListItemText primary={'My Datasets'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary={'Visualize'} />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider />
      </Drawer>
      </Box>
    )
}
export default SideBar;