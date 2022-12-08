from flask import Flask, request, send_from_directory, jsonify, Response
from flask_cors import CORS, cross_origin
import os
import json
import re
import requests
import sqlite3
from time import sleep
from typing import *
import pandas as pd

# Debug:
# app = Flask(__name__, static_folder='')
# Docker:
app = Flask(__name__, static_folder='build')
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
DBFOLDER = "db/"
SERVERSIDEPORT = 3000
GEOLIM = None

def getGeoJSON(city: str, state: str) -> List:
    print("Getting GeoJSON")
    # Get geojson
    params = {
        "limit": GEOLIM,
        "format": "json",
        "polygon_geojson": 1,
        "city": city,
        "country": "United States",
        "state": state
    }
    
    requestURL = 'https://nominatim.openstreetmap.org/search'

    r = requests.get(requestURL, params=params)
    # Want to add the following to the data
    
    try:
        data = r.json()[0]
        lat = float(data['lat'])
        lon = float(data['lon'])
        geographicalJson = []

        if data['geojson']['type'] == 'Polygon':
            geojson = data['geojson']['coordinates'][0]
            for i in range(len(geojson)):
                tmp_lat = geojson[i][1]
                tmp_lon = geojson[i][0]

                if tmp_lat > 0:
                    geographicalJson.append([tmp_lat, tmp_lon])
                else:
                    geographicalJson.append([tmp_lon, tmp_lat])

        elif data['geojson']['type'] == 'MultiPolygon':
            for polygon in data['geojson']['coordinates']:
                polygon_arr = []
                for i in range(len(polygon[0])):
                    tmp_lat = polygon[0][i][1]
                    tmp_lon = polygon[0][i][0]
                    if tmp_lat > 0:
                        polygon_arr.append([tmp_lat, tmp_lon])
                    else:
                        polygon_arr.append([tmp_lon, tmp_lat])
                geographicalJson.append(polygon_arr)
        return lat, lon, geographicalJson
    except Exception as e:
        print(e)
        return 0,0,[]

def processDatabase(filename: str):
    # Command queue to avoid fetchone complications
    commandQueue = []

    # Add table columns
    print("Generating state data from {0:s}".format(filename))
    con = sqlite3.connect(DBFOLDER + filename)
    cur = con.cursor()
    addColumn = "ALTER TABLE locations ADD COLUMN geojson BLOB"
    cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lat FLOAT"
    cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lon FLOAT"
    cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN isState BOOLEAN"
    cur.execute(addColumn)

    # City-level information
    idx = 0
    states = []
    res = cur.execute("SELECT rowid, communityName, state FROM locations")
    row = res.fetchone()
    while row is not None and (not GEOLIM or idx <= GEOLIM):
        rowid = row[0]
        dirtyCityName = row[1]
        state = row[2]
        city = None

        # Known error: Location name will have suffix removed
        if 'city' in dirtyCityName:
            city = dirtyCityName.replace("city", "")
        elif 'township' in dirtyCityName:
            city = dirtyCityName.replace("township", "")
        elif 'village' in dirtyCityName:
            city = dirtyCityName.replace("village", "")
        elif 'town' in dirtyCityName:
            city = dirtyCityName.replace("town", "")
        elif 'borough' in dirtyCityName:
            city = dirtyCityName.replace("borough", "")
        elif 'division' in dirtyCityName:
            city = dirtyCityName.replace("division", "")
        elif 'district' in dirtyCityName:
            city = dirtyCityName.replace("district", "")
        else:
            city = dirtyCityName
        
        # Now add spaces before capitals if necessary
        city = re.sub(r"(\w)([A-Z])", r"\1 \2", str(city))
        print("{0:s}, {1:s}, {2:d}".format(city, state, idx))
        geographicalJson = getGeoJSON(city, state)
        print(geographicalJson[0], geographicalJson[1])
        # Put the sql commands in a queue because we processing them here causes issues with fetchone
        cmdstr = "UPDATE locations SET isState='%s', communityName='%s', lat=%.15f, lon=%.15f, geojson='%s' WHERE rowid=%d" % ("FALSE", city, geographicalJson[0], geographicalJson[1], str(geographicalJson[2]), rowid)
        commandQueue.append(cmdstr)

        # Next
        sleep(1)
        row = res.fetchone()
        idx += 1

    for command in commandQueue:
        cur.execute(command)
    print("Uploaded {0:d} city-level data.".format(idx))
    
    # State-level information
    idx = 0
    states = []
    sumCols = ['murders', 'rapes', 'robberies', 'assaults', 'burglaries', 'larcenies', 'autoTheft', 'arsons', 'ViolentCrimesPerPop', 'nonViolPerPop']
    res = cur.execute("SELECT DISTINCT state FROM locations")
    state = res.fetchone()
    while state:
        states.append(state[0])
        state = res.fetchone()

    for state in states:
        crimeData = [0]*len(sumCols)
        ethnCols = ['White', 'Black', 'Asian', 'Hisp']
        ethnData = [0, 0, 0, 0]
        ageCols = ['12t21', '12t29', '16t24', '65up']
        ageData = [0, 0, 0, 0]
        for i in range(len(sumCols)):
            res = cur.execute("SELECT SUM(%s) FROM locations WHERE state='%s'" % (sumCols[i], state))
            row = res.fetchone()
            crimeData[i] += row[0]
            
        # Calculate state pop density
        res = cur.execute("SELECT SUM(population) FROM locations WHERE state='%s'" % (state))
        statePop = res.fetchone()[0]
        if not statePop:
            statePop = 0

        res = cur.execute("SELECT SUM(LandArea) FROM locations WHERE state='%s'" % (state))
        stateArea = res.fetchone()[0]
        popDensity = -1
        if stateArea:
            popDensity = statePop / stateArea

        # Calculate race and age pop from percentage            
        for i in range(len(ethnCols)):
            res = cur.execute("SELECT racePct%s, population FROM locations WHERE state='%s'" % (ethnCols[i], state))
            row = res.fetchone()
            while row is not None:
                townPop = row[1]
                if townPop and row[0]:
                    ethnData[i] += (row[0] * townPop)
                row = res.fetchone()
            if townPop:
                ethnData[i] /= townPop
        
        for i in range(len(ageCols)):
            res = cur.execute("SELECT agePct%s, population FROM locations WHERE state='%s'" % (ageCols[i], state))
            row = res.fetchone()
            while row is not None:
                townPop = row[1]
                if townPop and row[0]:
                    ageData[i] += (row[0] * townPop)
                row = res.fetchone()
            if townPop:
                ageData[i] /= townPop

        # Get geojson
        geojson = getGeoJSON("", state)

        # Insert state data
        cmdstr = "INSERT INTO locations (CommunityName, isState, population, LandArea, PopDens, racePctWhite, racePctBlack, racePctAsian, racePctHisp, agePct12t21, agePct12t29, agePct16t24, agePct65up, murders, rapes, robberies, assaults, burglaries, larcenies, autoTheft, arsons, lat, lon, geojson) " \
            "VALUES ('%s', TRUE, %d, %d, %f, %f, %f, %f, %f, %f, %f, %f, %f, %d, %d, %d, %d, %d, %d, %d, %d, %.15f, %.15f, '%s')" % (\
                state, statePop, stateArea, popDensity, ethnData[0], ethnData[1], ethnData[2], ethnData[3], ageData[0], ageData[1], ageData[2], ageData[3], \
                crimeData[0], crimeData[1], crimeData[2], crimeData[3], crimeData[4], crimeData[5], crimeData[6], crimeData[7], \
                geojson[0], geojson[1], str(geojson[2]))
        print(state, statePop, crimeData[6], crimeData[7], geojson[0], geojson[1])
        cur.execute(cmdstr)

        print(state)
        idx += 1
    
    print("Uploaded {0:d} state-level data.".format(idx))

    con.commit()
    con.close()
    
# BACKEND ROUTES #
@app.route("/upload", methods=["POST"])
@cross_origin()
def create_database():
    files = list(request.files.keys())
    for file_key in files: 
        file = request.files[file_key]
        file.save(file.filename)
        filename = file.filename[:file.filename.index('.')]
        # Conversion
        if file.filename.endswith('.xlsx'):
            excel_file = pd.read_excel(file.filename)
            excel_file.to_csv(filename + ".csv", index=None, header=True)
            os.remove(file.filename)
        # Perform csv extraction
        try:
            os.remove(DBFOLDER + filename + ".db")
        except FileNotFoundError:
            print("File removed or doesn't exist")
        except OSError as e:
            print(e)
        cmd = f"sqlite-utils insert \"{DBFOLDER}{filename}.db\" locations \"{filename+'.csv'}\" --csv -d"
        print("DB Creation:\t", cmd)
        os.system(cmd)
        os.remove(filename + '.csv')
        processDatabase(filename + ".db")
        cmd = f"mv \"{DBFOLDER}{filename}.part\" \"{DBFOLDER}{filename}.db\""
    return "Successful"

@app.route('/mapData', methods=['GET'])
@cross_origin()
def getMapData():
    # Parse parameters
    print("Recieved request", request, request.args)
    params = request.args
    if 'datasetID' in params:
        datset = params['datasetID']
        if not datset or datset == "null":
            return Response("Null dataset", 300)
        
        # Get sql data
        con = sqlite3.connect(DBFOLDER + datset)
        cur = con.cursor()
        # State level
        try:
            if 'stateLevel' in params:
                res = cur.execute("SELECT * FROM locations WHERE isState=TRUE")
            elif 'allLevel' in params:
                res = cur.execute("SELECT * FROM locations")
            else:
                res = cur.execute("SELECT * FROM locations WHERE isState<>TRUE OR isState IS NULL")
        except sqlite3.DatabaseError as e:
            print(datset + " is not a valid .db file.")
            return Response(datset + " not a valid .db file", 418)

        # Append data
        row = res.fetchone()
        data = []
        while row is not None:
            data.append(row)
            row = res.fetchone()
        con.close()

        return jsonify({"rows": data})
    else:
        dbfiles = os.listdir(DBFOLDER)
        print(dbfiles)
        return jsonify(dbfiles)
        # Log this

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@cross_origin()
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
if __name__ == "__main__":
    print("The App static folder is {0:s}".format(app.static_folder));
    app.run(debug=True, host='0.0.0.0', port=SERVERSIDEPORT)