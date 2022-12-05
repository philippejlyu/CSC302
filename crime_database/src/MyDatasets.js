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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: '0',
    numeric: false,
    label: 'City',
  },
  {
    id: '2',
    numeric: false,
    label: 'County',
  },
  {
    id: '1',
    numeric: false,
    label: 'State',
  },
  {
    id: '4',
    numeric: true,
    label: 'Population',
  },
  {
    id: '5',
    numeric: true,
    label: 'HouseholdSize',
  },
];

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
    var headingrow = headCells.map((cell) => {
      return (
        <TableCell>{cell.label}</TableCell>
      )
    })
    var listrows = this.state.rows.map((city) => {
      var rows = headCells.map((cell) => { 
        return (
          <TableCell style={{border:"1px solid silver"}}>{city[cell.id]}</TableCell>
        )
      })
      return (
        <TableRow>
          {rows}
        </TableRow>
      )
    });
    console.info(listrows);
    
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="Crime Table">
          <TableHead>
            <TableRow>
              {headingrow}
            </TableRow>
          </TableHead>
          <TableBody>
            {listrows}
            </TableBody>
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