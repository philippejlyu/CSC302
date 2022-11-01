import os
from flask import Flask, send_from_directory

# Debug:
# app = Flask(__name__, static_folder='../crime_database/build')
# Docker:
app = Flask(__name__, static_folder='build')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
    
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3000)