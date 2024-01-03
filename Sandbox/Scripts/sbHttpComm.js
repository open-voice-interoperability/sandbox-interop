var sbOVON_CommObject = null; // used to send http messages 
var retOVONJSON; // the "returned OVON message from an assistant"
var textColor = "#ffffff";
var voiceIndex = 0;
var sbTimeout = 10000;
var remoteURL = "";
var contentType = "application/json";
var jsonLOG;
var conversationLOG = [];

function sbPostToAssistant( assistantObject, OVONmsg ) { //send to their server
  remoteURL = localStorage.getItem('serviceAddress');
  assistType = remoteURL.split(':');
  textColor = assistantObject.assistant.markerColor;
  localStorage.setItem('markerColor', textColor); // This may be right BUT review this
  voiceIndex = assistantObject.assistant.voiceIndex;
  contentType = assistantObject.assistant.contentType;
  assistantName = assistantObject.assistant.name;
  localStorage.setItem('assistantName', assistantName);
  document.getElementById("AssistantName").value = assistantName;
  jsonSENT = JSON.stringify( OVONmsg, null, 2 );

  if( assistType[0] == "internal" ){
    callInternalAssistant( assistType[1], assistantObject, OVONmsg );
    //handleReturnedOVON( retOVONJSON ) // Note: Done in the LLM call above
  }else if( assistType[0] == "internalLLM" ){
    callInternalLLM( assistType[1], assistantObject, OVONmsg );
  }else{
    if( sbOVON_CommObject == null ){
      try{
        sbOVON_CommObject = new XMLHttpRequest();
      }catch(e){
        sbOVON_CommObject = null;
        alert( 'Failed to make sandbox communication object' );
        return false;
      }
      sbOVON_CommObject.onreadystatechange=sbOVONstateChecker;
    }
    //setTimeout( "sendRequest( remoteURL )", sbTimeout );
    if( sbOVON_CommObject != null ){  
      sbOVON_CommObject.open( 'POST', remoteURL, true ); // false makes it async
              if( contentType != "none"){  // UGLY HACK JUST TO MAKE "wizard" work
                sbOVON_CommObject.setRequestHeader('Content-Type', contentType ); } // END OF UGLY HACK!!!!!
      sbOVON_CommObject.send( JSON.stringify( OVONmsg ) ); // send to server
    }
  }

  var targ = document.getElementById("msgSENT");
  targ.innerHTML = jsonSENT; 
  const sentMessage = {
    direction: 'sent',
    timestamp: new Date().toISOString(),
    content: jsonSENT,
  };
  conversationLOG.push(sentMessage);
  localStorage.setItem('conversationLog', JSON.stringify(conversationLOG));
}

function sbOVONstateChecker(){ // when POST response appears do this
  if( sbOVON_CommObject.readyState == 4 ){
    if( sbOVON_CommObject.status == 200 || sbOVON_CommObject.status == 201 ){
      sbData = sbOVON_CommObject.responseText;
      if( sbData.length ){
        retOVONJSON = JSON.parse(sbData);
        handleReturnedOVON( retOVONJSON );
      }
    }
  }
}

function handleReturnedOVON( OVON_msg ){
  jsonRECEIVED = JSON.stringify( OVON_msg, null, 2 );
  const myArray = jsonRECEIVED.split("\n");

  var targ = document.getElementById("msgRECEIVED");
  targ.innerHTML = jsonRECEIVED;
  displayMsgRECEIVED(jsonRECEIVED, localStorage.getItem('markerColor'));
  const receivedMessage = {
    direction: 'received',
    timestamp: new Date().toISOString(),
    content: jsonRECEIVED,
  };
  conversationLOG.push(receivedMessage);
  localStorage.setItem('conversationLog', JSON.stringify(conversationLOG));
  serviceEventsOVON( OVON_msg );
}

function RenderResponseOVON( oneEvent, indx, arr ){
  // set some global values to process in different order if needed
  //   in the serviceEventsOVON calling function
  const type = oneEvent.eventType;
  if( type == "utterance" ){
    say = oneEvent.parameters.dialogEvent.features.text.tokens[0].value;
    displayResponseUtterance( say, textColor); // NOTE: This speaks too!
  }else if( type == "bye"){
//  Do "invite" to the PREVIOUS Assistant???
//}else if( type == "invite"){
//  Do "invite" to a NEW Assistant
  }
}

function serviceEventsOVON( OvonJson ){
  OvonJson.ovon.events.forEach(RenderResponseOVON);
}

var transferFileData;
function readSBFile( pathFromRoot, callBackFunction ){
  var url = pathFromRoot;
  transferFileData = "sbWait";
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onreadystatechange = function() {
      if (request.readyState === 4) {  // document is ready to parse.
          if (request.status === 200) {  // file is found
            callBackFunction( request.responseText );
            //transferFileData = request.responseText;
          }
      }
  }
  request.send();
}

function writeSBFile( fileName, data ){
  var request = new XMLHttpRequest();
  readFileData = "";
  var fullPath = '../Report/Logs/' + fileName
  request.open("PUT", fullPath, true);
  request.onreadystatechange = function() {
      if (request.readyState === 4) {  // document is ready
          if (request.status === 200) {  // file was written???
            readFileData = request.responseText;
          }
      }
  }
  request.send( data );
}

function getDirectoryList( pathFromRoot ){
  var url = pathFromRoot;
  var request = new XMLHttpRequest();
  readFileData = "";
  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function() {
      if (request.readyState === 4) {  // document is ready to parse.
          if (request.status === 200) {  // file is was written???
            readFileData = request.responseText;
          }
      }
  }
  fType = "sbDirectory"
  request.send(fType);
}