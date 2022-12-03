import React from "react";
import SideBar from "./SideBar";
import Map from "./Map";

const Visualize = () => {
  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '65px', marginLeft: '275px' }}>
        <Map></Map>
      </div>
    </React.Fragment>
  )
}

export default Visualize;