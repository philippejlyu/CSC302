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

def generateStateData(filename: str):
    con = sqlite3.connect(filename)
    cur = con.cursor()

    addColumn = "ALTER TABLE locations ADD COLUMN isState BOOLEAN"
    cur.execute(addColumn)


    res = cur.execute("SELECT DISTINCT state FROM locations")
    row = res.fetchone()
    states = []
    while row is not None:
        states.append(row[0])
        row = res.fetchone()

    print(states)
    

    for state in states:
        sumCols = ['murders', 'rapes', 'robberies', 'assaults', 'burglaries', 'larcenies', 'autoTheft', 'arsons']
        crimeData = [0, 0, 0, 0, 0, 0, 0, 0]
        ethnCols = ['White', 'Black', 'Asian', 'Hisp']
        ethnData = [0, 0, 0, 0]
        ageCols = ['12t21', '12t29', '16t24', '65up']
        ageData = [0, 0, 0, 0]
        for i in range(len(sumCols)):
            res = cur.execute("SELECT SUM(%s) FROM locations WHERE state='%s'" % (sumCols[i], state))
            row = res.fetchone()
            crimeData[i] += row[0]
            crimeData
        
        # Calculate state pop density
        res = cur.execute("SELECT SUM(population) FROM locations WHERE state='%s'" % (state))
        statePop = res.fetchone()[0]

        res = cur.execute("SELECT SUM(LandArea) FROM locations WHERE state='%s'" % (state))
        stateArea = res.fetchone()[0]

        popDensity = statePop / stateArea

        # Calculate race and age pop from percentage            
        for i in range(len(ethnCols)):
            res = cur.execute("SELECT racePct%s, population FROM locations WHERE state='%s'" % (ethnCols[i], state))
            row = res.fetchone()
            while row is not None:
                townPop = row[1]
                ethnData[i] += (row[0] * townPop)
                row = res.fetchone()
            ethnData[i] /= townPop
        
        for i in range(len(ageCols)):
            res = cur.execute("SELECT agePct%s, population FROM locations WHERE state='%s'" % (ageCols[i], state))
            row = res.fetchone()
            while row is not None:
                townPop = row[1]
                ageData[i] += (row[0] * townPop)
                row = res.fetchone()
            ageData[i] /= townPop

        # Get geojson
        geojson = getGeoJSON("", state)
        
        
        cmdstr = "INSERT INTO locations (CommunityName, isState, population, LandArea, PopDens, racePctWhite, racePctBlack, racePctAsian, racePctHisp, agePct12t21, agePct12t29, agePct16t24, agePct65up, murders, rapes, robberies, assaults, burglaries, larcenies, autoTheft, arsons, geojson) VALUES ('%s', TRUE, %d, %d, %f, %f, %f, %f, %f, %f, %f, %f, %f, %d, %d, %d, %d, %d, %d, %d, %d, '%s')" % (state, statePop, stateArea, popDensity, ethnData[0], ethnData[1], ethnData[2], ethnData[3], ageData[0], ageData[1], ageData[2], ageData[3], crimeData[0], crimeData[1], crimeData[2], crimeData[3], crimeData[4], crimeData[5], crimeData[6], crimeData[7], str(geojson))
        print(cmdstr)
        cur.execute(cmdstr)
        con.commit()     
    con.close()

def getGeoJSON(city: str, state: str) -> List:
    # Get geojson
    params = {
        "limit": 10,
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
        lat = data['lat']
        long = data['lon']
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
        return geographicalJson
    except Exception as e:
        print(e)
        return [] 

def processDatabase(filename: str):
    con = sqlite3.connect(filename)
    cur = con.cursor()
    addColumn = "ALTER TABLE locations ADD COLUMN geojson BLOB"
    # cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lat FLOAT"
    # cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lon FLOAT"
    # cur.execute(addColumn)
    res = cur.execute("SELECT rowid, communityName, state FROM locations")

    commandQueue = []
    idx = 0

    row = res.fetchone()
    while row is not None:
        rowid = row[0]
        dirtyCityName = row[1]
        state = row[2]
        city = None

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
        print("%s, %s, %d", (city, state, idx))

        geographicalJson = getGeoJSON(city, state)

        print(city)

        # Put the sql commands in a queue because we processing them here causes issues with fetchone
        cmdstr = "UPDATE locations SET communityName='%s', geojson='%s' WHERE rowid=%d" % (city, str(geographicalJson), rowid)
        commandQueue.append(cmdstr)
        idx += 1
        if idx >= 10:
            break

        # This is here to prevent us from DOSsing the third party webserver
        sleep(1)
        row = res.fetchone()

    for command in commandQueue:
        # print(command)
        cur.execute(command)
    
    con.commit()
    con.close()
    

@app.route("/upload", methods=["POST"])
@cross_origin()
def create_database():
    files = list(request.files.keys())
    for file_key in files: 
        file = request.files[file_key]
        file.save(file.filename)
        filename = file.filename[:file.filename.index('.')]
        if file.filename.endswith('.xlsx'):
            excel_file = pd.read_excel(file.filename)
            excel_file.to_csv(filename + ".csv", index=None, header=True)
            os.remove(file.filename)
        os.system(f"sqlite-utils insert \"{filename}.db\" \"{filename}\" \"{filename+'.csv'}\" --csv -d")
        os.remove(filename + '.csv')
    return "Successful"

@app.route('/mapData', methods=['GET'])
@cross_origin()
def getMapData():
    # Parse parameters
    print("Recieved request", request)
    params = request.args
    if 'datasetID' in params:
        datset = params['datasetID']
        # Get sql data
        con = sqlite3.connect(datset)
        cur = con.cursor()
        if 'stateLevel' in params:
            res = cur.execute("SELECT * FROM locations WHERE isState=TRUE")
        else:
            res = cur.execute("SELECT * FROM locations WHERE isState=FALSE")
        row = res.fetchone()
        data = []
        while row is not None:
            data.append(row)
            row = res.fetchone()
        con.close()

        return jsonify({"rows": data})
    else:
        return Response(status=400)
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
    app.run(debug=True, host='0.0.0.0', port=3000)
    # print(getGeoJSON("", "TX"))
    # processDatabase('./crime.db')
    # generateStateData('./crime.db')