var selectedAssistantIndex = 0;

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
  selCntl += '<option value="" disabled selected>Select an Assistant</option>';

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
  selectedAssistantIndex = selectedAssistantIndex >= 2 ? selectedAssistantIndex + 1 : 2; 
  localStorage.setItem( "currentAssistantIndex", selectedAssistantIndex );
 }
    // Function to handle assistant selection change
function handleAssistantSelectionChange() {
  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  if (selectedAssistantIndex !== "") {
    // Assistant is selected, show the settings
    document.getElementById("assistantSettings").style.display = 'block';
    var selectedAssistantIndex = document.getElementById("sbAssist").value;
    var selectedAssistant = assistantTable[selectedAssistantIndex].assistant;
    localStorage.setItem("voiceIndex", selectedAssistant.voiceIndex);
    localStorage.setItem("assistantName", selectedAssistant.name);
    localStorage.setItem("markerColor", selectedAssistant.markerColor);
    displayAssistantSettings();
  } else {
    // No assistant selected, hide the settings
    document.getElementById('assistantSettings').style.display = 'none';
  }
}

function generateRandomID() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const getRandomChar = (characters) => characters.charAt(Math.floor(Math.random() * characters.length));

  const randomID = getRandomChar(letters) + getRandomChar(letters) + getRandomChar(numbers) + getRandomChar(numbers);

  return randomID;
}


function getAssistantID(assistantName) {
  // Retrieve the ID from localStorage, or generate a new one if it doesn't exist
  let assistantID = localStorage.getItem(`${assistantName}_assistantID`);
  if (!assistantID) {
    assistantID = `${assistantName}_${generateRandomID()}`;
    localStorage.setItem(`${assistantName}_assistantID`, assistantID);
  }
  return assistantID;
}

// Function to display assistant settings
function displayAssistantSettings() {
  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  var selectedAssistant = assistantTable[selectedAssistantIndex];
  const uniqueID = getAssistantID(selectedAssistant.assistant.name);

  // Modify this part based on your settings structure
  var settingsHTML = `
  <div>

  <h2>${selectedAssistant.assistant.name}'s Settings</h2>
  <div>
            <label for="assistantID"><b>Assistant ID:</b></label>
            <strong><input type="text" id="assistantID" value="${uniqueID}"></strong>
        </div>
  <div>
  <label for="voiceIndex"><b>Voice Index:</b></label>
  <strong><input type="text" id="voiceIndex" value="${selectedAssistant.assistant.voiceIndex}"></strong>

  <button id="voiceSelect" class="load-voices" onclick="openVoiceWindow()">Load Voices</button>
  </div>
  <div>
      <label for="lightColor"><b>Light Color:</b></label>
      <input type="text" id="lightColor" value="${selectedAssistant.assistant.lightColor}">
  </div>
  <div>
      <label for="markerColor"><b>Marker Color:</b></label>
      <input type="color" id="markerColor" value="${selectedAssistant.assistant.markerColor}">
  </div>
  <div>
      <label for="serviceName"><b>Service Name:</b></label>
      <strong><input type="text" id="serviceName" value="${selectedAssistant.assistant.serviceName}"></strong>
  </div>
  <div>
      <label for="serviceAddress"><b>Service Address:</b></label>
      <strong><input type="text" id="serviceAddress" value="${selectedAssistant.assistant.serviceAddress}"></strong>
      </div>
  <div>
      <label for="authCode"><b>Auth Code:</b></label>
      <strong><input type="text" id="authCode" value="${selectedAssistant.assistant.authCode}"></strong>

      </div>
  <div>
      <label for="contentType"><b>Content Type:</b></label>
      <strong><input type="text" id="contentType" value="${selectedAssistant.assistant.contentType}"></strong>

      </div>
  <button id="updateSettingsButton" class="update-settings" onclick="updateAssistantSettings()"><b>Update Assistant Settings</b></button>
`;

  // Display settings and input fields in a single box
  document.getElementById('assistantSettings').innerHTML = settingsHTML;
}
var updateClicked = false;
// Function to update the assistant settings based on user input
function updateAssistantSettings() {
  updateClicked = true;

  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  var selectedAssistant = assistantTable[selectedAssistantIndex].assistant;

  selectedAssistant.assistantID = document.getElementById("assistantID").value;
  selectedAssistant.voiceIndex = document.getElementById("voiceIndex").value;
  selectedAssistant.lightColor = document.getElementById("lightColor").value;
  selectedAssistant.markerColor = document.getElementById("markerColor").value;
  selectedAssistant.serviceName = document.getElementById("serviceName").value;
  selectedAssistant.serviceAddress = document.getElementById("serviceAddress").value;
  selectedAssistant.authCode = document.getElementById("authCode").value;
  selectedAssistant.contentType = document.getElementById("contentType").value;
  localStorage.setItem("markerColor", selectedAssistant.markerColor);
  localStorage.setItem('assistantTable', JSON.stringify(assistantTable));
  localStorage.setItem('voiceIndex', selectedAssistant.voiceIndex);

  console.log("Update button clicked");
  displayAssistantSettings();
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

const assistantTable = [
    {
      assistant: {
        name: "human",
        voiceIndex: 666,
        lightColor: "#ff6666",
        markerColor: "#b30000",
        serviceName: "HumanUser",
        serviceAddress: "OriginationPoint",
        authCode: "hugi666ikjjerg"
      }
    },
    {
      assistant: {
      name: "assistantBrowser",
      voiceIndex: 999,
      lightColor: "#b3b3cc",
      markerColor: "#000000",
      serviceName: "AssistantCommunications",
      serviceAddress: "localhost:6002",
      authCode: "456398nns"
    }
  },
  {
    assistant: {
      name: "wizard",
      voiceIndex: 108,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "DaVinci_LLM",
      serviceAddress: "https://www.asteroute.com/ovontest",
      authCode: "69jjg45cf0",
      contentType: "none"
    }
  },
  {
    assistant: {
      name: "ovon_auto",
      voiceIndex: 114,
      lightColor: "#99e6e6",
      markerColor: "#29a3a3",
      serviceName: "Debbie_OVONAUTO",
      serviceAddress: "https://secondAssistant.pythonanywhere.com",
      authCode: "69jjg45cf0",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "cassandra",
      voiceIndex: 4255,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:15455/ejCassandra",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "Madison",
      voiceIndex: 4255,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:8887",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "Burokratt",
      voiceIndex: 120,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "Estonia",
      serviceAddress: "https://dev.buerokratt.ee/ovonr/conversation",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "ejtalk",
      voiceIndex: 4255,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://ejtalk.pythonanywhere.com",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "george",
      voiceIndex: 95,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http:localhost:7001",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "mary",
      voiceIndex: 116,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://codeMom.pythonanywhere.com",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "einstein",
      voiceIndex: 144,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://api.openai.com/v1/chat/completions",
      authCode: "AuZ9SYtXn",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "leah",
      voiceIndex: 80,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://lrb24.pythonanywhere.com",
      authCode: "AuZ9SYtXn",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "library",
      voiceIndex: 165,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://ovon.xcally.com/smartlibrary",
      authCode: "AuZ9SYtXn",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "peggy",
      voiceIndex: 115,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:6002",
      authCode: "AuZ9SYtXn",
      contentType: ""
    }
  },
  {
    assistant: {
      name: "sam",
      voiceIndex: 80,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "http://localhost:8242/",
      authCode: "AuZ9SYtXn",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "discovery",
      voiceIndex: 4255,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "internal:discovery",
      authCode: "zz8h00ji",
      contentType: "application/json"
    }
  }
]
//      serviceAddress: "http://localhost:15455/clientEvent",