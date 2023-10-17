from flask import Flask, jsonify, request
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# Define a unique port for Cassandra
port = 8889
connected = False

@app.route('/connection', methods=['GET', 'POST'])
def check_connection():
    global connected  # Access the global variable

    if request.method == 'GET':
        # Return the current connection status
        response_data = {"connected": connected}
        return jsonify(response_data), 200
    elif request.method == 'POST':
        # Update the connection status based on your criteria
        connected = True  # For example, setting it to True
        response_data = {"connected": connected, "message": "Connection established successfully!"}
        return jsonify(response_data), 200
    
def recognize_greeting(question):
    greetings=['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
    for greeting in greetings:
        if re.search(rf'\b{greeting}\b', question, re.IGNORECASE):
            return True
    return False

def respondToQuestion(question):
    if recognize_greeting(question):
        return "Hello! How can I assist you today?"
    else:
        return "I'm not sure how to handle that question."

@app.route('/ask', methods=['GET','POST'])
def ask_question():
    if request.method == 'POST':
        question_data = request.get_json()
        question = question_data.get('question')
        response_data = {"answer": respondToQuestion(question)}

        return jsonify(response_data), 200


if __name__ == '__main__':
    app.run(debug=True, port=port)
