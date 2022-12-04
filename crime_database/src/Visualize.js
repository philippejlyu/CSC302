import React, { useState } from "react";
import SideBar from "./SideBar";
import Map from "./Map";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SERVERSIDEPORT } from './App.js';

var rows = []
var map = <Map id={"map"} data={"sample.db"}></Map>

const fetchDBFiles = () => {
  fetch('http://localhost:' + SERVERSIDEPORT + '/mapData')
  .then(function (res) {
    console.log(res);
    if (res.status === 200) {
      console.log('200: Visualization');
      return res.json(); // Becomes the map data
    }
  })
  .then(res => {
    rows = [""];
    for (var k = 0; k < res.length; k++) {
      rows.push(res[k]);
    }
  })
  .catch(error => {
    console.log(error);
  })
}

const Visualize = () => {
  const [dataset, setDataset] = useState("sample.db");
  fetchDBFiles();
  console.info("Visualize rerender");
  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '65px', marginLeft: '275px' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Dataset</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dataset}
            label="Dataset Selection"
            onChange={(event)=>{setDataset(event.target.value); console.info(dataset); map=null; map=<Map id={"map"} data={"sample.db"}></Map>}}
          >
          {console.log(rows)}
          {rows.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {"* " + name}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
        {map}
      </div>
    </React.Fragment>
  )
}

export default Visualize;