# sandbox-interop

__A browser/assistant system for experimentation with OVON messaging. It is:__
* Text based (but will evolve to speech soon)
* Provides a server to run as localhost to host the browser html/javascript
* Has a list of OVON Envelope based assistant servers to play with
* Has a skeleton python assistant server that you can use to build an assistant

## How to get started

### Prerequisites

#### Python 3.x (We are using 3.12 and pythonanywhere.com uses 3.10)

*The following are installed in the command line. Install using pip3*
*Following are ONLY needed if you are building your own assistant server*

* Flask: **pip3 install flask**
* Flask_cors: **pip3 install flask-cors**
* Requests: **pip3 install requests**

#### A modern web browser (any will work for text)
*BUT for the full advanced speech system you should use MS Edge*
* Notes on the Edge Web Browser
	* The Edge browser is a Chromium base browser
	* Importantly Edge provides a wide range of quality TTS voices
	* Also Edge provides high quality Speech Recognition
	* Only Chrome and Edge provide usable ASR

### Installation
*  _Clone_ Repository on local machine
*  _Navigate_ to project directory in a _console_/cmd window
*  _Start_ the sandbox server by running this command:
	**python sandboxServer.py**

## How to run the Browser component
* Open you web browser
* In the Navigation bar enter: __http://localhost:6002/Browsers/sbHome.html__
* You will see a page titled __OVON SandBox Homepage__
* There is a drop down selector

*For now only three assistants WORK in the sense that they use the OVON Envelope*
* For now only three assistants work
	* __wizard:__ Says "Ready" when you start
		* when you type an __input__ it will respond to a question
		* you can continue as long as you like
		* it uses and underlying LLM
		* it runs somewhere on the web
	* __ovon_auto:__
		* is currently being sent an _invite_ and an _utterance_
			* once it responds you can type some input
			* it only knows about tire rotation on your Subaru
			* the assistant responds to most things with "I don't know about..."
			* it runs on pythonanywhere.com
	* __leah:__
		* is currently being sent an _invite_ and an _utterance_
			* it responds with "Thanks for the invitation ..."
			* you can type "hello" and she will respond in kind
			* it doesn't know anything else
			* it runs on pythonanywhere.com

* After you select an Assistant _click_ on __Start SandBox Conversation__
	* This will take you to the sbConverse.html page
	* On loading the initial OVON Envelope is sent to the Assistant
	* You will see the SENT/RECEIVED OVON messages
	* You will see the extracted text response
	* You may type in the INPUT box to send and "utterance"
	* (remember to end with the "enter" key)

## Directory Structure and Files

* sandbox-interop [Root]
	* sandboxServer.py [File]
		* the localhost server that supports the browser components
	* Assistants [Directory]
		* baseGenericAssistantServer.py is a skeleton for a pythonanywhere.com assistant
		* later we will provide information on how to set up a pythonanywhere account (free) and host your own assistant
		* ignore the other files for now
	* Browsers [Directory]
		* HTML pages for the browser
	* Scripts [Directory]
		* javascript, css, etc. to support the browser