from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin
import os
import json
import re
import requests
import sqlite3

# Debug:
# app = Flask(__name__, static_folder='../crime_database/build')
# Docker:
app = Flask(__name__, static_folder='build')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def processDatabase(filename: str):
    con = sqlite3.connect("crime.db")
    cur = con.cursor()
    addColumn = "ALTER TABLE locations ADD COLUMN geojson BLOB"
    cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lat FLOAT"
    cur.execute(addColumn)
    addColumn = "ALTER TABLE locations ADD COLUMN lon FLOAT"
    cur.execute(addColumn)
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
        
        # Now add spaces before capitals if necessary
        city = re.sub(r"(\w)([A-Z])", r"\1 \2", str(city))
        print(city)

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
        data = r.json()[0]
        lat = data['lat']
        long = data['lon']
        # lat = 40.6834349
        # long = 40.6834349
        geojson = data['geojson']['coordinates'][0]


        # Put the sql commands in a queue because we processing them here causes issues with fetchone
        cmdstr = "UPDATE locations SET communityName='%s', lat=%f, lon=%f, geojson='%s' WHERE rowid=%d" % (city, float(lat), float(long), str(geojson), rowid)
        commandQueue.append(cmdstr)

        # This is here to prevent us from DOSsing the third party webserver
        idx += 1
        if idx >= 1:
            break
        row = res.fetchone()

    for command in commandQueue:
        print(command)
        cur.execute(command)
    
    con.commit()
    con.close()
    

@app.route("/upload", methods=["POST"])
@cross_origin()
def create_database():
    file = request.files['file']
    filename = file.filename[:file.filename.index('.')]
    file.save(file.filename)
    os.system(f"sqlite-utils insert {filename}.db {filename} {file.filename} --csv -d")
    os.remove(file.filename)
    return "Successful"

@app.route('/mapData', methods=['GET'])
def getMapData():

    json_file_path = app.static_folder + '/../src/local_data.json'
    # return send_from_directory(app.static_folder, '/src/local_data.json')
    with open(json_file_path, 'r') as j:
        contents = json.loads(j.read())
        return contents

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
if __name__ == "__main__":
    # app.run(debug=True, host='0.0.0.0', port=3000)
    processDatabase('./crime.db')