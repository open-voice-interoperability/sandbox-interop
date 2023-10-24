// Manage all the known Assistants

function ejGetAgentParams( someAgentName ){ //return object for this agent
  for (let i = 0; i < assistantTable.length; i++) {
    if( assistantTable[i].assistant.name === someAgentName ){
      return assistantTable[i];
    }
  }
}

//build the Assistant <select> html innerHTML string
function loadAssistantSelect() {
  var selCntl = '<label for="AssistantList">Choose an Assistant:</label>';
  selCntl += '<select name="startAssistant" id="sbAssist" onchange="saveAssistantIndex();">';
  for (var i = 2; i < assistantTable.length; i++) { // note avoid the first two
    selCntl += '<option value="';
    selCntl += i;
    selCntl += '">';
    selCntl += i + ": " + assistantTable[i].assistant.name;
    selCntl += '</option>';
  }
  selCntl += "</select>";
  document.getElementById( 'assistantSelect' ).innerHTML = selCntl;
  return;
}

function saveAssistantIndex() {  
  selectedAssistantIndex = document.getElementById("sbAssist").selectedIndex;
  selectedAssistantIndex += 2; // note avoid the first two
  localStorage.setItem( "currentAssistantIndex", selectedAssistantIndex );
 }
    
// Use this to get colors, urls, (eventually TTS voice index, etc)
// Get Assistant Info in your Browser JS like this:
/*
	thisAgent = ejGetAgentParams( voiceName );
        if( thisAgent ){
          vIndex = thisAgent.assistant.voiceIndex;
          aColor = thisAgent.assistant.lightColor;
        }
*/
// ...

var selectedAssistantIndex = 0; // Global Index
const assistantTable = [
    {
      assistant: {
        name: "myHuman",
        voiceIndex: 666,
        lightColor: "#ff6666",
        markerColor: "#b30000",
        serviceName: "HumanUser",
        serviceAddress: "OriginationPoint",
        authCode: "hugi666ikjjerg",
      }
    },
    {
      assistant: {
      name: "assistantBrowser",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#000000",
      serviceName: "AssistantCommunications",
      serviceAddress: "localhost:15445",
      authCode: "456398nns",
    }
  },
  {
    assistant: {
      name: "Eva",
      voiceIndex: 142,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "localhost:15445",
      authCode: "h229k00m8bv",
      contentType: "application/json",
    }
  },
  {
    assistant: {
      name: "Jake",
      voiceIndex: 141,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "WeatherAssistant",
      serviceAddress: "localhost:15445",
      authCode: "lekg99k9e",
      contentType: "application/json",
    }
  },
  {
    assistant: {
      name: "wizard",
      voiceIndex: 133,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "DaVinci_LLM",
      serviceAddress: "https://www.asteroute.com/ovontest",
      authCode: "69jjg45cf0",
      contentType: "application/x-www-form-urlencoded",
    }
  },
  {
    assistant: {
      name: "ovon_auto",
      voiceIndex: 142,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "Debbie_OVONAUTO",
      serviceAddress: "https://secondAssistant.pythonanywhere.com",
      authCode: "69jjg45cf0",
      contentType: "application/json",
    }
  },
  {
    assistant: {
      name: "cassandra",
      voiceIndex: 115,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:15455/ejCassandra",
      authCode: "h229k00m8bv",
      contentType: "application/x-www-form-urlencoded",
    }
  }
  {
    assistant: {
      name: "Burokratt",
      voiceIndex: 142,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "Estonia",
      serviceAddress: "https://dev.buerokratt.ee/ovon",
      authCode: "h229k00m8bv",
      contentType: "application/x-www-form-urlencoded",
    }
  }
]
//      serviceAddress: "http://localhost:15455/clientEvent",
