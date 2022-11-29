import L from 'leaflet';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React from 'react';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends React.Component {
    state = { markers: [] };


    componentDidMount() {

        fetch('http://localhost:3000/mapData')
        .then(function (res) {
            console.log(res);
            if (res.status === 200) {
                console.log('res 200')
                return res.json()
            }
        })
        .then(mapData => {
            var locations = []
            for (let i = 0; i < 100; i++) {
                // console.log(mapData.rows[i][147])
                locations.push({
                    "lat": mapData.rows[i][148],
                    "lon": mapData.rows[i][149],
                    "cityname": mapData.rows[i][1],
                    "population": mapData.rows[i][5],
                    "populationDensity": mapData.rows[i][121],
                    "murders": mapData.rows[i][129],
                    "robberies": mapData.rows[i][133],
                    "assaults": mapData.rows[i][135],
                    "burglaries": mapData.rows[i][137],
                    "larcenies": mapData.rows[i][139],
                    "autoTheft": mapData.rows[i][141],
                    "arson": mapData.rows[i][143],
                    "boundingBox": mapData.rows[i][147]
                })
        }
        this.setState({markers: locations});
        })
        .catch(error => {
            console.log(error);
        })
    }

    render () {
        return (
            <MapContainer center={[40.762730914502896, -73.97376139655083]} zoom={10} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.state.markers.length > 0 && 
                this.state.markers.map((location) => {
                    const purpleOptions = { colour: 'purple' }

                    const polygon = JSON.parse(location.boundingBox);
                    
                    // console.log(polygon)
                    
                    return(<Polygon pathOptions={purpleOptions} positions={polygon} key={location.cityname}>
                        <Popup>
                         <center><b>{location.cityname}</b></center><br></br>
                         Population: {location.population}<br></br>
                         Population Density: {location.populationDensity}<br></br>
                         Murders: {location.murders}<br></br>
                         Robberies: {location.robberies}<br></br>
                         Assaults: {location.assaults}<br></br>
                         Burglaries: {location.burglaries}<br></br>
                         Larcenies: {location.larcenies}<br></br>
                         Auto Theft: {location.autoTheft}<br></br>
                         Arsons: {location.arson}
                         </Popup>

                    </Polygon>)
                    
            })}
            
            </MapContainer>
          );
    }
}

export default Map;
