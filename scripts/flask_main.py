import os
from flask import Flask, send_from_directory
import json

# Debug:
# app = Flask(__name__, static_folder='../crime_database/build')
# Docker:
app = Flask(__name__, static_folder='')

@app.route('/mapData', methods=['GET'])
def getMapData():
    print(app.static_folder)

    json_file_path = app.static_folder + '/src/local_data.json'

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
    app.run(debug=True, host='0.0.0.0', port=3000)