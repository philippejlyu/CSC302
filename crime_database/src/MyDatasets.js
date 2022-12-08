import React, { useState, useEffect } from 'react';
import SideBar from "./SideBar";
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DescriptionIcon from '@mui/icons-material/Description';

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
import { fontWeight } from "@mui/system";

const INIT_COUNT = -1;
const NOT_A_DB = -2;

/* **********  **********  **********  **********  **********  **********  **********  **********  */

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
  {id:0, numeric: true, abbrid:null, show:true, label: "Name"},
  {id:2, numeric: true, abbrid:null, show:true, label: "countyCode"},
  {id:1, numeric: true, abbrid:null, show:true, label: "state"},
  {id:3, numeric: true, abbrid:null, show:false, label: "communityCode"},
  {id:4, numeric: true, abbrid:null, show:true, label: "population"},
  {id:5, numeric: true, abbrid:null, show:true, label: "householdsize"},
  {id:6, numeric: true, abbrid:null, show:false, label: "racepctblack"},
  {id:7, numeric: true, abbrid:null, show:false, label: "racePctWhite"},
  {id:8, numeric: true, abbrid:null, show:false, label: "racePctAsian"},
  {id:9, numeric: true, abbrid:null, show:false, label: "racePctHisp"},
  {id:10, numeric: true, abbrid:null, show:false, label: "agePct12t21"},
  {id:11, numeric: true, abbrid:null, show:false, label: "agePct12t29"},
  {id:12, numeric: true, abbrid:null, show:false, label: "agePct16t24"},
  {id:13, numeric: true, abbrid:null, show:false, label: "agePct65up"},
  {id:14, numeric: true, abbrid:null, show:false, label: "numbUrban"},
  {id:15, numeric: true, abbrid:null, show:false, label: "pctUrban"},
  {id:16, numeric: true, abbrid:null, show:false, label: "medIncome"},
  {id:17, numeric: true, abbrid:null, show:false, label: "pctWWage"},
  {id:18, numeric: true, abbrid:null, show:false, label: "pctWFarmSelf"},
  {id:19, numeric: true, abbrid:null, show:false, label: "pctWInvInc"},
  {id:20, numeric: true, abbrid:null, show:false, label: "pctWSocSec"},
  {id:21, numeric: true, abbrid:null, show:false, label: "pctWPubAsst"},
  {id:22, numeric: true, abbrid:null, show:false, label: "pctWRetire"},
  {id:23, numeric: true, abbrid:null, show:false, label: "medFamInc"},
  {id:24, numeric: true, abbrid:null, show:false, label: "perCapInc"},
  {id:25, numeric: true, abbrid:null, show:false, label: "whitePerCap"},
  {id:26, numeric: true, abbrid:null, show:false, label: "blackPerCap"},
  {id:27, numeric: true, abbrid:null, show:false, label: "indianPerCap"},
  {id:28, numeric: true, abbrid:null, show:false, label: "AsianPerCap"},
  {id:29, numeric: true, abbrid:null, show:false, label: "OtherPerCap"},
  {id:30, numeric: true, abbrid:null, show:false, label: "HispPerCap"},
  {id:31, numeric: true, abbrid:null, show:false, label: "NumUnderPov"},
  {id:32, numeric: true, abbrid:null, show:false, label: "PctPopUnderPov"},
  {id:33, numeric: true, abbrid:null, show:false, label: "PctLess9thGrade"},
  {id:34, numeric: true, abbrid:null, show:false, label: "PctNotHSGrad"},
  {id:35, numeric: true, abbrid:null, show:false, label: "PctBSorMore"},
  {id:36, numeric: true, abbrid:null, show:false, label: "PctUnemployed"},
  {id:37, numeric: true, abbrid:null, show:false, label: "PctEmploy"},
  {id:38, numeric: true, abbrid:null, show:false, label: "PctEmplManu"},
  {id:39, numeric: true, abbrid:null, show:false, label: "PctEmplProfServ"},
  {id:40, numeric: true, abbrid:null, show:false, label: "PctOccupManu"},
  {id:41, numeric: true, abbrid:null, show:false, label: "PctOccupMgmtProf"},
  {id:42, numeric: true, abbrid:null, show:false, label: "MalePctDivorce"},
  {id:43, numeric: true, abbrid:null, show:false, label: "MalePctNevMarr"},
  {id:44, numeric: true, abbrid:null, show:false, label: "FemalePctDiv"},
  {id:45, numeric: true, abbrid:null, show:false, label: "TotalPctDiv"},
  {id:46, numeric: true, abbrid:null, show:false, label: "PersPerFam"},
  {id:47, numeric: true, abbrid:null, show:false, label: "PctFam2Par"},
  {id:48, numeric: true, abbrid:null, show:false, label: "PctKids2Par"},
  {id:49, numeric: true, abbrid:null, show:false, label: "PctYoungKids2Par"},
  {id:50, numeric: true, abbrid:null, show:false, label: "PctTeen2Par"},
  {id:51, numeric: true, abbrid:null, show:false, label: "PctWorkMomYoungKids"},
  {id:52, numeric: true, abbrid:null, show:false, label: "PctWorkMom"},
  {id:53, numeric: true, abbrid:null, show:false, label: "NumKidsBornNeverMar"},
  {id:54, numeric: true, abbrid:null, show:false, label: "PctKidsBornNeverMar"},
  {id:55, numeric: true, abbrid:null, show:false, label: "NumImmig"},
  {id:56, numeric: true, abbrid:null, show:false, label: "PctImmigRecent"},
  {id:57, numeric: true, abbrid:null, show:false, label: "PctImmigRec5"},
  {id:58, numeric: true, abbrid:null, show:false, label: "PctImmigRec8"},
  {id:59, numeric: true, abbrid:null, show:false, label: "PctImmigRec10"},
  {id:60, numeric: true, abbrid:null, show:false, label: "PctRecentImmig"},
  {id:61, numeric: true, abbrid:null, show:false, label: "PctRecImmig5"},
  {id:62, numeric: true, abbrid:null, show:false, label: "PctRecImmig8"},
  {id:63, numeric: true, abbrid:null, show:false, label: "PctRecImmig10"},
  {id:64, numeric: true, abbrid:null, show:false, label: "PctSpeakEnglOnly"},
  {id:65, numeric: true, abbrid:null, show:false, label: "PctNotSpeakEnglWell"},
  {id:66, numeric: true, abbrid:null, show:false, label: "PctLargHouseFam"},
  {id:67, numeric: true, abbrid:null, show:false, label: "PctLargHouseOccup"},
  {id:68, numeric: true, abbrid:null, show:false, label: "PersPerOccupHous"},
  {id:69, numeric: true, abbrid:null, show:false, label: "PersPerOwnOccHous"},
  {id:70, numeric: true, abbrid:null, show:false, label: "PersPerRentOccHous"},
  {id:71, numeric: true, abbrid:null, show:false, label: "PctPersOwnOccup"},
  {id:72, numeric: true, abbrid:null, show:false, label: "PctPersDenseHous"},
  {id:73, numeric: true, abbrid:null, show:false, label: "PctHousLess3BR"},
  {id:74, numeric: true, abbrid:null, show:false, label: "MedNumBR"},
  {id:75, numeric: true, abbrid:null, show:false, label: "HousVacant"},
  {id:76, numeric: true, abbrid:null, show:false, label: "PctHousOccup"},
  {id:77, numeric: true, abbrid:null, show:false, label: "PctHousOwnOcc"},
  {id:78, numeric: true, abbrid:null, show:false, label: "PctVacantBoarded"},
  {id:79, numeric: true, abbrid:null, show:false, label: "PctVacMore6Mos"},
  {id:80, numeric: true, abbrid:null, show:false, label: "MedYrHousBuilt"},
  {id:81, numeric: true, abbrid:null, show:false, label: "PctHousNoPhone"},
  {id:82, numeric: true, abbrid:null, show:false, label: "PctWOFullPlumb"},
  {id:83, numeric: true, abbrid:null, show:false, label: "OwnOccLowQuart"},
  {id:84, numeric: true, abbrid:null, show:false, label: "OwnOccMedVal"},
  {id:85, numeric: true, abbrid:null, show:false, label: "OwnOccHiQuart"},
  {id:86, numeric: true, abbrid:null, show:false, label: "OwnOccQrange"},
  {id:87, numeric: true, abbrid:null, show:false, label: "RentLowQ"},
  {id:88, numeric: true, abbrid:null, show:false, label: "RentMedian"},
  {id:89, numeric: true, abbrid:null, show:false, label: "RentHighQ"},
  {id:90, numeric: true, abbrid:null, show:false, label: "RentQrange"},
  {id:91, numeric: true, abbrid:null, show:false, label: "MedRent"},
  {id:92, numeric: true, abbrid:null, show:false, label: "MedRentPctHousInc"},
  {id:93, numeric: true, abbrid:null, show:false, label: "MedOwnCostPctInc"},
  {id:94, numeric: true, abbrid:null, show:false, label: "MedOwnCostPctIncNoMtg"},
  {id:95, numeric: true, abbrid:null, show:false, label: "NumInShelters"},
  {id:96, numeric: true, abbrid:null, show:false, label: "NumStreet"},
  {id:97, numeric: true, abbrid:null, show:false, label: "PctForeignBorn"},
  {id:98, numeric: true, abbrid:null, show:false, label: "PctBornSameState"},
  {id:99, numeric: true, abbrid:null, show:false, label: "PctSameHouse85"},
  {id:100, numeric: true, abbrid:null, show:false, label: "PctSameCity85"},
  {id:101, numeric: true, abbrid:null, show:false, label: "PctSameState85"},
  {id:102, numeric: true, abbrid:null, show:false, label: "LemasSwornFT"},
  {id:103, numeric: true, abbrid:null, show:false, label: "LemasSwFTPerPop"},
  {id:104, numeric: true, abbrid:null, show:false, label: "LemasSwFTFieldOps"},
  {id:105, numeric: true, abbrid:null, show:false, label: "LemasSwFTFieldPerPop"},
  {id:106, numeric: true, abbrid:null, show:false, label: "LemasTotalReq"},
  {id:107, numeric: true, abbrid:null, show:false, label: "LemasTotReqPerPop"},
  {id:108, numeric: true, abbrid:null, show:false, label: "PolicReqPerOffic"},
  {id:109, numeric: true, abbrid:null, show:false, label: "PolicPerPop"},
  {id:110, numeric: true, abbrid:null, show:false, label: "RacialMatchCommPol"},
  {id:111, numeric: true, abbrid:null, show:false, label: "PctPolicWhite"},
  {id:112, numeric: true, abbrid:null, show:false, label: "PctPolicBlack"},
  {id:113, numeric: true, abbrid:null, show:false, label: "PctPolicHisp"},
  {id:114, numeric: true, abbrid:null, show:false, label: "PctPolicAsian"},
  {id:115, numeric: true, abbrid:null, show:false, label: "PctPolicMinor"},
  {id:116, numeric: true, abbrid:null, show:false, label: "OfficAssgnDrugUnits"},
  {id:117, numeric: true, abbrid:null, show:false, label: "NumKindsDrugsSeiz"},
  {id:118, numeric: true, abbrid:null, show:false, label: "PolicAveOTWorked"},
  {id:119, numeric: true, abbrid:null, show:false, label: "LandArea"},
  {id:120, numeric: true, abbrid:null, show:false, label: "PopDens"},
  {id:121, numeric: true, abbrid:null, show:false, label: "PctUsePubTrans"},
  {id:122, numeric: true, abbrid:null, show:false, label: "PolicCars"},
  {id:123, numeric: true, abbrid:null, show:false, label: "PolicOperBudg"},
  {id:124, numeric: true, abbrid:null, show:false, label: "LemasPctPolicOnPatr"},
  {id:125, numeric: true, abbrid:null, show:false, label: "LemasGangUnitDeploy"},
  {id:126, numeric: true, abbrid:null, show:false, label: "LemasPctOfficDrugUn"},
  {id:127, numeric: true, abbrid:null, show:false, label: "PolicBudgPerPop"},
  {id:128, numeric: true, abbrid:null, show:true, label: "murders"},
  {id:129, numeric: true, abbrid:null, show:false, label: "murdPerPop"},
  {id:130, numeric: true, abbrid:null, show:true, label: "rapes"},
  {id:131, numeric: true, abbrid:null, show:false, label: "rapesPerPop"},
  {id:132, numeric: true, abbrid:null, show:true, label: "robberies"},
  {id:133, numeric: true, abbrid:null, show:false, label: "robbbPerPop"},
  {id:134, numeric: true, abbrid:null, show:true, label: "assaults"},
  {id:135, numeric: true, abbrid:null, show:false, label: "assaultPerPop"},
  {id:136, numeric: true, abbrid:null, show:true, label: "burglaries"},
  {id:137, numeric: true, abbrid:null, show:false, label: "burglPerPop"},
  {id:138, numeric: true, abbrid:null, show:true, label: "larcenies"},
  {id:139, numeric: true, abbrid:null, show:false, label: "larcPerPop"},
  {id:140, numeric: true, abbrid:null, show:true, label: "autoTheft"},
  {id:141, numeric: true, abbrid:null, show:false, label: "autoTheftPerPop"},
  {id:142, numeric: true, abbrid:null, show:true, label: "arsons"},
  {id:143, numeric: true, abbrid:null, show:false, label: "arsonsPerPop"},
  {id:144, numeric: true, abbrid:null, show:true, label: "ViolentCrimesPerPop"},
  {id:145, numeric: true, abbrid:null, show:true, label: "nonViolPerPop"},
  {id:146, numeric: true, abbrid:null, show:false, label: "geojson"},
  {id:147, numeric: true, abbrid:null, show:true, label: "lat"},
  {id:148, numeric: true, abbrid:null, show:true, label: "lon"},
  {id:149, numeric: true, abbrid:null, show:true, label: "isState"}
];

/* **********  **********  **********  **********  **********  **********  **********  **********  */

class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("Rendering datatable");

    var specialmessage = null;
    if (this.props.dbCount === INIT_COUNT) {
      specialmessage = "Select a Dataset";
    }
    if (this.props.dbCount === NOT_A_DB) {
      specialmessage = "File is not a DB"
    }

    var headingrow = headCells.map((cell) => {
      if (cell.show) {
        return (
          <TableCell key={cell.label}><Typography fontWeight={"bold"}>{cell.label}</Typography></TableCell>
        )
      }
    })

    /* Generate Table */
    var listrows = []
    if (this.props.dbRows && this.props.dbRows.rows !== undefined) {
      listrows = this.props.dbRows.rows.map((city) => {
        var fontstyle = city[149] ? "blue" : "green";
        var rows = headCells.map((cell) => {
          if (cell.id === 0) {
            return (
              <TableCell key={`${city}[0]`} style={{border:"1px solid silver", color:{fontstyle}}}>
                <b>{city[cell.id]}</b>
              </TableCell>
            )
          }
          else if (cell.show) {
            return (
              <TableCell key={`${city}[${cell.id}`} style={{border:"1px solid silver", color:{fontstyle}}}>
                {city[cell.id]}
              </TableCell>
            )
          }
        })
        return (
          <TableRow key={`${city}`}>
            {rows}
          </TableRow>
        )
      });
    }
    
    return (
      <React.Fragment> 
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
        <Typography fontStyle={"italic"} variant="subtitle1">{specialmessage}</Typography>
      </React.Fragment>
    );
  }
}

class DbFilesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("Rendering files list");
    var listfiles = <Typography>Looking for database...</Typography>
    if (this.props.dbfiles && this.props.dbfiles.length) {
      listfiles = this.props.dbfiles.map((file) => {
        return (
          <ListItem key={file} value={file} size="small" aria-label="Listed File">
            <ListItemButton onClick={() => {this.props.g(file)}}>
              <DescriptionIcon/> <ListItemText primary={file}  />
            </ListItemButton>
          </ListItem>
        )
      });
    }
    else {
      return (
        <ListItem value={""} size="small" aria-label="No files">
          <Typography><i>No DB files</i></Typography>
        </ListItem>
      )
    }

    return (
      <List key="omg">
        {listfiles}
      </List>
    );
  }
}

const MyDatasets = () => {
  const [loaded, setLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [dbFiles, setDbfiles] = useState(null);
  const [dbRows, setDbrows] = useState([]);
  const [dbCount, setDbCount] = useState(INIT_COUNT);

  const fetchDBFiles = () => {
    fetch('http://localhost:' + SERVERSIDEPORT + '/mapData')
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        console.log('200: My Datasets');
        return res.json(); // Becomes the map data
      }
      else {
        console.log(res.status + ': My Datasets');
        return res.json();
      }
    })
    .then(res => {
      setDbfiles(res);
      setLoaded(true);
      setCount(count + 1);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const fetchDatabase = (dbname) => {
    console.log("Fetching from source " + dbname);
    fetch('http://localhost:' + SERVERSIDEPORT + '/mapData?allLevel&datasetID=' + dbname)
      .then(function (res) {
        console.log(res);
        if (res.status === 200) {
          console.log('200: My Datasets');
          return res.json(); // Becomes the map data
        }
        else {
          console.log(res.status + ': My Datasets');
          throw Error("Response not of correct format: Response does not have rows field");
        }
      })
      .then(res => {
        setDbrows({rows: res.rows, amount: res.rows.length});
        setDbCount(res.rows.length);
      })
      .catch(error => {
        console.warn(error);
      })
  }

  useEffect(() => { 
    document.title = `My Datasets`;
    console.log(`Loaded MyDatasets page (${dbCount})`)
    if (!loaded) {
      fetchDBFiles();
    }
  });
  
  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '75px', marginLeft: '300px' }}>
        <h1>My Datasets</h1>
        <Typography>Display a table of crime data.</Typography>
        <DbFilesList dbfiles={dbFiles} f={setDbfiles} g={fetchDatabase} />
        <DatasetTable dbRows={dbRows} dbCount={dbCount}/>
      </div>
    </React.Fragment>
  )
}

export default MyDatasets;