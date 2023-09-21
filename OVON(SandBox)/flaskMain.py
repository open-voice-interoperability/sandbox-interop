from flask import Flask, jsonify, render_template, request
from mainAssistant import generate_response, forward_weather_question

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('homePage.html')

@app.route('/ask', methods=['GET', 'POST'])
def ask():
    if request.method == 'POST':
        question = request.form['question']
        if "weather" in question.lower():
            # Forward the weather-related question to Jake's server
            return forward_weather_question()
        else:
            answer = generate_response(question)
            return answer
    return render_template('Dialog.html')

if __name__ == '__main__':
    app.run(debug=True)