var sbOVON_CommObject = null; // used to send http messages 
var retOVONJSON;
var textColor = "#ffffff";
var voiceIndex = 0;
var sbTimeout = 10000;
var remoteURL = "";
var contentType = "application/json";
var jsonLOG;
var conversationLOG = [];

function sbPostToAssistant( assistantObject, OVONmsg ) { //send to their server
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

  remoteURL = assistantObject.assistant.serviceAddress;
  textColor = assistantObject.assistant.markerColor;
  voiceIndex = assistantObject.assistant.voiceIndex;
  contentType = assistantObject.assistant.contentType;
  assistantName = assistantObject.assistant.name;
  
  //setTimeout( "sendRequest( remoteURL )", sbTimeout );
  if( sbOVON_CommObject != null ){  
    jsonSENT = JSON.stringify( OVONmsg, null, 2 );
    sbOVON_CommObject.open( 'POST', remoteURL, true );
          //sbOVON_CommObject.setRequestHeader('Content-Type', contentType );
    if( assistantName == "einstein"){ // hack for openAI
      input = OVONmsg.ovon.events[0].eventType;
      if( input == "utterance"){
        input = OVONmsg.ovon.events[0].parameters.dialogEvent.features.text.tokens[0].value;
        sbOVON_CommObject.setRequestHeader('Authorization', "Bearer YourAuthCodeHere" );
        sbOVON_CommObject.setRequestHeader('Content-Type', "application/json" );
        jsonSENT = '{"model": "gpt-3.5-turbo","messages": [{"role": "user", "content": "'
        jsonSENT += input;
        jsonSENT += '."}],"temperature": 0.7}'
        sbOVON_CommObject.send( jsonSENT ); // send to server
      }
    }else{
      sbOVON_CommObject.send( JSON.stringify( OVONmsg ) ); // send to server
      var targ = document.getElementById("msgSENT");
      targ.innerHTML = jsonSENT;
    }

    jsonLOG += jsonSENT;
    localStorage.setItem( "jsonLOG", jsonLOG );
    const sentMessage = {
      direction: 'sent',
      timestamp: new Date().toISOString(),
      content: jsonSENT,
    };
    
    conversationLOG.push(sentMessage);
    localStorage.setItem('conversationLog', JSON.stringify(conversationLOG));
  }
}

function sbOVONstateChecker(){ // should something come in do this
  if( sbOVON_CommObject.readyState == 4 ){
    if( sbOVON_CommObject.status == 200 ){
      sbData = sbOVON_CommObject.responseText;
      if( sbData.length ){
        var textColor = localStorage.getItem('markerColor');
        retOVONJSON = JSON.parse(sbData);
        jsonRECEIVED = JSON.stringify( retOVONJSON, null, 2 );
        var targ = document.getElementById("msgRECEIVED");
        targ.innerHTML = jsonRECEIVED;
        console.log(jsonRECEIVED);
        displayMsgRECEIVED(jsonRECEIVED, textColor); //
        jsonLOG += jsonRECEIVED;
        localStorage.setItem( "jsonLOG", jsonLOG );
        const receivedMessage = {
          direction: 'received',
          timestamp: new Date().toISOString(),
          content: jsonRECEIVED,
        };
        conversationLOG.push(receivedMessage);
        localStorage.setItem('conversationLog', JSON.stringify(conversationLOG));
        serviceEventsOVON( retOVONJSON );
      }
    }
  }
}

function RenderResponseOVON( oneEvent, indx, arr ){
  const type = oneEvent.eventType;
  if( type == "utterance" ){
    say = oneEvent.parameters.dialogEvent.features.text.tokens[0].value;  
    displayResponseUtterance( say, textColor);
    //OvonSpeak( say, voiceIndex );
//}else if( type == "bye"){
//  Do "invite" to the PREVIOUS Assistant
//}else if( type == "invite"){
//  Do "invite" to a NEW Assistant
  }
}

function serviceEventsOVON( OvonJson ){
  OvonJson.ovon.events.forEach(RenderResponseOVON);
}

var transferFileData;
function readSBFile( pathFromRoot ){
  var url = pathFromRoot;
  var request = new XMLHttpRequest();
  readFileData = "";
  request.open("GET", url, true);
  request.onreadystatechange = function() {
      if (request.readyState === 4) {  // document is ready to parse.
          if (request.status === 200) {  // file is found
            document.getElementById('fileData').innerHTML = request.responseText;
          }
      }
  }
  request.send();
}

function writeSBFile( fileName, data ){
  var request = new XMLHttpRequest();
  readFileData = "";
  request.open("PUT", fileName, true);
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