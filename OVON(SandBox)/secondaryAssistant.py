from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/get_weather', methods=['GET','POST'])
def get_weather():
    # question = request.form['question']  # Get the question from the form
    # # Process the question and generate a response based on your logic
    # if "weather" in question.lower():
        return "Jake: Hello, Im Jake, the weather assistant."
    #     latitude = request.form['latitude']
    #     longitude = request.form['longitude']
    #     OPENWEATHERMAP_API_KEY = '469fe24ea9f1ceabc317145b85c4f848'
    #     api_url = f'http://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&units=imperial&appid={OPENWEATHERMAP_API_KEY}'
        
    #     response = requests.get(api_url)

    #     if response.status_code == 200:
    #         weather_data = response.json()
    #         temperature = weather_data['main']['temp']
    #         description = weather_data['weather'][0]['description']
    #         location = weather_data['name']
    #         weather_info = f'Weather in {location}: {description}, Temperature: {temperature}°F -- Latitude: {latitude} Longitude: {longitude}'
    #         coords = f''
    #         return weather_info
    #     else:
    #         print(response.status_code, response.content)
    #         return 'Unable to fetch weather data'
    # else:
    #     return 'I cannot answer that question'
if __name__ == '__main__':
    app.run(debug=True, port=5001)
