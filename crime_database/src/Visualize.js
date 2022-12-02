import React from "react";
import SideBar from "./SideBar";
import Map from "./Map";

const Visualize = () => {
  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '75px', marginLeft: '300px' }}>
        <h1>Visualize</h1>
        <Map></Map>
      </div>
    </React.Fragment>
  )
}

export default Visualize;