export const OVON_Engage_Eva = {
    assistantName: 'Eva',
    "ovon": {
      "schema": {
          "url": "http://127.0.0.1:8888/connection",
          "version": "1.0"      
      },
  
      "conversation": {
          "id": "WebinarDemo137"
      }, 
  
      "sender": {
          "from": "./question.html",
          "reply-to": "./questions.html",
      },
  
      "events": [
          {
              "event-type": "assistant-engage",
              "parameters": {
                  "to": {
                      "url": "http://127.0.0.1:8888/connection"
                  }           
              }
          },
  
          {
              "event-type": "whisper-utterance",
              "parameters": {    
                  "dialog_event": {
                      "speaker-id": "emmett",
                      "span": { "start-time": "2023-06-14 02:06:07+00:00" },
                      "features": {
                          "text": {
                              "mime-type": "text/plain",
                              "tokens": [ { "value": "Passing you to Jake to answer specific questions..."  } ]
                          }
                      }
                  }
              }
          }
      ]
    }
  }
  export const OVON_Response_Eva = {
    assistantName: 'Eva',
    "ovon": {
        "schema": {
            "url": "http://127.0.0.1:8888/connection",
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
                                "tokens": [ { "value": "Hello! I'm Eva. How can I assist you today?" } ,
                                            { "value": "Now connected to Eva!"}
                                ]
                            }
                        }
                    }
                }
            }
        ]
    }
  }

  export const OVON_Engage_Jake = {
    assistantName: 'Jake',
    "ovon": {
      "schema": {
          "url": "http://127.0.0.1:8888/connection",
          "version": "1.0"      
      },
  
      "conversation": {
          "id": "WebinarDemo137"
      }, 
  
      "sender": {
          "from": "./question.html",
          "reply-to": "./questions.html",
      },
  
      "events": [
          {
              "event-type": "assistant-engage",
              "parameters": {
                  "to": {
                      "url": "http://127.0.0.1:8888/connection"
                  }           
              }
          },
  
          {
              "event-type": "whisper-utterance",
              "parameters": {    
                  "dialog_event": {
                      "speaker-id": "emmett",
                      "span": { "start-time": "2023-06-14 02:06:07+00:00" },
                      "features": {
                          "text": {
                              "mime-type": "text/plain",
                              "tokens": [ { "value": "Connected to Jake..."  } ]
                          }
                      }
                  }
              }
          }
      ]
    }
  }
  export const OVON_Response_Jake = {
    assistantName: 'Jake',
    "ovon": {
        "schema": {
            "url": "http://127.0.0.1:8888/connection",
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
                                "tokens": [ { "value": "Hello! I'm Jake. How can I assist you today?" } ]
                            }
                        }
                    }
                }
            }
        ]
    }
  }

// This is the OVON envelope to END TALKING with the current Assistant
// This is the "minimal" message that we will grow into over the next week.
// The "utterance" will be the Assistant's goodbye message.
// The default behavior will be to go back to the previous Assistant
export const OVON_Bye = {
    "ovon": {
        "conversation": {
            "id": "someUniqueIdCreatedByTheFirstParticipant",
        },
        "sender": {
            "from": "https://example.com/message-from",
        },
        "response_code" : 200,
        "events": [
            {
                "event_type": "utterance",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "Goodbye.. I'll pass you back to Eva."  },
                                            {"value": "Passing you to homepage..."} ]
                            }
                        }
                    }
                }
            },
	        {
                 "event_type" : "bye",
            }
        ]
    }
}
  
