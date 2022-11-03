import L from 'leaflet';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
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
        // TODO: Take locations from rest api
        const locations = [{
            "lat": 43.83892,
            "lon": -79.38338,
            "name": "Qualcomm"
        },
        {
            "lat": 43.83932307332953,
            "lon": -79.37992873760615,
            "name": "AMD"
        },
        {
            "lat": 43.84047298186827,
            "lon": -79.37932548774376,
            "name": "CAA Travel"
        },
        {
            "lat": 43.84181967101403,
            "lon": -79.38076178308928,
            "name": "Mariott 1"
        },
        {
            "lat": 43.84195435370095,
            "lon": -79.37956967370914,
            "name": "Mariott 2"
        },
        {
            "lat": 43.84170561832021,
            "lon": -79.37375274146041,
            "name": "Lisa's Cosmetics"
        }]
        this.setState({markers: locations});
    }

    render () {
        return (
            <MapContainer center={[43.83878, -79.37967]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.state.markers.length > 0 && 
                this.state.markers.map((location) => {

                    return(<Marker position={[location.lat, location.lon]}>
                        <Popup>
                        {location.name}
                        </Popup>
                    </Marker>)
            })}
            
            </MapContainer>
          );
    }
}

export default Map;
