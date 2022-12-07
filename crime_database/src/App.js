import './App.css';
import React from 'react';
import ImportData from './ImportData';
import MyDatasets from './MyDatasets';
import Visualize from './Visualize';
import {BrowserRouter, Route, Routes} from "react-router-dom";

export const SERVERSIDEPORT = 3000;
function App() {
  console.log(`CrimeTracker React App Started`);
  document.title = "CrimeTracker";
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImportData/>} />
          <Route path="/datasets" element={<MyDatasets/>} />
          <Route path="/visualize" element={<Visualize/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;