import requests

def generate_response(question):
    if any(greeting in question.lower() for greeting in ['hello', 'hi','hey', 'hiya']):
        return "Cassandra: Hello, I am Cassandra, I hope you are doing well!"
    else:
        return "Cassandra: I'm sorry, I don't understand that question."

def forward_weather_question():
    # Forward the question to Jake's server running on port 5001
    response = requests.get('http://127.0.0.1:5001/get_weather')

    if response.status_code == 200:
        return response.text
    else:
        return "Can't reach Jake's server."