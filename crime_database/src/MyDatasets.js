import React from "react";
import SideBar from "./SideBar";
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SERVERSIDEPORT } from './App.js';

var dbfiles = [];
var datasetlist = null;

class DatasetRow extends React.Component {
  render() {
    const city = this.props.city;
    return (
      <TableRow>
        <TableCell style={{border:"1px solid silver"}}>{city[0]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[2]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[1]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[4]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[5]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[128]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[130]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[132]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[134]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[136]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[138]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[140]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[142]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[144]}</TableCell>
        <TableCell style={{border:"1px solid silver"}}>{city[145]}</TableCell>
      </TableRow>
    )
  }
}

class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      amount: -1,
    }
  }

  render() {
    console.info("Rendering datatable");
    datasetlist = this;
    var listrows = this.state.rows.map((k) => {
      return (
        <DatasetRow key={k} city={k}/>
      )
    });
    console.info(listrows);
    
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="Crime Table">
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>County</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>HouseholdSize</TableCell>
              <TableCell>Murders</TableCell>
              <TableCell>Rapes</TableCell>
              <TableCell>Robberies</TableCell>
              <TableCell>Assaults</TableCell>
              <TableCell>Burglaries</TableCell>
              <TableCell>Larcenies</TableCell>
              <TableCell>AutoThefts</TableCell>
              <TableCell>Arsons</TableCell>
              <TableCell>Violent Crime Rate</TableCell>
              <TableCell>Others Crime Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{listrows}</TableBody>
        </Table>
      </TableContainer>
    );
  }
}

class DbFilesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dbfile: null,
    }
  }

  render() {
    var listfiles = <Typography>Looking for database...</Typography>
    if (dbfiles) {
      listfiles = dbfiles.map((file) => {
        return (
          <ListItem key={file.toString()} value={file} size="small" aria-label="Listed File">
            <ListItemButton onClick={() => {fetchDatabase(file, datasetlist)}}>
              <ListItemText primary={file}/>
            </ListItemButton>
          </ListItem>
        )
      });
    }

    return (
      <List>
        {listfiles}
      </List>
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
    dbfiles = res;
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
      table.setState({rows: res.rows, amount: res.rows.length});
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
        <Typography>Display a table of crime data.</Typography>
        <DbFilesList />
        <DatasetTable />
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;