// File: ejSpeech.js
var voices = speechSynthesis.getVoices();
var recognition = new webkitSpeechRecognition(); // seems to only work on Chrome & Edge

var using_ejTalkCM = true;
var retASR = "";
var startTime = "";
var endTime = "";

var uttOVON_XML = "";
var uttOVON_JSON = "";

function startASR(){
  startTime = new Date().getTime();
  recognition.start();
}

recognition.onresult = function(event) {
  var nbestCnt = 0;
  var finalAsrText="";
  var finalConf = 1.0;
  var conf = 1.0;

  var exdate=new Date();
  endTime = exdate.getTime();

  // Builds JSON object for utterance
  // Pass it to ejTalk Conversation Manager

  var uttCount = localStorage.getItem( "uttCount" );
  localStorage.setItem( "uttCount", ++uttCount );
  var finalAsrText = event.results[0][0].transcript;
  finalAsrText = cleanOutPunctuation( finalAsrText);
  ejSetCookie( "ejLastInputUTT", finalAsrText );
  var conf = event.results[0][0].confidence;
  conf += .01;// So that the shit value of 0.0 doesn't ruin confidence calcs in the ejTalker
  conf = conf.toFixed(3);
  var duration = endTime - startTime;

  OVON_Input.OVON.mode = "input/voice";
  OVON_Input.OVON.originPointType = ejBrowserType;

  var assistantName = ejGetCookie( "ejAgentName" );
  var myHumansName = ejGetCookie( "humanName" );

  add_ids_OVON( OVON_Input, ejGetCookie("conversationID"), assistantName, myHumansName, uttCount );
  add_times_OVON( OVON_Input, startTime, duration, exdate.toUTCString() );
  add_resultFormat_OVON( OVON_Input, "text/plain", "en", "UTF-8", "webkitSpeechRecognition" );
  add_resultFinalComplete_OVON( OVON_Input, finalAsrText, conf );
   
  // Note: the Offset values are faked just to show what it would look like
  //--------------------------------------add_finalCompleteTokens_OVON( OVON_Input, finalAsrText, conf, duration ); // for simplicity now

  if (event.results.length > 1 ) { // load nBest ASR results if any
    add_nBest_OVON( OVON_Input, event )
  }

  // DO THIS LATER================================================
  /*
  OVON_Input.result.analysis.finalComplete.intent = "someIntention";
  OVON_Input.uttPackage.result.analysis.finalComplete.confidence = 0.96;
  OVON_Input.uttPackage.result.analysis.finalComplete.emotion = "ejAmbivalent";

  //Analysis has not been added here since this Origination Point only does ASR and TTS
  //  for this application the NLP processing is done on the server
  //  this is just an example
  
  OVON_Input.result.analysis.nBestAnalysis = [];
  for (var i=0; i < 1; i++ ){
    const nextToken = new Object();
    nextToken.nBest = new Object();
    nextToken.nBest.index = i;
    nextToken.nBest.intent = "someOtherIntention";
    nextToken.nBest.confidence = 0.72;
    nextToken.nBest.emotion = "ejHangry";
    OVON_Input.result.analysis.nBestAnalysis.push( nextToken );
  }
  */
//===============================================================

  localStorage.setItem( "thisExchPacketJSON", JSON.stringify( OVON_Input, null, "\t" ) );
  uttOVON_XML = convertJSONtoXML(OVON_Input);
  localStorage.setItem( "thisExchPacket", uttOVON_XML );

  var log = localStorage.getItem( "exchangePacket" ) + "\n"; //XML Version
  log += prettyXML( uttOVON_XML);
  localStorage.setItem( "exchangePacket", log );

  log = localStorage.getItem( "exchangePacketJSON" ) + "\n"; //JSON Version
  log += localStorage.getItem( "thisExchPacketJSON" );
  localStorage.setItem( "exchangePacketJSON", log );

  var wc = "assistantBrowser";
  buildSeqDiagJSON( "myHuman", wc, finalAsrText, finalAsrText, "" );
  buildSeqDiagJSON( wc, wc, "[[Client ASR]]", "Speech recognition via browser webKit", "" );
  buildSeqDiagJSON( wc, assistantName, "utterance[ASR]", "OVON Event string sent to Assistant", "" );
  buildSeqDiagJSON( assistantName, assistantName, "[[NLU/DIALOG]]", "Understand the words and do dialog management and biz logic", "" );
  
  var JSQ = JSON.stringify( seqDiagJSON );
  localStorage.setItem( "seqDiagJSON", JSQ );

  uttOVON_XML = "<ovonJSON>";
  uttOVON_XML += JSON.stringify( OVON_Input );
  uttOVON_XML += "</ovonJSON>";

  //ejHistory.push( OVON_Input );
  //sessionHistoryString = JSON.stringify(ejHistory, null, '\t');
  //localStorage.setItem( 'sessionHistory', sessionHistoryString );
  //var checkHist = localStorage.getItem( 'sessionHistory' );
  ejSaveHistoryToLocalStorage( OVON_Input );

  if( assistantName=="wizard" || assistantName=="ovon auto"){
    OVON_Human_Continuation.ovon.events[0]["parameters"]["dialog-event"].features.text.tokens[0].value = finalAsrText;
    ovonSend(assistantName, OVON_Human_Continuation );
  }
  
  ejGenericOVONInput( uttOVON_XML );
}

function ovonSend( assName, ovonMsg ){
  var thisAgent = ejGetAgentParams( assName );
  if( thisAgent ){
    vIndex = thisAgent.agent.voiceIndex;
    srv = thisAgent.agent.serviceAddress;
    cont = thisAgent.agent.contentType;
  }

  if( ejComObjectOVON == null ){
    try{
      ejComObjectOVON = new XMLHttpRequest();
    }catch(e){
      ejComObjectOVON = null;
      alert( 'Failed to make ejTalker communication object' );
      return false;
    }
    ejComObjectOVON.onreadystatechange=OVONstateChecker;
  }

  if( ejComObjectOVON != null ){ // it is good so use it
    ejComObjectOVON.open( 'POST', srv, true );
    ejComObjectOVON.send( null );
  }else{ // not so much
    alert( "Ajax object is NULL" );
  }
  setTimeout( "sendRequest( srv )", ejTimeOutMS );

  if( ejComObjectOVON != null ){  
    ejComObjectOVON.open( 'POST', srv, true );

    ejComObjectOVON.setRequestHeader("Content-type", cont);
    ejComObjectOVON.send( ovonMsg ); // send this to remote agent
  }
}
      
//build the TTS Voice <select> html innerHTML string
function loadVoiceSelect() {
  var ttsEngs = speechSynthesis.getVoices();

  var selCntl = '<label for="TTSVoices">Choose a TTS Voice:</label>';
  selCntl += '<select name="TTSVoices" id="ejTTS" onchange="saveTTSVoiceIndex();">';
  for (var i = 0; i < ttsEngs.length; i++) {
    selCntl += '<option value="';
    selCntl += i;
    selCntl += '">';
    selCntl += i + ": " + ttsEngs[i].name;
    selCntl += '</option>';
  }
  selCntl += "</select>";
  document.getElementById( 'information' ).innerHTML = selCntl;
  return;
}

function saveTTSVoiceIndex() {  
  var vInd = document.getElementById("ejTTS").selectedIndex;
  var msg = new SpeechSynthesisUtterance("How is this voice?");
  var voices = speechSynthesis.getVoices();
  msg.voice = voices[vInd];
  window.speechSynthesis.cancel(); // for some UNKNOWN reason this is needed on Win10 machines
  window.speechSynthesis.speak(msg);
}

function saveTTS_TestText() { 
  var test =  document.getElementById("ejTTS_Text").value;
  test += " ";
  ejSetCookie( "ejTestPhrase", document.getElementById("ejTTS_Text").value, 365 );
}

var thisSay;
function ejSpeak(say) {
  var ejAgentName = ejGetCookie( "ejAgentName" );
  thisSay = say;
  // New: use ejAgentName to assign the correct agent voice. Just for Edge for now
  vIndex = 2;
  aColor = "#ffffff";
  if( ejBrowserType == "chromium based edge"){
    thisAgent = ejGetAgentParams( ejAgentName );
    if( thisAgent ){
      vIndex = thisAgent.agent.voiceIndex;
      aColor = thisAgent.agent.lightColor;
    }
  }

  var msg = new SpeechSynthesisUtterance(say);
  var voices = speechSynthesis.getVoices();
  msg.voice = voices[vIndex];
  //msg.volume=0-1,msg.rate=0.1-10,msg.pitch=0-2,msg.text="stuff to say",msg.lang='en-US'

  msg.onend = function (event) {
    var ASRAutoRestart = ejGetCookie( "reListen" );
    startTime = new Date().getTime(); // for TYPING the startTime is the end of TTS
    if( ASRAutoRestart == "true" ){
      startASR();
    }
    processCommands();
  };

  window.speechSynthesis.cancel(); // for some UNKNOWN reason it's needed on Win10/11
  window.speechSynthesis.speak(msg);

  var ttsSW = ejGetCookie( "ejTTS_ON");
  if( ttsSW == 'false'){
    processCommands();
  }

  var log = localStorage.getItem( "exchangePacket" ) + "\n";
  log += prettyXML( ejRenderOVON );
  localStorage.setItem( "exchangePacket", log );
}

function processCommands(){
  var shortMessage = "utterance[TTS]]";
  var longMessage = "Send text to be spoken on the Client";

  var shortACtion = "";
  var longAction = "";
  var command = "";

  var clientAction = false;
  var ejAgentName = ejGetCookie( "ejAgentName" );
  var cmd = ejGetNextCommand();

  if( cmd.length > 0 ){ // has a command?
    while( cmd.length > 0 ){ // loop thru all the commands (if any)
      // <command>ejAgentTransfer=cassandra,resume.step.xml,localhost:15455</command>
      var fullCmd = cmd.split( "=" );
      var p = fullCmd[1].split( ",");
      command = fullCmd[0];
      if( fullCmd[0] == "ejAgentDelegate"){ // Goes to another agent "cold" (no context)
        command = "Assistant_Delegation";
        ejSetCookie( "ejAgentName", p[0] );

        // put the seqDiagram data after the ejLogonBasic call (which was relocated to the ejTalkerCallback?)
        clientAction = true;
        shortMessage +="/assistant-engage"
        longMessage += "/Send info for client to connect to the next Assistant"
        shortACtion = "[[New CONN]]";
        longAction = "Initiate the new connection to the delegated Assistant";

        // send a negociate message and wait for it to return in ejTalkerCallback function
        // then call the ejLogonBasic with the 3 parameters

        ejLogonBasic( "reLogon", p[1], p[2] );
      }else if( fullCmd[0] == "ejAgentHandoff"){ // Goes to another agent with context of reason to visit
        ejSetCookie( "ejAgentName", p[0] );

        clientAction = true;
        shortMessage +="/assistant-engage"
        longMessage += "/Send info for client to connect with context to the next Assistant"
        shortACtion = "[[New CONN]]";
        longAction = "Initiate the new connection with context to the delegated Assistant";
        
        ejLogonBasic( "agentHandOff", p[1], p[2] );
      }else if( fullCmd[0] == "assistant-engage"){ // Goes to another REMOTE agent with context of reason to visit
        ejSetCookie( "ejAgentName", p[0] );

        clientAction = true;
        shortMessage +="/assistant-engage"
        longMessage += "/Send info for client to connect with context to the next Assistant"
        shortACtion = "[[New CONN]]";
        longAction = "Initiate the new connection with context to the delegated Assistant";

        if( p[0] == "wizard" ){
          ejTestOtherSrv( "ALAN" );
          ejSetCookie( "ejAgentName", "wizard" );
        }else if( p[0] == "ovon auto"){
          ejTestOtherSrv( "DD" )
          ejSetCookie( "ejAgentName", "ovon auto" );
        }
        //ejSetCookie( "ejAgentName", "cassandra" );

      }else if( fullCmd[0] == "ejAgentNegociate"){ // not sure if this is needed as an atomic action (done before delegation automatically? see above)
      }else if( fullCmd[0] == "ejDisplayURL_newWindow"){
        newWindow = window.open( p[0], "_blank" );
      }
      cmd = ejGetNextCommand();
    }
  }
  var wc = "assistantBrowser";
  buildSeqDiagJSON( ejAgentName, wc, shortMessage, longMessage, "" );
  buildSeqDiagJSON( wc, wc, "[[Client TTS]]", "Speech synthesis via browser webKit", ejAgentName );
  buildSeqDiagJSON( wc, "myHuman", thisSay, thisSay, ejAgentName );
  if( clientAction ){ // think about when there is more than one "command" being done
    buildSeqDiagJSON( wc, wc, shortACtion, longAction, ejGetCookie( "ejAgentName" ) );
    //NOTE: We are getting agent from cookie since  it may have changed with an agent switch



// This is the pattern for OVON Negotiates (hack for now)
const OVON_Negotiate = {
  OVON: {
    mode: "negotiate/isAvailable",
    response: "none",
    ID: {
      conversation: "",
    },

  }
}
add_ids_OVON( OVON_Negotiate, ejGetCookie("conversationID"), ejGetCookie( "ejAgentName" ), ejGetCookie( "humanName" ), localStorage.getItem( "uttCount" ) );


    //buildSeqDiagJSON( wc, ejGetCookie( "ejAgentName" ), "Negotiate_isAvailable", "", "" ); // ask if ass is available
    //ejSaveHistoryToLocalStorage( OVON_Negotiate );

    //OVON_Negotiate.OVON.response = "200_Ready";
    //buildSeqDiagJSON( ejGetCookie( "ejAgentName" ), wc, "200_Ready", "", "" ); // ass confirms available
    //ejSaveHistoryToLocalStorage( OVON_Negotiate );

    buildSeqDiagJSON( wc, ejGetCookie( "ejAgentName" ), command, "", "" ); 


    buildSeqDiagJSON( ejGetCookie( "ejAgentName" ), ejGetCookie( "ejAgentName" ), "[[INITIALIZE]]", "", "" );
  }
  var JSQ = JSON.stringify( seqDiagJSON, null, "\t" );
  localStorage.setItem( "seqDiagJSON", JSQ );
}


function ejTypeInput( inputHTMLID ) {
  var typedText = document.getElementById( inputHTMLID ).value;
  ejSetCookie( "ejLastInputUTT", typedText );

  if ( typedText != null && typedText != "" ){
    buildOVON_InputTyping( typedText );
    //var packet = localStorage.getItem( "thisExchPacket" );

    var packet = "<ovonJSON>";
    packet += JSON.stringify( OVON_Input );
    packet += "</ovonJSON>";

    ejGenericOVONInput( packet );

  }
}
