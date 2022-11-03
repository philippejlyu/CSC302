import logo from './logo.svg';
import './App.css';
import './SideBar.js';
import Dropdown from 'react-bootstrap/Dropdown';
import './Map.js'
import Map from './Map.js';

function App() {
  return (
    <div className="App">
      <Map />
      <div className="MapView">
      <Dropdown.Menu show>
                    <Dropdown.Header>My Datasets</Dropdown.Header>
                    <Dropdown.Item eventKey="2">Dataset A</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Dataset B</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Menu show>
                    <Dropdown.Header>Visualizations</Dropdown.Header>
                    <Dropdown.Item eventKey="2">Crime heat map</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Crime vs Population</Dropdown.Item>
                </Dropdown.Menu>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
