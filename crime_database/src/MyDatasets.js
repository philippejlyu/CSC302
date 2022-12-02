import React from "react";
import SideBar from "./SideBar";
import Button from "@mui/material/Button";
import * as ReactDOM from 'react-dom';

class DatasetRow extends React.Component {
  render() {
    const city = this.props.city;
    return (
      <tr>
        <td style={{border:"1px solid black"}}>{city[0]}</td>
        <td style={{border:"1px solid black"}}>{city[2]}</td>
        <td style={{border:"1px solid black"}}>{city[1]}</td>
        <td style={{border:"1px solid black"}}>{city[4]}</td>
        <td style={{border:"1px solid black"}}>{city[5]}</td>
        <td style={{border:"1px solid black"}}>{city[128]}</td>
        <td style={{border:"1px solid black"}}>{city[130]}</td>
        <td style={{border:"1px solid black"}}>{city[132]}</td>
        <td style={{border:"1px solid black"}}>{city[134]}</td>
        <td style={{border:"1px solid black"}}>{city[136]}</td>
        <td style={{border:"1px solid black"}}>{city[138]}</td>
        <td style={{border:"1px solid black"}}>{city[140]}</td>
        <td style={{border:"1px solid black"}}>{city[142]}</td>
        <td style={{border:"1px solid black"}}>{city[144]}</td>
        <td style={{border:"1px solid black"}}>{city[145]}</td>
      </tr>
    )
  }
}

const rows = [];
const MyDatasets = () => {

  fetch('http://localhost:3000/mapData')
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('200: My Datasets');
        return res.json(); // Becomes the map data
      }
    })
    .then(mapData => {
      console.info(mapData);
      for (var k = 0; k < mapData.rows.length; k++) {
        if (!k%100) {
          console.info(mapData.rows[k]);
        }
        rows.push(<DatasetRow city={mapData.rows[k]}/>)
      }
    })
    .catch(error => {
      console.log(error);
    })

  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '75px', marginLeft: '300px' }}>
        <h1>My Datasets</h1>
        <div id='dataset-page'></div>
        <Button onClick={() => console.info("ZOMFG")}>Number of Results</Button>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>County</th>
              <th>City</th>
              <th>Population</th>
              <th>HouseholdSize</th>
              <th>Murders</th>
              <th>Rapes</th>
              <th>Robberies</th>
              <th>Assaults</th>
              <th>Burglaries</th>
              <th>Larcenies</th>
              <th>AutoThefts</th>
              <th>Arsons</th>
              <th>Violent Crime Rate</th>
              <th>Others Crime Rate</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;