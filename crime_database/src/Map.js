import L from 'leaflet';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useState } from 'react';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const Map = () => {
    const [loaded, setLoaded] = useState(false);
    const [markers, setMarkers] = useState(null);
    const [stateMarkers, setStateMarkers] = useState(null);
    // TODO: Mack will pass in dataset name here as a prop
    const dataset = "crime.db";
    var zoomLevel = 10;

    const MapControllerComponent = () => {
        const map = useMapEvents({
        zoomend: () => {
            zoomLevel = map.getZoom();
            console.log(zoomLevel);
        },
        })
        return null
      }
    React.useEffect(() => {
        fetch('http://localhost:3000/mapData?datasetID=' + dataset)
        .then(function(res) {
            if (res.status === 200) {
                return res.json();
            }
        }).then(mapData => {
            var locations = []
            console.log(mapData);
            for (var i = 0; i < mapData.rows.length; i++) {
                // console.log("Locations: " + mapData.rows[i].latitude + ", " + mapData.rows[i].longitude);
                locations.push({
                    "lat": mapData.rows[i][147],
                    "lon": mapData.rows[i][148],
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
                    "boundingBox": mapData.rows[i][146]
                })
            }
            console.log('markers set')
            setMarkers(locations);
            setLoaded(true);
        });

        // fetch('http://localhost:3000/mapData?stateLevel&datasetID=' + dataset)
        // .then(function(res) {
        //     if (res.status === 200) {
        //         return res.json();
        //     }
        // }).then(mapData => {
        //     var locations = []
        //     for (var i = 0; i < mapData.rows.length; i++) {
        //         locations.push({
        //             "lat": mapData.rows[i][148],
        //             "lon": mapData.rows[i][149],
        //             "cityname": mapData.rows[i][1],
        //             "population": mapData.rows[i][5],
        //             "populationDensity": mapData.rows[i][121],
        //             "murders": mapData.rows[i][129],
        //             "robberies": mapData.rows[i][133],
        //             "assaults": mapData.rows[i][135],
        //             "burglaries": mapData.rows[i][137],
        //             "larcenies": mapData.rows[i][139],
        //             "autoTheft": mapData.rows[i][141],
        //             "arson": mapData.rows[i][143],
        //             "boundingBox": mapData.rows[i][147]
        //         })
        //     }
        //     setStateMarkers(locations);
        //     setLoaded(true);
        // });
    }, []);

    return (
        <MapContainer center={[40.762730914502896, -73.97376139655083]} zoom={10} scrollWheelZoom={false}>
            <MapControllerComponent />
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {loaded && markers.length > 0 && 
            markers.map((location) => {
                const purpleOptions = { colour: 'purple' }

                const polygon = JSON.parse(location.boundingBox);
                
                // console.log(polygon)
                
                return(<Polygon pathOptions={purpleOptions} positions={polygon} key={location.cityname} className="statePolygon">
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

export default Map;
