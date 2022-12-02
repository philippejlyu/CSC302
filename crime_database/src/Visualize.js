import React from "react";
import SideBar from "./SideBar";
import Map from "./Map";

const Visualize = () => {

  fetch('http://localhost:3000/mapData')
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('res 200')
        return res.json()
      }
    })
    .then(mapData => {
      for (let i = 0; i < 400; i++) {
        console.info(mapData.rows[i])
      }
    })
    .catch(error => {
      console.log(error);
    });

  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '75px', marginLeft: '300px' }}>
        <h1>Visualize</h1>
      </div>
    </React.Fragment>
  )
}

export default Visualize;