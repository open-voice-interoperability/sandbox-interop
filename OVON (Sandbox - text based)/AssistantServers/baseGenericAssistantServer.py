# The latest working min Server code 20231105
# =================================================
# Note!!!! you will need to install flask_cors
#    open a bash console and do this
#    pip3.10 install --user flask_cors

from flask import Flask
from flask import request
from flask_cors import CORS
import json
# ========= IMPORT your assistant code here
# from MyAssistantPackage import *

app = Flask(__name__)
CORS(app)

# ========= INSTANCE your assistant code
# myUniqueAssistant = MyAssistant()

@app.route('/', methods=['POST'])
def home():
    inputOVON = json.loads( request.data )
    print( inputOVON )
    
# ========= This is where the brains of the bot are invoked for one turn
# ========= CALL your assistant code
#  response_data = myUniqueAssistant.exchange( inputOVON )
# =========
 
# ========= The following is just so works without any assistant code
    response_data = "I did return this thing 20231105!"
    
    return response_data
    
if __name__ == '__main__':
    app.run(host="0.0.0.0",port=8766, debug=True)
# =================================================