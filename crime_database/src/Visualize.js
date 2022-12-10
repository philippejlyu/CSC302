import React, { useState, useEffect } from 'react';
import SideBar from "./SideBar";
import Map from "./Map";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DescriptionIcon from '@mui/icons-material/Description';
import { SERVERSIDEPORT } from './App.js';

var rows = []
var map = "..."

const Visualize = () => {
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [dataset, setDataset] = useState(null);
  
  const fetchDBFiles = () => {
    fetch('http://localhost:' + SERVERSIDEPORT + '/mapData')
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('200: My Datasets');
        return res.json(); // Becomes the map data
      }
      if (res.status === 418) {
        console.log('418: My Datasets');
        return {"rows":[]};
      }
      if (res.status === 300) {
        console.log('300: My Datasets');
        return {"rows":[]};
      }
    })
    .then(res => {
      rows = res;
      setLoaded(true);
      setCount(count + 1);
    })
    .catch(error => {
      console.log(error);
    })
  } 
  
  useEffect(() => { document.title = `Visualization (${count})`;
    document.title = `Map View`;
    console.info("Visualize rerender");
    if (!loaded) {
      fetchDBFiles();
    }
  }, [loaded]);
  
  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '65px', marginLeft: '275px' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Dataset</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={!dataset ? "" : dataset}
            label="Dataset Selection"
            onChange={(event)=>{setDataset(event.target.value); console.info(dataset); console.log(rows)}}
          >
          {rows.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              <DescriptionIcon/> {name}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
        <Map id={"map"} dbFiles={dataset}></Map>
      </div>
    </React.Fragment>
  )
}

export default Visualize;