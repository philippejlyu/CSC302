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
  const [state, setState] = React.useState(true);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ state: open });
  };

  const drawerWidth = 275;
  console.log("InfoBar rendered");
  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        variant="permanent"
        open={state}
        onClose={toggleDrawer(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'white', boxShadow: 3 },
        }}
      >
        <Toolbar />
        <List>
          hi
        </List>
        <Divider />
      </Drawer>
    </React.Fragment>
  )
}

export default SideBar;