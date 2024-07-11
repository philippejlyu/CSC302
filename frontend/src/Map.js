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
        console.log("Map: Controller");
        const loadStateMarkers = () => {
            console.log("Map: Loaded state markers on demand");
            fetchMapStateData();
        }

        const map = useMapEvents({
            zoomend: () => {
                console.log(`Map: Zoom (${map.getZoom()})`);
                if (markers && !stateMarkers) {
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

    const updateMap = (datset = dataset) => {
        console.log("Map: Updated");
        if (!datset) {
            setMarkers([]);
            setStateMarkers([]);
            setLoaded(true);
            console.log(`Currently not feteching with any data (${datset === "" ? "ε" : datset})`);
            return;
        }
        fetchMapData(datset);
    }

    const fetchMapData = (datset) => {
        if (!datset) {
            console.error(`Currently not feteching with any data (${datset === "" ? "ε" : datset})`);
            return;
        }
        const fetchURL = 'http://localhost:3000/mapData?datasetID=' + datset;
        fetch(fetchURL)
            .then(function (res) {
                if (res.status === 200) {
                    console.log('200: Map Cities');
                    return res.json();
                }
                else {
                    console.log(res.status + ': Map Cities');
                    throw Error("Response not of correct format: Response does not have rows field");
                }
            }).then(mapData => { 
                var locations = []
                console.log(mapData);
                for (var i = 0; i < mapData.rows.length; i++) {
                    // Handle edge cases for missing data
                    var lat = mapData.rows[i][147];
                    var lon = mapData.rows[i][148];
                    var geo = mapData.rows[i][146];
                    if (!lat || !lon || !geo) {
                        console.error(`Error processing mapdata information: ${mapData.rows[i][0]} ; ${lat} ; ${lon} ; ${!geo ? "[0]" : "[" + geo.length + "]"}`);
                        continue;
                    }
                    locations.push({
                        "lat": mapData.rows[i][147], // Must be present
                        "lon": mapData.rows[i][148], // Must be present
                        "cityname": mapData.rows[i][0],
                        "population": mapData.rows[i][4],
                        "populationDensity": mapData.rows[i][120],
                        "murders": mapData.rows[i][128],
                        "rapes": mapData.rows[i][130],
                        "robberies": mapData.rows[i][132],
                        "assaults": mapData.rows[i][134],
                        "burglaries": mapData.rows[i][136],
                        "larcenies": mapData.rows[i][138],
                        "autoTheft": mapData.rows[i][140],
                        "arson": mapData.rows[i][142],
                        "boundingBox": mapData.rows[i][146], // Must be present
                        "id": i
                    })
                }
                setMarkers(locations);
                setDataset(datset);
                setLoaded(true);
            }).catch(error => {
                console.warn(error);
            });
    }

    const fetchMapStateData = () => {
        fetch('http://localhost:3000/mapData?stateLevel&datasetID=' + dataset)
        .then(function (res) {
            if (res.status === 200) {
                console.log('200: Map States');
                return res.json();
            }
        }).then(mapData => {
            var stateLocations = []
            for (var i = 0; i < mapData.rows.length; i++) {
                // Handle edge cases for missing data
                var geo = mapData.rows[i][146];
                if (!geo) {
                    console.error(`Error processing mapdata information: ${mapData.rows[i][0]} ; ${!geo ? "[0]" : "[" + geo.length + "]"}`);
                    continue;
                }
                stateLocations.push({
                    "lat": mapData.rows[i][147],
                    "lon": mapData.rows[i][148],
                    "cityname": mapData.rows[i][0],
                    "population": mapData.rows[i][4],
                    "populationDensity": mapData.rows[i][120],
                    "murders": mapData.rows[i][128],
                    "rapes": mapData.rows[i][130],
                    "robberies": mapData.rows[i][132],
                    "assaults": mapData.rows[i][134],
                    "burglaries": mapData.rows[i][136],
                    "larcenies": mapData.rows[i][138],
                    "autoTheft": mapData.rows[i][140],
                    "arson": mapData.rows[i][142],
                    "boundingBox": geo,
                    "id": "stateLevel" + i
                })
            }
            setStateMarkers(stateLocations);
            setLoaded(true);
        }).catch(error => {
            console.warn(error);
        });
    }

    const generatePolygon = (location, isState) => {
        // let violentPerPop = 0;
        // for (var k = 0; k < stats.length && violentPerPop !== NaN; k++) {
        //     violentPerPop += location[stats[k]];
        //     if (!location[stats[k]] && location[stats[k]] !== 0) {
        //         violentPerPop = NaN;
        //     }
        // }
        // violentPerPop /= location.population;
        let violentPerPop = (location.murders + location.assaults)/location.population;
        console.log(isState)
        console.log('Is state')
        if (isState) {
            var purpleOptions = {}
            if (isNaN(violentPerPop)) {
                purpleOptions = { fillColor: 'gray', color: 'gray' }
            }
            else if(violentPerPop < 0.003){
                purpleOptions = { fillColor: 'green', color:'green' }
            }
            else if(violentPerPop >= 0.003 && violentPerPop < 0.005){
                purpleOptions = { fillColor: 'yellow', color: '#fcdb03'}
            }
            else if(violentPerPop >= 0.005 && violentPerPop < 0.007){
                purpleOptions = { fillColor: 'orange', color: 'orange' }
            }
            else if(violentPerPop >= 0.007){
                purpleOptions = { fillColor: 'red', color: 'red' }
            }
        } else {
            if (isNaN(violentPerPop)) {
                purpleOptions = { fillColor: 'gray', color: 'gray' }
            }
            else if(violentPerPop < 0.003){
                purpleOptions = { fillColor: 'green', color:'green' }
            }
            else if(violentPerPop >= 0.003 && violentPerPop < 0.005){
                purpleOptions = { fillColor: 'yellow', color: '#fcdb03'}
            }
            else if(violentPerPop >= 0.005 && violentPerPop < 0.007){
                purpleOptions = { fillColor: 'orange', color: 'orange' }
            }
            else if(violentPerPop >= 0.007){
                purpleOptions = { fillColor: 'red', color: 'red' }
            }
        }

        const polygon = JSON.parse(location.boundingBox);

        return (<Polygon pathOptions={purpleOptions} positions={polygon} key={location.id}>
            <Popup>
                <center><b>{location.cityname}</b></center><br />
                <b>Population:</b> {location.population}<br />
                <b>Population Density:</b> {location.populationDensity}<br />
                <table>
                    <tr><td><b>Murders:</b></td><td> {location.murders} ({!location.murders && location.murders !== 0 ? "N/A" :  (location.murders/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Rapes:</b></td><td> {location.rapes} ({!location.rapes && location.rapes !== 0 ? "N/A" :  (location.rapes/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Robberies:</b></td><td> {location.robberies} ({!location.robberies && location.robberies !== 0 ? "N/A" :  (location.robberies/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Assaults:</b></td><td> {location.assaults} ({!location.assaults && location.assaults !== 0 ? "N/A" :  (location.assaults/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Burglaries:</b></td><td> {location.burglaries} ({!location.burglaries && location.burglaries !== 0 ? "N/A" :  (location.burglaries/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Larcenies:</b></td><td> {location.larcenies} ({!location.larcenies && location.larcenies !== 0 ? "N/A" :  (location.larcenies/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Auto Theft:</b></td><td> {location.autoTheft} ({!location.autoTheft && location.autoTheft !== 0 ? "N/A" :  (location.autoTheft/location.population*100000).toFixed(2)}/100000)</td></tr>
                    <tr><td><b>Arsons:</b></td><td> {location.arson} ({!location.arson && location.arson !== 0 ? "N/A" :  (location.arson/location.population*100000).toFixed(2)}/100000)</td></tr>
                </table>
            </Popup>

        </Polygon>)
    }

    if (dataset != props.dbFiles) {
        console.log("Reloading map with dataset " + props.dbFiles);
        setLoaded(false);
        setDataset(props.dbFiles);
        setMarkers(null);
        setStateMarkers(null);
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
                    return generatePolygon(location, false);
                })}
            {/* State data */}
            {loaded && showStates && stateMarkers &&
                stateMarkers.map((location) => {
                    return generatePolygon(location, true);
                })}
        </MapContainer>
    );
}

export default Map;
