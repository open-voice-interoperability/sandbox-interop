// Core-Basic functions for the Sandbox
var conversationID;

function sbStart(){
    localStorage.setItem( "currentConversationID", "" );
    loadAssistantSelect();
}

selectedAssistantIndex= localStorage.getItem( "currentAssistantIndex" );

var assistantObject = assistantTable[selectedAssistantIndex];
function sbConversationStart(){
    OVONmsg = buildInviteOVON( assistantObject );
    sbPostToAssistant( assistantObject, OVONmsg );
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
    document.getElementById( 'response' ).innerHTML = resp;
    return;
  }

  