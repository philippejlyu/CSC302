import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import SideBar from "./SideBar";
import * as ReactDOM from 'react-dom';
import CSVImg from './images/csv.png';
import ExcelImg from './images/excel.png';
import { SERVERSIDEPORT } from './App.js';

const ImportData = () => {
  function dragEnter(event) {
    event.preventDefault();
    let el = document.getElementById('main-page');
    el.style.backgroundColor = 'LightGray';
  }
  function dragExit(event) {
    event.preventDefault();
    let el = document.getElementById('main-page');
    el.style.backgroundColor = 'White';
  }
  function handleChange(event) {
    event.preventDefault();
    var files = [];

    /* Handle event tyle */
    if (event.type === "drop") {
      let el = document.getElementById('main-page');
      el.style.backgroundColor = 'White';
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        let file = event.dataTransfer.files[i];
        if (file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
          files.push(file);
        }
        else {
          let el = document.getElementById("status");
          el.innerHTML = 'Please import a .csv or .xlsx file';
          el.style.color = 'gray';
        }
      }
    }
    else if (event.type === "change") {
      files = event.target.files;
    }

    /* Update and show status */
    if (files.length > 0) {
      const url = 'http://localhost:' + SERVERSIDEPORT + '/upload';
      console.log(url);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('file' + (i + 1), files[i]);
      }
      let el = document.getElementById("upload-button");
      let status = document.getElementById("status");
      status.setAttribute("id", "status");
      status.style.color = 'gray';
      status.innerHTML = "Uploading...";
      if (document.getElementById("status") == null) {
        ReactDOM.findDOMNode(el).after(status);
      }
      else {
        ReactDOM.findDOMNode(document.getElementById("status")).replaceWith(status);
      }

      axios.post(url, formData).then((res) => {
        console.log(res);
        // Change status display
        let el = document.getElementById("status");
        el.innerHTML = 'Success!';
        el.style.color = 'green';
        // Display file added
        for (let i = 0; i < files.length; i++) {
          let el = document.getElementById("center-items");
          let rowEl = document.createElement("div");
          let fileEl = document.createElement("img");
          let textEl = document.createElement("h3");
          textEl.innerHTML = files[i].name;
          if (files[i].name.endsWith(".csv")) {
            fileEl.src = CSVImg;
          }
          else {
            fileEl.src = ExcelImg;
          }
          fileEl.style.alignSelf = "center";
          rowEl.style.display = 'flex';
          rowEl.style.marginTop = "5px";
          rowEl.append(fileEl, textEl);
          ReactDOM.findDOMNode(el).append(rowEl);
        }
      }).catch((err) => {
        console.warn(err);
        let el = document.getElementById("status");
        el.innerHTML = 'Error! Please try again.';
        el.style.color = 'red';
      });
    }
  }

  return (
    <React.Fragment>
      <SideBar></SideBar>
      <div id='main-page' style={{ marginTop: '75px', marginLeft: '300px', marginRight: '30px', borderStyle: 'dashed', borderRadius: '30px', minHeight: '89vh' }} onDragOver={dragEnter} onDragLeave={dragExit} onDrop={handleChange}>
        <div ></div>
        <div id='center-items' style={{ display: 'grid', placeItems: 'center', marginTop: '175px' }}>
          <h1>Import Datasets</h1>
          <h2>Please select or drag and drop spreadsheets:</h2>
          <Button sx={{ bgcolor: '#673ab7' }} id="upload-button" variant="contained" component="label">
            Upload
            <input hidden multiple accept=".csv, .xlsx" type="file" onChange={handleChange} />
          </Button>
          <h2 id="status">...</h2>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ImportData;