// Core-Basic functions for the Sandbox
var conversationID;
//var responseDiv;
//const responseDiv = document.getElementById('response');
var msgLogDiv;

function sbStart(){
    localStorage.setItem( "currentConversationID", "" );
    loadAssistantSelect();
}


selectedAssistantIndex= localStorage.getItem( "currentAssistantIndex" );

var assistantObject = assistantTable[selectedAssistantIndex];
var bareInviteSelected = false;

function sbConversationStart() {
    msgLogDiv = document.getElementById("msgLOG");
    localStorage.setItem("currentConversationID", "");
    jsonLOG = "";

    if (localStorage.getItem("bareInviteSelected") === "true") {
        // The Bare Invite button was selected
        console.log("Bare Invite button was selected");
        const OVONmsg = buildInviteOVON(assistantObject);
        clearValue(OVONmsg);
    }
    else{
        OVONmsg = buildInviteOVON(assistantObject);
        sbPostToAssistant(assistantObject, OVONmsg);
    }
    
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

function startBareInvite() {
    localStorage.setItem("bareInviteSelected", "true");
    location.href = 'sbConverse.html';
}

function inviteWithUtterance(OVONmsg) {
    // Retrieve the message from the input field
    
}

function clearValue(OVONmsg) {
    // Function to clear the value of "tokens" property in the buildInviteOVON function
    console.log("clearValue was called");
    OVONmsg.ovon.events[1].parameters.dialogEvent.features.text.tokens[0].value = "";
    sbPostToAssistant(assistantObject, OVONmsg);
    localStorage.removeItem("bareInviteSelected"); // Reset the flag

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
        conversationID = "convoID_";
        conversationID += cleanDateTimeString();
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVON_invite.ovon.conversation.id = conversationID; // once set it is retained until SB restart
    OVON_invite.ovon.sender.from = "browser"; // in reality it is extracted from any invite browser sees
    OVON_invite.ovon.events[0].parameters.to.url = someAssistant.assistant.serviceAddress;
    d = new Date();
    OVON_invite.ovon.events[1].parameters.dialogEvent.span.startTime = d.toISOString();
    return OVON_invite;
}

function buildUtteranceOVON( someAssistant ){
    const OVON_utterance = {
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
        conversationID = "convoID_";
        conversationID += cleanDateTimeString();
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVON_utterance.ovon.conversation.id = conversationID; // once set it is retained until SB restart
    OVON_utterance.ovon.sender.from = "browser"; // in reality it is extracted from any invite browser sees
    d = new Date();
    OVON_utterance.ovon.events[0].parameters.dialogEvent.span.startTime = d.toISOString();
    return OVON_utterance;
}

//Present the Assistant response html innerHTML string
function displayResponseUtterance( text, col ) {
    var resp = "<b>";
    //resp += ' style="color:';
    //resp += col;
    //resp += ';>';
    resp += assistantObject.assistant.name;
    resp += ': '
    resp += text;
    resp += '</b>';
    var responseDiv = document.getElementById("response");
    responseDiv.innerHTML = resp;
    //document.getElementById( 'response' ).innerHTML = resp;
    return;
  }

  function displayMsgRECEIVED(text, col) {
    var resp = `<span style='color:${col};'>${text}</span>`;
    var msgRECEIVEDDiv = document.getElementById("msgRECEIVED");
    msgRECEIVEDDiv.innerHTML = resp;
    return;
}

//Present the Assistant msgLOG html innerHTML string
function displayMsgLOG( text, col ) {
    var resp = "<b>";
    //resp += ' style="color:';
    //resp += col;
    //resp += ';>';
    resp += text;
    resp += '</b>'
    var msgLogDiv = document.getElementById("msgLOG");
    msgLogDiv.innerHTML = resp;
    //document.getElementById( 'msgLOG' ).innerHTML = resp;
    return;
  }

//Present the Assistant msgLOG html innerHTML string
function sendReply() {
    inputText = document.getElementById("reply");
    input = inputText.value;

    inputText.value = "";

    //put the input in an utterance
    aIndex = localStorage.getItem( "currentAssistantIndex");
    ovonUtt = buildUtteranceOVON( assistantTable[aIndex] );
    ovonUtt.ovon.events[0].parameters.dialogEvent.span.startTime = cleanDateTimeString();
    ovonUtt.ovon.events[0].parameters.dialogEvent.features.text.tokens[0].value = input;
    sbPostToAssistant( assistantTable[aIndex], ovonUtt );
    
    return;
  }

  function addDateNumFixLeadZeros(number) {  
    if( number < 10){ 
      number='0' + number;
    };
    return ('_' + number);
  }

  function cleanDateTimeString() {  
    var d=new Date();
    var dateStr = addDateNumFixLeadZeros( d.getFullYear() );
    dateStr += addDateNumFixLeadZeros( d.getMonth() + 1 );
    dateStr += addDateNumFixLeadZeros( d.getDate() );
    dateStr += addDateNumFixLeadZeros( d.getHours() + 1 );
    dateStr += addDateNumFixLeadZeros( d.getMinutes() + 1 );
    dateStr += addDateNumFixLeadZeros( d.getSeconds() + 1 );
    return dateStr;
  }

  // settings stuff here
    function loadSettingsValues(){
        document.getElementById("firstName").value = localStorage.getItem( "humanFirstName" );
 //       document.getElementById("dataPath").value = localStorage.getItem( "dataPath" );
        document.getElementById("OpenAI").value = localStorage.getItem( "OpenAIKey" );
    }

    function setFirstName(){
        localStorage.setItem( "humanFirstName", document.getElementById("firstName").value );
    }

    //function setDataPath(){
    //    localStorage.setItem( "dataPath", document.getElementById("dataPath").value );
    //}

    function setOpenAIKey(){
        localStorage.setItem( "OpenAIKey", document.getElementById("OpenAI").value );
    }
  