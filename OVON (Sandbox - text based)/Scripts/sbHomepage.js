// Core-Basic functions for the Sandbox
var conversationID;
var responseDiv;
var msgLogDiv;

function sbStart(){
    localStorage.setItem( "currentConversationID", "" );
    loadAssistantSelect();
}

selectedAssistantIndex= localStorage.getItem( "currentAssistantIndex" );

var assistantObject = assistantTable[selectedAssistantIndex];
function sbConversationStart(){
    responseDiv = document.getElementById("response");
    msgLogDiv = document.getElementById("msgLOG");
    localStorage.setItem( "currentConversationID", "" );
    jsonLOG = "";
    OVONmsg = buildInviteOVON( assistantObject );
    sbPostToAssistant( assistantObject, OVONmsg );
}

function buildFullInviteOVON( someAssistant ){
    const OVON_invite = {
        "ovon": {
            "conversation": {
                "id": "someUniqueIdCreatedByTheFirstParticipant",
            },
            "sender": {
                "from": "https://someBotThatOfferedTheInvite.com",
            },
            "responseCode" : 200,
            "events": [
                {
                    "eventType": "invite",
                    "parameters": {
                        "to": {
                            "url": "https://someBotThatIsBeingInvited.com"
                        }
                    }
                },
                {
                    "eventType": "utterance",
                    "parameters": {
                        "dialogEvent": {
                            "speakerId": "humanOrAssistantID",
                            "span": { "startTime": "2023-06-14 02:06:07+00:00" },
                            "features": {
                                "text": {
                                    "mimeType": "text/plain",
                                    "tokens": [ { "value": "Thanks for the invitation!"  } ]
                                }
                            }
                        }
                    }
                },
                {
                    "eventType": "whisper",
                    "parameters": {
                        "dialogEvent": {
                            "speakerId": "humanOrAssistantID",
                            "span": { "startTime": "2023-06-14 02:06:07+00:00" },
                            "features": {
                                "text": {
                                    "mimeType": "text/plain",
                                    "tokens": [ { "value": "Start:PrimaryAssistant" } ]
                                }
                            }
                        }
                    }
                }
    
            ]
        }
    }
    conversationID = localStorage.getItem( "currentConversationID" );
    if( conversationID == "" ){
        conversationID = "convoID8403984"; // in reality build a unique one
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVON_invite.ovon.conversation.id = conversationID; // once set it is retained until SB restart
    OVON_invite.ovon.sender.from = "url_of_sender"; // in reality it is extracted from any invite browser sees
    OVON_invite.ovon.events[0].parameters.to.url = someAssistant.assistant.serviceAddress;
    return OVON_invite;
}

function buildInviteOVON( someAssistant ){
    const OVON_invite = {
        "ovon": {
            "conversation": {
                "id": "someUniqueIdCreatedByTheFirstParticipant",
            },
            "sender": {
                "from": "https://someBotThatOfferedTheInvite.com",
            },
            "responseCode" : 200,
            "events": [
                {
                    "eventType": "invite",
                    "parameters": {
                        "to": {
                            "url": "https://someBotThatIsBeingInvited.com"
                        }
                    }
                },   
                {
                    "eventType": "utterance",
                    "parameters": {
                        "dialogEvent": {
                            "speakerId": "human",
                            "span": { "startTime": "2023-06-14 02:06:07+00:00" },
                            "features": {
                                "text": {
                                    "mimeType": "text/plain",
                                    "tokens": [ { "value": "Is it time for my tire rotation."  } ]
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
    conversationID = localStorage.getItem( "currentConversationID" );
    if( conversationID == "" ){
        conversationID = "convoID8403984"; // in reality build a unique one
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVON_invite.ovon.conversation.id = conversationID; // once set it is retained until SB restart
    OVON_invite.ovon.sender.from = "url_of_sender"; // in reality it is extracted from any invite browser sees
    OVON_invite.ovon.events[0].parameters.to.url = someAssistant.assistant.serviceAddress;
    return OVON_invite;
}

//Present the Assistant response html innerHTML string
function displayResponseUtterance( text, col ) {
    var resp = "<h3";
    resp += ' style="color:';
    resp += col;
    resp += ';>';
    resp += assistantObject.assistant.name;
    resp += ': '
    resp += text;
    resp += '</h3>'
    responseDiv.innerHTML = resp;
    //document.getElementById( 'response' ).innerHTML = resp;
    return;
  }

//Present the Assistant msgLOG html innerHTML string
function displayMsgLOG( text, col ) {
    var resp = "<h3";
    resp += ' style="color:';
    resp += col;
    resp += ';>';
    resp += text;
    resp += '</h3>'
    msgLogDiv.innerHTML = resp;
    //document.getElementById( 'msgLOG' ).innerHTML = resp;
    return;
  }

  