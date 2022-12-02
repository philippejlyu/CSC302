from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin
import os
import json
import re
import requests
import sqlite3
from time import sleep
import pandas as pd
# Debug:
# app = Flask(__name__, static_folder='../crime_database/build')
# Docker:
app = Flask(__name__, static_folder='build')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def processDatabase(filename: str):
    con = sqlite3.connect(filename)
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
        print("%s, %s, %d", (city, state, idx))

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
            geojson = data['geojson']['coordinates'][0]
            if not isinstance(geojson, int):
                for i in range(len(geojson)):
                    if isinstance(geojson[i][0], list):
                        for j in range(len(geojson[i])):
                            tmp_lat = geojson[i][j][0]
                            tmp_lon = geojson[i][j][1]
                            if tmp_lat > 0:
                                geojson[i][0] = tmp_lat
                                geojson[i][1] = tmp_lon
                                geographicalJson.append([tmp_lat, tmp_lon])
                            else:
                                geographicalJson.append([tmp_lon, tmp_lat])
                    else:
                        tmp_lat = geojson[i][1]
                        tmp_lon = geojson[i][0]

                        if tmp_lat > 0:
                            geographicalJson.append([tmp_lat, tmp_lon])
                        else:
                            geographicalJson.append([tmp_lon, tmp_lat])
        except Exception as e:
            print(e)
            print(i)



        # Put the sql commands in a queue because we processing them here causes issues with fetchone
        cmdstr = "UPDATE locations SET communityName='%s', lat=%f, lon=%f, geojson='%s' WHERE rowid=%d" % (city, float(lat), float(long), str(geographicalJson), rowid)
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
    print("The App static folder is {0:s}".format(app.static_folder));
    app.run(debug=True, host='0.0.0.0', port=3000)
    # processDatabase('./crime.db')