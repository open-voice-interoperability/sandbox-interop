import json
from datetime import datetime
import re

conversationID = ""
# Set your assistant's unique speakerID and service address
mySpeakerID = "Madison_1763IRQ"
myServiceAddress = "https://ejtalk.pythonanywhere.com"

def exchange(inputOVON):
    i = 0
    eventSet = {"invite":False,"utterance":False,"whisper":False,"unKnown":False}
    utteranceInput = ""
    whisperInput = ""
    conversationID = inputOVON["ovon"]["conversation"]["id"]
    oneEvent = inputOVON["ovon"]["events"][i]
    while oneEvent:
        eventType = oneEvent["eventType"]
        eventSet[eventType] = True
        if eventType == "invite":
            inviteEvent = oneEvent
            utteranceInput = "Welcome to my world. How can I help."
        elif eventType == "whisper":
            whisperInput = oneEvent["parameters"]["dialogEvent"]["features"]["text"]["tokens"][0]["value"]
        elif eventType == "utterance":
            utteranceInput = oneEvent["parameters"]["dialogEvent"]["features"]["text"]["tokens"][0]["value"]
        elif eventType == "bye":
            utteranceInput = oneEvent["parameters"]["dialogEvent"]["features"]["text"]["tokens"][0]["value"]
        else:
            eventSet["unKnown"] = True

        i = i+1
        oneEvent = inputOVON["ovon"]["events"][i]

    if (eventSet("invite") and utteranceInput.len==0):
        # set this to your greeting for a "naked invite"
        utteranceInput = "Welcome to my world. How can I help."

    if (eventSet("bye") and utteranceInput.len==0):
        # set this to your goodbye for a "naked bye"
        utteranceInput = "Nice talking to you. Goodbye."


    outputOVON = modeResponse( utteranceInput, whisperInput, eventSet["invite"] )
    ovon_response_json = json.dumps( outputOVON )
    return ovon_response_json

def modeResponse( inputUtterance, inputWhisper, isInvite ):
    if isInvite:
        if inputWhisper.len>0:
            response_text = converse( "", inputWhisper )
        else:
            response_text = "Welcome to my world. How can I help."
    else:
        response_text = converse( inputUtterance, inputWhisper )

    # currentTime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    currentTime = datetime.now().isoformat()
    ovon_response = {
    "ovon": {
            "conversation": conversationID,
            "sender": {"from": myServiceAddress},
            "responseCode": 200,
            "events": [
                {
                    "eventType": "utterance",
                    "parameters": {
                        "dialogEvent": {
                            "speakerId": mySpeakerID,
                            "span": {
                                "startTime": currentTime
                            },
                            "features": {
                                "text": {
                                    "mimeType": "text/plain",
                                    "tokens": [{"value": response_text}]
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
    ovon_response_json = json.dumps(ovon_response)
    return ovon_response_json

def converse( utt, whisp ):
    say = "I am sorry I don't understand."
    if utt.len>0:
        greetings=['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
        for greeting in greetings:
            if re.search(rf'\b{greeting}\b', utt, re.IGNORECASE):
                say = "Hello, what do you need?"
        return False

    conRespObject = {
        "converse": {
            "say": say,
            "whisper": "textToWhisper",
            "delegate": "invite|bye|utt"
        }
    }
    return conRespObject
