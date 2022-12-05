import L from 'leaflet';
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from 'react-leaflet'
import './App.css'
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import React, { useState, useEffect } from 'react';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = (props) => {
    const [loaded, setLoaded] = useState(false);
    const [dataset, setDataset] = useState(props.dbFiles);
    const [markers, setMarkers] = useState(null);
    const [stateMarkers, setStateMarkers] = useState(null);
    const [showStates, setShowStates] = useState(false); 

    const MapControllerComponent = () => {
        console.log("Controller");
        const loadStateMarkers = () => {
            console.log("Map: Loaded state markers on demand");
            fetch('http://localhost:3000/mapData?stateLevel&datasetID=' + dataset)
                .then(function (res) {
                    if (res.status === 200) {
                        return res.json();
                    }
                }).then(mapData => {
                    var stateLocations = []
                    for (var i = 0; i < mapData.rows.length; i++) {
                        stateLocations.push({
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
                            "boundingBox": mapData.rows[i][146],
                            "id": "stateLevel" + i
                        })
                    }
                    setStateMarkers(stateLocations);
                    setLoaded(true);
                });
        }

        const map = useMapEvents({
            zoomend: () => {
                if (stateMarkers == null) {
                    loadStateMarkers();
                }
                // Toggle when zoom crosses level 8
                if (map.getZoom() < 8 && !showStates) {
                    setShowStates(true);
                } else if (map.getZoom() >= 8 && showStates) {
                    setShowStates(false);
                }
            },
        })
        
        return null
    }

    const updateMap = (datset=dataset) => {
        console.log("Map use Effect " + datset);
        if (!datset) {
            setMarkers([]);
            setLoaded(true);
        }
        const fetchURL = 'http://localhost:3000/mapData?datasetID=' + datset;
        fetch(fetchURL)
            .then(function (res) {
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
                        "boundingBox": mapData.rows[i][146],
                        "id": i
                    })
                }
                setMarkers(locations);
                setDataset(datset);
                setLoaded(true);
            });
    }

    if (dataset != props.dbFiles) {
        console.log("Reloading map with dataset " + props.dbFiles);
        setLoaded(false);
        setDataset(props.dbFiles);
        setMarkers(null);
        setShowStates(false);
        updateMap(props.dbFiles);
    }
    
    React.useEffect(updateMap, []);

    return (
        <MapContainer center={[40.762730914502896, -73.97376139655083]} zoom={10} scrollWheelZoom={true}>
            <MapControllerComponent />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* City data */}
            {loaded && !showStates && markers && markers.length > 0 &&
                markers.map((location) => {
                    let violentPerPop = (location.murders + location.assaults) / location.population;
                    var purpleOptions = {}
                    if (violentPerPop < 0.003) {
                        purpleOptions = { fillColor: 'green', color: 'green' }
                    }
                    else if (violentPerPop >= 0.003 && violentPerPop < 0.005) {
                        purpleOptions = { fillColor: 'yellow', color: '#fcdb03' }
                    }
                    else if (violentPerPop >= 0.005 && violentPerPop < 0.007) {
                        purpleOptions = { fillColor: 'orange', color: 'orange' }
                    }
                    else if (violentPerPop >= 0.007) {
                        purpleOptions = { fillColor: 'red', color: 'red' }
                    }

                    const polygon = JSON.parse(location.boundingBox);


                    return (<Polygon pathOptions={purpleOptions} positions={polygon} key={location.id}>
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
            {/* State data */}
            {loaded && showStates && stateMarkers.length > 0 &&
                stateMarkers.map((location) => {
                    let violentPerPop = (location.murders + location.assaults) / location.population;
                    var purpleOptions = {}
                    if (violentPerPop < 0.003) {
                        purpleOptions = { fillColor: 'green', color: 'green' }
                    }
                    else if (violentPerPop >= 0.003 && violentPerPop < 0.005) {
                        purpleOptions = { fillColor: 'yellow', color: '#fcdb03' }
                    }
                    else if (violentPerPop >= 0.005 && violentPerPop < 0.007) {
                        purpleOptions = { fillColor: 'orange', color: 'orange' }
                    }
                    else if (violentPerPop >= 0.007) {
                        purpleOptions = { fillColor: 'red', color: 'red' }
                    }
                    const polygon = JSON.parse(location.boundingBox);

                    return (<Polygon pathOptions={purpleOptions} positions={polygon} key={location.id}>
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
