import React from "react";
import SideBar from "./SideBar";
import * as ReactDOM from 'react-dom';

class DatasetRow extends React.Component {
  render() {
    const city = this.props.city;
    return (
      <tr>
        <td>
          {city}
        </td>
      </tr>
    )
  }
}

const rows = [];
const MyDatasets = () => {

  fetch('http://localhost:5000/mapData')
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
        rows.push(<DatasetRow city={mapData.rows[k][1]}/>)
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
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;