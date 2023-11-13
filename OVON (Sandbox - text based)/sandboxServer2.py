# This is the simple server that hosts the browser resources
# Just run it from the root directory for your "sandbox"
#     (the dir containing the Browsers folder)
#     python sandboxServer.py

# The latest working min Server code 20231105
# =================================================
# Note!!!! you will need to install flask_cors
#    open a bash console and do this
#    pip3.10 install --user flask_cors

from flask import Flask
from flask import request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])

@app.route('/sbRead', methods=['POST'])
def read():
    fileName = ""
    fileName += request.data
    fileContents = open(fileName, "r")
    return fileContents.read()

@app.route('/sbWrite', methods=['POST'])
def write():
    fileContents = open("demofile3.txt", "w")
    fileContents.write( request.data )
    fileContents.close()
    return "success"

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=6002, debug=True)
# =================================================
