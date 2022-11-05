import React from "react";
import SideBar from "./SideBar";

const MyDatasets = () => {

    return(
        <React.Fragment>
        <SideBar></SideBar>
        <div id='main-page' style={{marginTop:'75px', marginLeft: '300px'}}>
        <h1>My Datasets</h1>
      </div>
      </React.Fragment>
    )
}

export default MyDatasets;