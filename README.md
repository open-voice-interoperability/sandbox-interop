# sandbox-interop
Initial upload of basic text funtionality

These instructions will help guide you through setting up an environment and running this SandBox

## Prerequisites
Python 3.x (I am running python 3.9.13)
Flask (install using 'pip install Flask' in command line)
Requests library (install using 'pip install requests')

## Installation
1. Clone Repository on local machine
2. Navigate to project directory
3. (Optional) Create a virtual environment (python -m venv venv) Activate it using this command -- Windows (venv\Scripts\activate) -- macOS/Linux (source venv/bin/activate)

## How to Run/Use 
You want to make sure both servers (flaskMain.py and secondaryAssistant.py) are running by using this command in 2 different terminals (python flaskMain.py) and (python secondaryAssistant.py)

## Directory Structure/File Names
flaskMain.py is the main flask server that connects everything
mainAssistant.py is the code for the main assistant that the user will be talking to 
secondaryAssistant.py is the code for another assistant located on a different server
