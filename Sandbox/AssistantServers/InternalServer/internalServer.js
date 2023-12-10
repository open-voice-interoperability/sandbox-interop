// branch to a JavaScript based server in here
var invite = false;
var bye = false;
var utterance = false;
var whisper = false;
var utteranceText = "";
var whisperText = "";
var humanName = "Human";
var respEnvelope;
var sbLLM_CommObject;
var LLMLog = [];
var sendDiscoveryJSON;
var discoverTurns = 0;
var aiCallType = "https://api.openai.com/v1/chat/completions";
var aiModel = "gpt-3.5-turbo";
var startPrompt = "You are an assistant that will help the human user discover the domain expertise required by the human to complete their task. You will accept a phrase or sentence as a starting point and ask questions that help focus on the general expertise that is needed to help the human. Your responses will be friendly and conversational. You will try to keep your responses to less than 40 words .Your questions for clarification can and should be leading and suggestive enough to prompt the user to give clearer answers. The result of this conversation will be a single word or short phrase that identifies the domain expertise for the assistant they require.  This conversation should be no longer than two or three turns. You will return the resulting domain in the form *Domain = [the domain that you discovered with this conversation]";

function callInternalAssistant( assistName, assistantObject, OVONmsg ){
    respEnvelope = baseEnvelopeOVON( assistantObject );
    if( assistName == "discovery"){
        findEvents( OVONmsg.ovon.events );
        if( invite ){
            temp = parseFloat( localStorage.getItem( "AITemp" ) );
            if( whisperText != ""){
                discoverLLMPrep( aiModel, whisperText, temp );
            }else{
                discoverLLMPrep( aiModel, startPrompt, temp );
            }
            if( utterance ){
                sbLLMPost( utteranceText );
            }
        }else{
            if( utterance && (discoverTurns == 0)){
                sbLLMPost( utteranceText );
            }else{
                ovonUtt = buildUtteranceOVON( assistName, "You must invite the assistant first." );
                respEnvelope.ovon.events.push(ovonUtt);        
            }
        }
    }else{
        ovonUtt = buildUtteranceOVON( assistName, "This assistant does not exist." );
        respEnvelope.ovon.events.push(ovonUtt);
    }
    return;
}

function discoverLLMPrep( model, prompt, temp ) {
    sendDiscoveryJSON = {
      "model": model,
      // e.g. "model": "gpt-3.5-turbo",
        "temperature": temp, //0.0 - 2.0
        "messages": []
    }
    discoverTurns = 0;
    sendDiscoveryJSON.messages.push( sbAddMsg( "assistant", prompt ) );
}

function sbAddMsg( role, input ) {
    const roleContent = {"role": "", "content": ""};
    roleContent.role = role;
    roleContent.content = input;
    return roleContent;
}

function findEvents( eventArray ){
    invite = false;
    bye = false;
    utterance = false;
    whisper = false;
    utteranceText = "";
    whisperText = "";
    
    for (let i = 0; i < eventArray.length; i++) {
        type = eventArray[i].eventType;
        humanName = eventArray[i].eventType;
        if(type == "invite"){
            invite = true;
        }else if(type == "bye"){
            bye = true;
        }else if(type == "utterance"){
            utterance = true;
            utteranceText = eventArray[i].parameters.dialogEvent.features.text.tokens[0].value;
            humanName = eventArray[i].parameters.dialogEvent.speakerId;
        }else if(type == "whisper"){
            whisper = true;
            whisperText = eventArray[i].parameters.dialogEvent.features.text.tokens[0].value;
        }
    }           
}

function sbLLMPost( input ) { //send to LLM
    if( sbLLM_CommObject == null ){
      try{
        sbLLM_CommObject = new XMLHttpRequest();
      }catch(e){
        sbLLM_CommObject = null;
        alert( 'Failed to make LLM communication object' );
        return false;
      }
      sbLLM_CommObject.onreadystatechange=sbLLMPostResp;
    }
  
    if( sbLLM_CommObject != null ){  
      sbLLM_CommObject.open( 'POST', aiCallType, true ); // false = async
  
      key = "Bearer " + localStorage.getItem( "OpenAIKey");
      sbLLM_CommObject.setRequestHeader('Authorization', key );
      sbLLM_CommObject.setRequestHeader('Content-Type', "application/json" );
  
      sendDiscoveryJSON.messages.push( sbAddMsg( "user", input ) );
      jsonSENT = JSON.stringify( sendDiscoveryJSON );
      sbLLM_CommObject.send( jsonSENT ); // send to server (compressed string)

      jsonSENT = JSON.stringify( sendDiscoveryJSON, null, 2 ); //make it pretty for display
      var targ = document.getElementById("msgSENT");
      targ.innerHTML = jsonSENT;
  
      jsonLOG += jsonSENT;
      localStorage.setItem( "jsonLOG", jsonLOG );
      const sentMessage = {
        direction: 'sent',
        timestamp: new Date().toISOString(),
        content: jsonSENT,
      };
  
      LLMLog.push(sentMessage);
      localStorage.setItem('LLMLog', JSON.stringify(LLMLog, null, 2 ));
    }
}
  
function sbLLMPostResp(){ // should something come in do this
    if( sbLLM_CommObject.readyState == 4 ){
        if( sbLLM_CommObject.status == 200 ){
            sbData = sbLLM_CommObject.responseText;
            if( sbData.length ){
                retLLMJSON = JSON.parse(sbData);  
                var text = retLLMJSON.choices[0].message.content; // what LLM "says"
                sendDiscoveryJSON.messages.push( sbAddMsg( "assistant", text ) ); // keeping the convo context

                jsonRECEIVED = JSON.stringify( retLLMJSON, null, 2 );
                const receivedMessage = {
                    direction: 'received',
                    timestamp: new Date().toISOString(),
                    content: jsonRECEIVED,
                };
                LLMLog.push(receivedMessage);
                localStorage.setItem('LLMLog', JSON.stringify(LLMLog, null, 2 ));

                ovonUtt = buildUtteranceOVON( localStorage.getItem('assistantName'), text );
                respEnvelope.ovon.events.push(ovonUtt);        
                handleReturnedOVON( respEnvelope );
            }
        }
    }
}
  