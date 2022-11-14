import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import SideBar from "./SideBar";
import * as ReactDOM from 'react-dom';

const ImportData = () => {

    function handleChange(event) {
        let file = event.target.files[0];
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
    
        formData.append("file", file);
    
        axios.post(url, formData).then((res) => {
            console.log(res);
            let el = document.getElementById("main-page");
            const el2 = document.createElement("h4");
            el2.innerHTML = 'Success!';
            el2.style.color = 'green';
            ReactDOM.findDOMNode(el).append(el2);
        }).catch((err) => {
            console.warn(err);
            let el = document.getElementById("main-page");
            const el2 = document.createElement("h4");
            el2.innerHTML = 'Error! Please try again.';
            el2.style.color = 'red';
            ReactDOM.findDOMNode(el).append(el2);
        });
      }

    return(
        <React.Fragment>
        <SideBar></SideBar>
        <div id='main-page' style={{marginTop:'75px', marginLeft: '300px'}}>
        <h1>Import Dataset</h1>
        <h3>Please upload a CSV file:</h3>
      <Button variant="contained" component="label">
        Upload
        <input hidden accept=".csv" type="file" onChange={handleChange}/>
      </Button>
      </div>
      </React.Fragment>
    )
}

export default ImportData;