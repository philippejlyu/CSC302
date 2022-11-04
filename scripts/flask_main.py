from flask import Flask, request
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/upload", methods=["POST"])
@cross_origin()
def create_database():
    file = request.files['file']
    filename = file.filename[:file.filename.index('.')]
    file.save(file.filename)
    os.system(f"sqlite-utils insert {filename}.db {filename} {file.filename} --csv -d")
    os.remove(file.filename)
    return "Successful"
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)