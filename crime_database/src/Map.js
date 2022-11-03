import L from 'leaflet';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React from 'react';
import mapData from './local_data.json';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends React.Component {
    state = { markers: [] };


    componentDidMount() {
        var locations = []
        for (let i = 0; i < mapData.rows.length; i++) {
            locations.push({
                "lat": mapData.rows[i][146],
                "lon": mapData.rows[i][147],
                "cityname": mapData.rows[i][0],
                "population": mapData.rows[i][4],
                "populationDensity": mapData.rows[i][120],
                "murders": mapData.rows[i][128],
                "robberies": mapData.rows[i][132],
                "assaults": mapData.rows[i][134],
                "burglaries": mapData.rows[i][136],
                "larcenies": mapData.rows[i][138],
                "autoTheft": mapData.rows[i][140],
                "arson": mapData.rows[i][142],
            })
        }
        console.log(mapData);
        this.setState({markers: locations});
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

                    return(<Marker position={[location.lat, location.lon]}>
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
                    </Marker>)
            })}
            
            </MapContainer>
          );
    }
}

export default Map;
