import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar'
class SideBar extends Component {
    render(){
        return(
            <>
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
            </>
        )
    }
}

export default SideBar;