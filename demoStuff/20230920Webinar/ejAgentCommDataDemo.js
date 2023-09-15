// These are patterns for the GENERAL OVON ENVELOPES
// These are envelopes your assistant will receive from the browser
// The important parts you need to look for are:
//    "event-type": "assistant-engage"
//    "event-type": "utterance"
//    "event-type": "whisper-utterance"
//
// IF there is an "utterance" then use that
//    OTHERWISE use the "whisper-utterance" as your input
//
const OVON_Engage_Allan = {
  "ovon": {
    "schema": {
        "url": "https://ovon/conversation/pre-alpha-1.0.1",
        "version": "1.0"      
    },

    "conversation": {
        "id": "WebinarDemo137"
    }, 

    "sender": {
        "from": "https://example.com/message-from",
        "reply-to": "https://example.com/reply-message-to"
    },

    "events": [
        {
            "event-type": "assistant-engage",
            "parameters": {
                "to": {
                    "url": "https://www.asteroute.com/ovontest"
                }           
            }
        },

        {
            "event-type": "whisper-utterance",
            "parameters": {    
                "dialog-event": {
                    "speaker-id": "emmett",
                    "span": { "start-time": "2023-06-14 02:06:07+00:00" },
                    "features": {
                        "text": {
                            "mime-type": "text/plain",
                            "tokens": [ { "value": "Politely describe the concept of tire rotation using 50 words or less."  } ]
                        }
                    }
                }
            }
        }
    ]
  }
}

const OVON_Engage_Debbie = {
  "ovon": {
    "schema": {
        "url": "https://ovon/conversation/pre-alpha-1.0.1",
        "version": "1.0"      
    },

    "conversation": {
        "id": "WebinarDemo137"
    }, 

    "sender": {
        "from": "https://example.com/message-from",
        "reply-to": "https://example.com/reply-message-to"
    },

    "events": [
        {
            "event-type": "assistant-engage",
            "parameters": {
                "to": {
                    "url": "https://secondAssistant.pythonanywhere.com"
                }           
            }
        },

        {
            "event-type": "whisper-utterance",
            "parameters": {    
                "dialog-event": {
                    "speaker-id": "emmett",
                    "span": { "start-time": "2023-06-14 02:06:07+00:00" },
                    "features": {
                        "text": {
                            "mime-type": "text/plain",
                            "tokens": [ { "value": "Is my car due for a tire rotation?"  } ]
                        }
                    }
                }
            }
        }
    ]
  }
}

// These are response envelopes that your assistant will RETURN
// use this when your assistant wants to speak
// IF this is your LAST reponse and you want to go back to cassandra
//    THEN add the "event-type": "assistant-return" section
//    OTHERWISE
//      the human will continue talking to your assistant.
//
// the Browser will only use (look for)
//    "event-type": "assistant-return"
//    "speaker-id": "wizard"(for Allan) or "ovon_auto"(for Debbie)
//    "tokens": [ { "value": "SOMETHING THAT YOU WANT SPOKEN TO THE USER." }

const OVON_Response_Allan = {
  "ovon": {
      "schema": {
          "url": "https://ovon/conversation/pre-alpha-1.0.1",
          "version": "1.0"      
      },

      "conversation": {
          "id": "WebinarDemo137"
      }, 
  
      "events": [
        {
          "event-type": "assistant-return"
        },

        {
              "event-type": "utterance",
              "parameters": {
                  "dialog-event": {
                      "speaker-id": "wizard",
                      "span": { "start-time": "2023-06-14 02:06:07+00:00" },               
                      "features": {
                          "text": {
                              "mime-type": "text/plain",
                              "tokens": [ { "value": "SOMETHING THAT YOU WANT SPOKEN TO THE USER." } ]
                          }
                      }
                  }
              }
          }
      ]
  }
}

const OVON_Response_Debbie = {
  "ovon": {
      "schema": {
          "url": "https://ovon/conversation/pre-alpha-1.0.1",
          "version": "1.0"      
      },

      "conversation": {
          "id": "WebinarDemo137"
      }, 
  
      "events": [
        {
          "event-type": "assistant-return"
        },

        {
              "event-type": "utterance",
              "parameters": {
                  "dialog-event": {
                      "speaker-id": "ovon_auto",
                      "span": { "start-time": "2023-06-14 02:06:07+00:00" },               
                      "features": {
                          "text": {
                              "mime-type": "text/plain",
                              "tokens": [ { "value": "SOMETHING THAT YOU WANT SPOKEN TO THE USER." } ]
                          }
                      }
                  }
              }
          }
      ]
  }
}

// IF you didn't terminate the conversation with:
//     "event-type": "assistant-return"
//THEN you will RECEIVE a normal OVON response from the human for a next turn
//  The only important parts of this (for the demo) are:
//      "event-type": "utterance"
//      "tokens": [ { "value": "SOMETHING THAT EMMETT SAID." }
const OVON_Human_Continuation = {
  "ovon": {
      "schema": {
          "url": "https://ovon/conversation/pre-alpha-1.0.1",
          "version": "1.0"      
      },

      "conversation": {
          "id": "WebinarDemo137"
      }, 
  
      "events": [
        {
              "event-type": "utterance",
              "parameters": {
                  "dialog-event": {
                      "speaker-id": "emmett",
                      "span": { "start-time": "2023-06-14 02:06:07+00:00" },               
                      "features": {
                          "text": {
                              "mime-type": "text/plain",
                              "tokens": [ { "value": "SOMETHING THAT EMMETT SAID." } ]
                          }
                      }
                  }
              }
          }
      ]
  }
}

// This is how the browser will associate the remote assistant with a voice
// Specifically:
//          name: "wizard", voiceIndex: 107,
// and      name: "ovon_auto", voiceIndex: 109,
// I will assign the voices. I just wanted you to see why I need your
//    assistant's name.

const assistantTable = [
    {
      agent: {
        name: "myHuman",
        voiceIndex: 666,
        lightColor: "#ff6666",
        markerColor: "#b30000",
        serviceName: "HumanUser",
        serviceAddress: "OriginationPoint",
        authCode: "hugi666ikjjerg",
      }
    },
    {
      agent: {
      name: "assistantBrowser",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#000000",
      serviceName: "AssistantCommunications",
      serviceAddress: "localhost:15445",
      authCode: "456398nns",
    }
  },
  {
    agent: {
      name: "cassandra",
      voiceIndex: 140,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:15445/clientEvent",
      authCode: "h229k00m8bv",
    }
  },
  {
    agent: {
      name: "wizard",
      voiceIndex: 107,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "DaVinci_LLM",
      serviceAddress: "https://www.asteroute.com/ovontest",
      authCode: "69jjg45cf0",
    }
  },
  {
    agent: {
      name: "ovon_auto",
      voiceIndex: 109,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "Debbie_OVONAUTO",
      serviceAddress: "https://secondAssistant.pythonanywhere.com",
      authCode: "69jjg45cf0",
    }
  },
]
