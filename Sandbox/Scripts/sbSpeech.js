// File: sbSpeech.js
var voices = speechSynthesis.getVoices();
var recognition = window.SpeechRecognition || window.webkitSpeechRecognition ? new (window.SpeechRecognition || window.webkitSpeechRecognition)() : null;

//var using_ejTalkCM = true;
var retASR = "";
var startTime = "";
var endTime = "";

//var uttOVON_XML = "";
var uttOVON_JSON = "";
var usingASR = false;
var usingTTS = true;
var useLLM = false;

function sbStartASR(){
  usingASR = true;
  startTime = new Date().getTime();
  var img = document.getElementById('microphoneIcon');
  img.src = "../Media/img/micListening.jpg";
  recognition.start();
}

recognition.onresult = function(event) {
  var nbestCnt = 0; //nBests in the future?
  var finalAsrText="";
  var conf = 1.0;

  var exdate=new Date();
  endTime = exdate.getTime();

  var img = document.getElementById('microphoneIcon');
  img.src = "../Media/img/Interoperability_Logo_icon_color.jpg";

  usingASR = false; // so you can type for the next turn
  // Builds JSON object for utterance
  // Pass it to ejTalk Conversation Manager

  var uttCount = localStorage.getItem( "uttCount" );
  localStorage.setItem( "uttCount", ++uttCount );
  var finalAsrText = event.results[0][0].transcript;
  finalAsrText = cleanOutPunctuation( finalAsrText);
  localStorage.setItem( "sbLastInputUTT", finalAsrText );
  document.getElementById("utterance").value = finalAsrText;
  var conf = event.results[0][0].confidence;
  conf += .01; // So "0" doesn't lead to disregarding it
  conf = conf.toFixed(3);
  
  // DO THIS LATER ???================================================
  /*
  if (event.results.length > 1 ) { // load nBest ASR results if any
    add_nBest_OVON( OVON_Input, event )
  }

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

  var wc = "assistantBrowser";
  buildSeqDiagJSON( "myHuman", wc, finalAsrText, finalAsrText, "" );
  buildSeqDiagJSON( wc, wc, "[[Client ASR]]", "Speech recognition via browser webKit", "" );
  buildSeqDiagJSON( wc, assistantName, "utterance[ASR]", "OVON Event string sent to Assistant", "" );
  buildSeqDiagJSON( assistantName, assistantName, "[[NLU/DIALOG]]", "Understand the words and do dialog management and biz logic", "" );
  
  var JSQ = JSON.stringify( seqDiagJSON );
  localStorage.setItem( "seqDiagJSON", JSQ );

  //=============
  // build the msg here and then send it
  // sbPostToAssistant( assistantObject, OVONmsg )
  if( useLLM ){
    sbPostToLLM( finalAsrText );
  }else{
    sendReply();
  }
  //=============
}

function cleanOutPunctuation( str ){
  str = str.replace( "?", "" );
  str = str.replace( ".", "" );
  str = str.replace( ",", "" );
  str = str.replace( "!", "" );
  return str;
}

function loadLangSelect(){
    var ttsEngs = speechSynthesis.getVoices();
    var selCntl = '<label for="langBtn">Select Language:</label>';
    selCntl += '<select id="langSelect" onchange="loadVoiceSelect();">';
    var uniqueLangs = new Set();
    for (var j = 0; j < ttsEngs.length; j++) {
        if (j !== 115) {
          var lang = ttsEngs[j].lang; // Get the language code
          uniqueLangs.add(lang);
        }
    }
    var sortedLangs = Array.from(uniqueLangs).sort();
    
    // Iterate over the unique language codes and add them to the select element
    sortedLangs.forEach(function (lang) {
        selCntl += '<option value="' + lang + '">' + lang + '</option>';
    });
    selCntl += '</select>';
    document.getElementById('langInfo').innerHTML = selCntl;
}
// build the TTS Voice <select> html innerHTML string
function loadVoiceSelect() {
  var langSelect = document.getElementById('langSelect');
  var selectedLang = langSelect.value;
  var selCntl = '<br><label for="TTSVoices">Choose a TTS Voice:</label>';
  selCntl += '<select name="TTSVoices" id="sbTTS" onchange="saveTTSVoiceIndex();">';
  for (var i = 0; i < ttsEngs.length; i++) {
      if (i !== 115) {
        var voiceName = voices[i].name;
        selCntl += '<option value="' + i + '">' + i + ": " + voices[i].name + '</option>';
      }
    }
    
    selCntl += "</select>";
    document.getElementById('information').innerHTML = selCntl;
    // Set the default selected index
    var firstOptionValue = document.getElementById('sbTTS').options[0].value;
    localStorage.setItem('voiceIndex', firstOptionValue);
  
}

var lastSelectedVoices = [];
function updateSelectedVoiceInfo() {
  var ttsEngs = speechSynthesis.getVoices();
  var selectedIndex = document.getElementById('sbTTS').value;
  var selectedVoiceName;
  
  for (var j = 0; j < ttsEngs.length; j++) {
    if (j == selectedIndex && j !== 115) {
      var voiceName = ttsEngs[j].name;
        selectedVoiceName = j + ': ' + voiceName;
        break; // No need to continue the loop once the voice is found
    }
  }
  var selectedVoiceInfoElement = document.getElementById('selectedVoiceInfo');
  if (selectedVoiceName) {
    // Push the selected voice name into the array
    lastSelectedVoices.push(selectedVoiceName);
    // Keep only the last two selected voices in the array
    if (lastSelectedVoices.length > 10) {
      lastSelectedVoices.shift(); // Remove the oldest voice name
    }
    // Display the last 2 selected voices along with the current voice
    selectedVoiceInfoElement.innerHTML =
    '<br><b>Last Selected Voices: <br></b>' + lastSelectedVoices.join('</br>') + '\n';
  } else {
    selectedVoiceInfoElement.innerHTML = 'No voice selected.';
  }
}

function updateSpeechParams() {
  var volume = parseFloat(document.getElementById("volume").value);
  var rate = parseFloat(document.getElementById("rate").value);
  var pitch = parseFloat(document.getElementById("pitch").value);
  console.log("Volume:", volume, "Rate:", rate, "Pitch:", pitch);
  var msg = new SpeechSynthesisUtterance();
  msg.volume = volume;  // 0 to 1
  msg.rate = rate;      // 0.1 to 10
  msg.pitch = pitch;    // 0 to 2

  // Get the selected voice index
  var selectedIndex = document.getElementById('sbTTS').value;

  // Ensure voices are available
  var voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Ensure the selected voice index is within bounds
    selectedIndex = Math.min(Math.max(0, selectedIndex), voices.length - 1);

    // Set the selected voice for the utterance
    msg.voice = voices[selectedIndex];
  } else {
    console.error("No voices available.");
  }

  // Test the updated voice settings
  msg.text = document.getElementById('sbTTS_Text').value;

  // Cancel any ongoing speech synthesis
  window.speechSynthesis.cancel();

  // Speak the new utterance with updated parameters
  window.speechSynthesis.speak(msg);
}

function openVoiceWindow() {
  window.open('sbVoices.html', '_blank');
}

function saveTTSVoiceIndex() {  
  var vInd = document.getElementById("sbTTS").value;
  var voices = speechSynthesis.getVoices().filter(function(voice) {
    return voice.name;
  });

  if (vInd >= 0 && vInd < voices.length) {
    var selectedVoice = voices[vInd];
    localStorage.setItem("voiceIndex", vInd);
  } else {
    console.error("Invalid voice index:", vInd);
  }
  say = document.getElementById("sbTTS_Text").value;
  updateSelectedVoiceInfo();
  sbSpeak(say ,assistantObject);
}

function saveTTS_TestText() { // allow setting a "test phrase" to be set
  var test =  document.getElementById("sbTTS_Text").value;
  test += " ";
  localStorage.setItem( "sbTTSTestPhrase", test );
  updateSelectedVoiceInfo();
  sbSpeak(test, assistantObject);
}

function sbSpeak( say, assistantObject ) {
  var v = 2; // Default to index=2
  var aColor = "#555555";
  var voices = speechSynthesis.getVoices();
 
  if (sbBrowserType === "chromium based edge" && assistantObject) {
    setTimeout(function () {
      //var voices = speechSynthesis.getVoices();
      v = localStorage.getItem("voiceIndex");
      v = (v == 115) ? 116 : v;
      v = (v == 4255) ? 115 : v;
      aColor = assistantObject.assistant.lightColor;

      // Ensure the selected voice index is within bounds
      v = Math.min(Math.max(0, v), voices.length - 1);

      var msg = new SpeechSynthesisUtterance(say);
      msg.voice = voices[v];
      //msg.volume=0-1,msg.rate=0.1-10,msg.pitch=0-2,msg.text="stuff to say",msg.lang='en-US'
      msg.onend = function (event) {
        startTime = new Date().getTime(); // for TYPING the startTime is the end of TTS
        // Do something at the end of the TTS speech?????
      };
      window.speechSynthesis.cancel(); // for some UNKNOWN reason it's needed on Win10/11
      window.speechSynthesis.speak(msg);
    }, 100);
  }else if(sbBrowserType === "chrome" && assistantObject){
    aColor = assistantObject.assistant.lightColor;
    v = localStorage.getItem("voiceIndex");
    v = Math.min(Math.max(0, v), voices.length - 1); // Ensure voice index in bounds

    var msg = new SpeechSynthesisUtterance(say);
    msg.voice = voices[v];
    msg.onend = function (event) {
      startTime = new Date().getTime(); // for TYPING the startTime is the end of TTS
    };
    window.speechSynthesis.cancel(); // for some UNKNOWN reason it's needed on Win10/11
    window.speechSynthesis.speak(msg);
  }
  else if (sbBrowserType === "safari" && assistantObject) {
  aColor = assistantObject.assistant.lightColor;
  var voices = speechSynthesis.getVoices();
  var v = localStorage.getItem("voiceIndex");
  v = Math.min(Math.max(0, v), voices.length - 1); // Ensure voice index in bounds

  var msg = new SpeechSynthesisUtterance(say);
  msg.voice = voices[v];
  msg.onend = function (event) {
    startTime = new Date().getTime(); // for TYPING the startTime is the end of TTS
  };
  window.speechSynthesis.cancel(); // for some UNKNOWN reason it's needed on Win10/11
  window.speechSynthesis.speak(msg);
} else {
  // Handle other browsers or provide a fallback
  console.error("Browser not supported");
}
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

  var JSQ = JSON.stringify( seqDiagJSON, null, "\t" );
  localStorage.setItem( "seqDiagJSON", JSQ );
}

function sbTypeInput( inputHTMLID ) {
  var typedText = document.getElementById( inputHTMLID ).value;
  localStorage.setItem( "sbLastInputUTT", typedText );

  if ( typedText != null && typedText != "" ){
    //=============
    // build the msg here and then send it
    // sbPostToAssistant( assistantObject, OVONmsg )
    //=============
  }
}
