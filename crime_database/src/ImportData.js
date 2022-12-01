import React from "react";
import { Button } from "@mui/material";
import axios from "axios";
import SideBar from "./SideBar";
import * as ReactDOM from 'react-dom';
import CSVImg from './images/csv.png';
import ExcelImg from './images/excel.png';

const ImportData = () => {

    function dragEnter(event){
      event.preventDefault();
      let el = document.getElementById('main-page');
      el.style.backgroundColor = 'LightGray';
    }
    function dragExit(event){
      event.preventDefault();
      let el = document.getElementById('main-page');
      el.style.backgroundColor = 'White';
    }
    function handleChange(event) {
      event.preventDefault();
      var files = [];
        if(event.type === "drop"){
          let el = document.getElementById('main-page');
          el.style.backgroundColor = 'White';
          files = event.dataTransfer.files;
        }
        else if(event.type === "change"){
          files = event.target.files;
        }
        const url = 'http://localhost:5000/upload';
        const formData = new FormData();
    
        for(let i = 0; i < files.length; i++){
          formData.append('file'+(i+1), files[i]);
        }
        let el = document.getElementById("upload-button");
        let status = document.createElement("h4");
        status.setAttribute("id", "status");
        status.innerHTML = "Uploading...";
        if(document.getElementById("status") == null){
          ReactDOM.findDOMNode(el).after(status);
        }
        else{
          ReactDOM.findDOMNode(document.getElementById("status")).replaceWith(status);
        }
        axios.post(url, formData).then((res) => {
            console.log(res);
            let el = document.getElementById("status");
            el.innerHTML = 'Success!';
            el.style.color = 'green';
            for(let i = 0; i < files.length; i++){
              let el = document.getElementById("center-items");
              let rowEl = document.createElement("div");
              let fileEl = document.createElement("img");
              let textEl = document.createElement("h4");
              textEl.innerHTML = files[i].name;
              if(files[i].name.endsWith(".csv")){
                fileEl.src = CSVImg;
              }
              else{
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

    return(
        <React.Fragment>
        <SideBar></SideBar>
        <div id='main-page' style={{marginTop:'75px', marginLeft: '300px', marginRight:'30px', borderStyle: 'dashed', borderRadius: '30px', minHeight: '89vh'}} onDragOver={dragEnter} onDragLeave={dragExit} onDrop={handleChange}>
          <div ></div>
          <div id='center-items' style={{display:'grid', placeItems:'center', marginTop: '175px'}}>
          <h1>Import Datasets</h1>
          <h3>Please upload spreadsheets:</h3>
          <Button id="upload-button" variant="contained" component="label">
            Upload
            <input hidden multiple accept=".csv, .xlsx" type="file" onChange={handleChange}/>
          </Button>
          </div>
      </div>
      </React.Fragment>
    )
}

export default ImportData;