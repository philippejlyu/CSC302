import React from "react";
import SideBar from "./SideBar";
import * as ReactDOM from 'react-dom';

const MyDatasets = () => {

  fetch('http://localhost:3000/mapData')
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('res 200')
        return res.json()
      }
    })
    .then(mapData => {
      var locations = []
      for (let i = 0; i < 400; i++) {
        let el = document.getElementById("dataset-page");
        const tr = document.createElement("p");
        tr.innerHTML = mapData.rows[i];
        tr.style.color = 'gray';
        ReactDOM.findDOMNode(el).append(tr);
      }
      this.setState({ markers: locations });
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
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;