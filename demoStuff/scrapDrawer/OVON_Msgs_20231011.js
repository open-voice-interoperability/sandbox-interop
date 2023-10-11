// These are patterns for the GENERAL OVON ENVELOPES
// These are envelopes your assistant will receive from the browser
// The important parts you need to look for are:
//    "event_type-": "invite"
//    "event_type": "bye"
//    "event_type": "utterance"
//    "event_Stype": "whisper"
//
// IF there is an "utterance" then use that
//    OTHERWISE use the "whisper" as your input
//
// The following is the minimal OVON envelope with all the options and is
//     just for reference.
// Following this are specific minimal messages
const OVON_OverviewAll = {
    "ovon": {
        "schema": {
            "url": "https://ovon/conversation/pre-alpha-1.0.1",
            "version": "1.0"
        },
        "conversation": {
            "id": "someUniqueIdCreatedByTheFirstParticipant",
            "persistent_state": {
                 "unique_key1": "someStateDataForSpecificAssistant",
                 "unique_key2": {object}
            }
        },
        "sender": {
            "from": "https://example.com/message-from",
            "reply_to": "https://example.com/reply-message-to"
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
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
                            }
                        }
                    }
                }
            },
            {
                "event_type": "whisper",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "prescribe 180mg of citalopram"  } ]
                            }
                        }
                    }
                }
            },
            {
                "event_type": "invite",
                "parameters": {
                    "to": {
                        "url": "https://mybot.pharmacy.com"
                    }
                }
            },
	    {
                 "event_type" : "bye",
                 "parameters" : {
                     "discourse_status" : "closed|failed|open|paused|uncategorized"
                 }
            }
        ]
    }
}

// This is the OVON envelope to START TALKING to a different Assistant
// This is the "minimal" message that we will grow into over the next week.
// Following this is the "superMinimal" message just to get a simple system
//     working.
const OVON_GoToNextAssistant = {
    "ovon": {
        "schema": {
            "url": "https://ovon/conversation/pre-alpha-1.0.1",
            "version": "1.0"
        },
        "conversation": {
            "id": "someUniqueIdCreatedByTheFirstParticipant",
            "persistent_state": {
                 "unique_key1": "someStateDataForSpecificAssistant",
                 "unique_key2": {object}
            }
        },
        "sender": {
            "from": "https://example.com/message-from",
            "reply_to": "https://example.com/reply-message-to"
        },
        "response_code" : 200,
        "events": [
            {
                "event_type": "invite",
                "parameters": {
                    "to": {
                        "url": "https://botToGoTo.com"
                    }
                }
            },
            {
                "event_type": "utterance",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
                            }
                        }
                    }
                }
            },
            {
                "event_type": "whisper",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "Some ancilary text not spoken"  } ]
                            }
                        }
                    }
                }
            }
        ]
    }
}

// The "superMinimal" message just to get a simple system working.
//    Note: The sender.from is not needed when the browser starts up
//          the first/primary Assistant
//    Note: If there is no utterance or whisper sent then the Assistant
//          just does a cold open "hello" response.
const OVON_GoToNextAssistantSuperMin = {
    "ovon": {
        "conversation": {
            "id": "someUniqueIdCreatedByTheFirstParticipant",
        },
        "sender": {
            "from": "https://someBotThatResponds.com",
        },
        "response_code" : 200,
        "events": [
            {
                "event_type": "invite",
                "parameters": {
                    "to": {
                        "url": "https://botToGoTo.com"
                    }
                }
            },
            {
                "event_type": "utterance",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
                            }
                        }
                    }
                }
            }
        ]
    }
}

// This is the OVON envelope to CONTINUE TALKING with the same Assistant
// This is the "minimal" message that we will grow into over the next week.
// Following this is the "superMinimal" message just to get a simple system
//     working.
const OVON_Respond = {
    "ovon": {
        "conversation": {
            "id": "someUniqueIdCreatedByTheFirstParticipant",
        },
        "sender": {
            "from": "https://someBotThatResponds.com",
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
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
                            }
                        }
                    }
                }
            },
            {
                "event_type": "whisper",
                "parameters": {
                    "dialog_event": {
                        "speaker_id": "humanOrAssistantID",
                        "span": { "start_time": "2023-06-14 02:06:07+00:00" },
                        "features": {
                            "text": {
                                "mime_type": "text/plain",
                                "tokens": [ { "value": "prescribe 180mg of citalopram"  } ]
                            }
                        }
                    }
                }
            }
        ]
    }
}

// The "superMinimal" message just to get a simple system working.
//    Note: The sender.from is the url of the Assistant (if it is speaking)
//          or just "browser" (or "human") if it is the human speaking.
// These "utterances" go back and forth between the Assistant and human until
// the Assistant sends a "bye" event.
const OVON_RespondSuperMin = {
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
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
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
const OVON_Bye = {
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
                                "tokens": [ { "value": "OK. I'll pass you over to pharmacy dot com."  } ]
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
