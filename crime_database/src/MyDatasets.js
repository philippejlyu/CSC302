import React from "react";
import SideBar from "./SideBar";
import Button from "@mui/material/Button";
import { SERVERSIDEPORT } from './App.js';

var rows = [];
var datasetlist = null;

class DbFileRow extends React.Component {
  render() {
    const dbfile = this.props.dbfile;
    return (
      <tr>
        <td style={{border:"1px solid black"}}>
          <Button id={dbfile} key={dbfile} onClick={(event) => {console.info(event.currentTarget.id); fetchDatabase(dbfile, datasetlist)}}>* {dbfile}</Button></td>
      </tr>
    )
  }
}

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

class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      amount: -1
    }
  }

  render() {
    console.info("Rendering datatable");
    datasetlist = this;
    return (
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
        <tbody>{this.state.datas}</tbody>
      </table>
    );
  }
}

const fetchDBFiles = () => {
  fetch('http://localhost:' + SERVERSIDEPORT + '/mapData')
  .then(function (res) {
    console.log(res);
    if (res.status === 200) {
      console.log('200: My Datasets');
      return res.json(); // Becomes the map data
    }
  })
  .then(res => {
    rows = [];
    for (var k = 0; k < res.length; k++) {
      rows.push(<DbFileRow dbfile={res[k]} component={this}/>)
    }
  })
  .catch(error => {
    console.log(error);
  })
}

const fetchDatabase = (dbname, table) => {
  console.log("Fetching from source " + dbname);
  fetch('http://localhost:' + SERVERSIDEPORT + '/mapData?datasetID=' + dbname)
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('200: My Datasets');
        return res.json(); // Becomes the map data
      }
    })
    .then(res => {
      var listing = [];
      for (var k = 0; k < res.rows.length; k++) {
        listing.push(<DatasetRow key={k} city={res.rows[k]}/>)
      }
      console.info(listing);
      table.setState({datas: listing, amount: res.rows.length});
      console.info(table);
    })
    .catch(error => {
      console.log(error);
    })
}

const MyDatasets = () => {
  console.log("Loaded MyDatasets page.")
  fetchDBFiles();
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
              <th>Database File</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <DatasetTable />
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;