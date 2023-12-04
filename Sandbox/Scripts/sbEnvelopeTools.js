// Utility functions for the Sandbox

function sbConversationStart() {
    msgLogDiv = document.getElementById("msgLOG");
    localStorage.setItem("currentConversationID", "");
    jsonLOG = "";
    localStorage.setItem( "uttCount", 0 );
    var selectedColor = localStorage.getItem('markerColor');
    const baseEnvelope = baseEnvelopeOVON(assistantObject);

    document.getElementById("AssistantName").innerText = localStorage.getItem('assistantName');

    if (localStorage.getItem("bareInviteSelected") === "true") {
        // The Bare Invite button was selected
        setEvelopeConvoID(baseEnvelope);
        const OVONmsg = bareInviteOVON(baseEnvelope, assistantObject);
        sbPostToAssistant(assistantObject, OVONmsg);
        clearValue(OVONmsg);
    } else if(localStorage.getItem("InviteWithWhisper") === "true") {
        // The Invite with Whisper option was selected
        const whisperMessage = localStorage.getItem("whisperMessage");
        setEvelopeConvoID(baseEnvelope);
        const OVONmsg = bareInviteOVON (baseEnvelope, assistantObject);
        OVONmsg.ovon.events.push(buildWhisperOVON(assistantObject, whisperMessage));
        sbPostToAssistant(assistantObject, OVONmsg);
        
        localStorage.removeItem("InviteWithWhisper");
        localStorage.removeItem("whisperMessage");
    }
}


function baseEnvelopeOVON( someAssistant ){
    const OVON_Base = {
        "ovon": {
            "conversation": {
                "id": "someUniqueIdCreatedByTheFirstParticipant",
            },
            "schema": {
                "version": "0.9.0",
                "url": "not_published_yet"
            },
            "sender": {
                "from": "https://someBotThatSentTheEnvelope.com",
            },
            "responseCode" : 200,
            "events": [],
        },
    };
    conversationID = localStorage.getItem( "currentConversationID" );
    if( conversationID == "" ){
        conversationID = "convoID8403984"; // in reality build a unique one
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVON_Base.ovon.conversation.id = conversationID; // once set it is retained until SB restart
    OVON_Base.ovon.sender.from = "browser"; // in reality it is extracted from any invite browser sees
    return OVON_Base;
}

function bareInviteOVON(baseEnvelope, someAssistant ){
    const OVON_invite = {
        "eventType": "invite",
        "parameters": {
            "to": {
                "url": "https://someBotThatIsBeingInvited.com"
            }
        }
    }
    OVON_invite.parameters.to.url = someAssistant.assistant.serviceAddress;
    baseEnvelope.ovon.events.push(OVON_invite);
    return baseEnvelope;
}

function bareByeOVON( someAssistant ){
    const OVON_invite = {
        "eventType": "bye",
        "parameters": {
            "to": {
                "url": "https://someBotThatIsBeingSaidGoodbytTo.com"
            }
        }
    }
    OVON_invite.parameters.to.url = someAssistant.assistant.serviceAddress;
    return OVON_invite;
}

function buildUtteranceOVON( speaker, utteranceStr ){
    const OVON_Utterance = {
        "eventType": "utterance",
        "parameters": {
            "dialogEvent": {
                "speakerId": "someSpeakerID",
                "span": { "startTime": "2023-06-14 02:06:07+00:00" },
                "features": {
                    "text": {
                        "mimeType": "text/plain",
                        "tokens": [ { "value": "something to say to assistant"  } ]
                    }
                }
            }
        }
    }
    OVON_Utterance.parameters.dialogEvent.speakerId = speaker;
    d = new Date();
    OVON_Utterance.parameters.dialogEvent.span.startTime = d.toISOString();
    OVON_Utterance.parameters.dialogEvent.features.text.tokens[0].value = utteranceStr;
    
    return OVON_Utterance;
}

function buildWhisperOVON( speaker, whisperStr ){
    const name = speaker.name;
    const OVON_Whisper = {
        "eventType": "whisper",
        "parameters": {
            "dialogEvent": {
                "speakerId": name,
                "span": { "startTime": "2023-06-14 02:06:07+00:00" },
                "features": {
                    "text": {
                        "mimeType": "text/plain",
                        "tokens": [ { "value": whisperStr  } ]
                    }
                }
            }
        }
    }
    d = new Date();
    OVON_Whisper.parameters.dialogEvent.span.startTime = d.toISOString();
    OVON_Whisper.parameters.dialogEvent.features.text.tokens[0].value = whisperStr;
    return OVON_Whisper;
}

function startBareInvite() {
    localStorage.setItem("bareInviteSelected", "true");
    location.href = 'sbConverse.html';
}

function inviteWithUtterance() {
    const whisperMessage = document.getElementById("whisperMessage").value;
    if (whisperMessage.trim() !== "") {
        localStorage.setItem("InviteWithWhisper", "true");
        localStorage.setItem("whisperMessage", whisperMessage);
        location.href = 'sbConverse.html';
    } else {
        alert("Please enter a Whisper message before inviting.");
    }
}

function clearValue(OVONmsg) {
    const isInviteWithWhisper = localStorage.getItem("InviteWithWhisper") === "true";
    
    if (isInviteWithWhisper) {
        const whisperMessage = localStorage.getItem("whisperMessage");
        const ovonWhisper = buildWhisperOVON("someSpeakerID", whisperMessage);
        OVONmsg.ovon.events.push(ovonWhisper);
        
        localStorage.removeItem("InviteWithWhisper");
        localStorage.removeItem("whisperMessage");
    } else {
        // For Bare Invite, clear the value
        localStorage.removeItem("bareInviteSelected");
    }

   
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
    if( usingTTS){
        sbSpeak( text, assistantObject );
    }
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

  function checkEnterKey(event, callback) {
    if (event.key === "Enter") {
        callback();
    }
}

//Present the Assistant msgLOG html innerHTML string
function sendReply() {
    const utteranceText = document.getElementById("utterance").value;
    const whisperText = document.getElementById("whisper").value;

    const aIndex = localStorage.getItem("currentAssistantIndex");
    const baseEnvelope = baseEnvelopeOVON(assistantTable[aIndex]);

    // Add utterance event if utterance text is provided
    if (utteranceText.trim() !== "") {
        const ovonUtt = buildUtteranceOVON("someSpeakerID", utteranceText);
        baseEnvelope.ovon.events.push(ovonUtt);
    } else if (whisperText.trim() !== "") {
        // Add empty utterance event if only whisper text is provided
        const emptyUtt = buildUtteranceOVON("someSpeakerID", "");
        baseEnvelope.ovon.events.push(emptyUtt);
    }else{
        alert("Please provide a whisper");
        return;
    }


    // Add whisper event if whisper text is provided
    if (whisperText.trim() !== "") {
        const ovonWhisper = buildWhisperOVON("someSpeakerID", whisperText);
        // Insert the whisper event at index 1
        baseEnvelope.ovon.events.push(ovonWhisper);
    }

    // Set conversation ID and send to the assistant
    setEvelopeConvoID(baseEnvelope);
    sbPostToAssistant(assistantTable[aIndex], baseEnvelope);

    // Clear input fields
    document.getElementById("utterance").value = "";
    document.getElementById("whisper").value = "";
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
  
function setEvelopeConvoID( OVONmsg ){
    conversationID = localStorage.getItem( "currentConversationID" );
    if( conversationID == "" ){
        conversationID = "convoID_";
        conversationID += cleanDateTimeString();
        localStorage.setItem( "currentConversationID", conversationID );
    }
    OVONmsg.ovon.conversation.id = conversationID; //once set is retained until SB restart
}
