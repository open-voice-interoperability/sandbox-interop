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
  selectedAssistantIndex += 2;
  localStorage.setItem( "currentAssistantIndex", selectedAssistantIndex );
 }
    // Function to handle assistant selection change
function handleAssistantSelectionChange() {
  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  if (selectedAssistantIndex !== "") {
    // Assistant is selected, show the settings
    document.getElementById('assistantSettings').style.display = 'block';
    displayAssistantSettings();
  } else {
    // No assistant selected, hide the settings
    document.getElementById('assistantSettings').style.display = 'none';
  }
}

// Function to get all assistant options
function getAllAssistantOptions() {
  return assistantTable;
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
  <h2>${selectedAssistant.assistant.name}'s Settings</h2>
  <div>
            <label for="assistantID"><b>Assistant ID:</b></label>
            <span id="assistantID">${uniqueID}</span>
        </div>
  <div>
      <label for="voiceIndex"><b>Voice Index:</b></label>
      <input type="text" id="voiceIndex" value="${selectedAssistant.assistant.voiceIndex}">
  </div>
  <div>
      <label for="lightColor"><b>Light Color:</b></label>
      <input type="text" id="lightColor" value="${selectedAssistant.assistant.lightColor}">
  </div>
  <div>
      <label for="markerColor"><b>Marker Color:</b></label>
      <input type="text" id="markerColor" value="${selectedAssistant.assistant.markerColor}">
  </div>
  <div>
      <label for="serviceName"><b>Service Name:</b></label>
      <input type="text" id="serviceName" value="${selectedAssistant.assistant.serviceName}">
  </div>
  <div>
      <label for="serviceAddress"><b>Service Address:</b> ${selectedAssistant.assistant.serviceAddress}</label>
  </div>
  <div>
      <label for="authCode"><b>Auth Code:</b> ${selectedAssistant.assistant.authCode}</label>
  </div>
  <div>
      <label for="contentType"><b>Content Type:</b> ${selectedAssistant.assistant.contentType}</label>
  </div>
  <button onclick="updateAssistantSettings()">Update Assistant Settings</button>
`;

  // Display settings and input fields in a single box
  document.getElementById('assistantSettings').innerHTML = settingsHTML;
}

// Function to update the assistant settings based on user input
function updateAssistantSettings() {
  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  var selectedAssistant = assistantTable[selectedAssistantIndex].assistant;

  selectedAssistant.voiceIndex = document.getElementById("voiceIndex").value;
  selectedAssistant.lightColor = document.getElementById("lightColor").value;
  selectedAssistant.markerColor = document.getElementById("markerColor").value;
  selectedAssistant.serviceName = document.getElementById("serviceName").value;

  displayAssistantSettings(); // Update the displayed settings
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
      serviceAddress: "localhost:15445",
      authCode: "456398nns"
    }
  },
  {
    assistant: {
      name: "Eva",
      voiceIndex: 142,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "localhost:8889",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "Jake",
      voiceIndex: 141,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "WeatherAssistant",
      serviceAddress: "localhost:8890",
      authCode: "lekg99k9e",
      contentType: "application/json"
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
      contentType: "application/json"
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
      contentType: "application/json"
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
      contentType: "application/x-www-form-urlencoded"
    }
  },
  {
    assistant: {
      name: "Madison",
      voiceIndex: 115,
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
      voiceIndex: 142,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "Estonia",
      serviceAddress: "https://dev.buerokratt.ee/ovon",
      authCode: "h229k00m8bv",
      contentType: "application/json"
    }
  },
  {
    assistant: {
      name: "ejtalk",
      voiceIndex: 115,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://ejtalk.pythonanywhere.com",
      authCode: "h229k00m8bv",
      contentType: "application/x-www-form-urlencoded"
    }
  },
  {
    assistant: {
      name: "george",
      voiceIndex: 115,
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
      voiceIndex: 115,
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
      voiceIndex: 115,
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
      voiceIndex: 115,
      lightColor: "#ffb3d9",
      markerColor: "#cc0088",
      serviceName: "PrimaryAssistant",
      serviceAddress: "https://lrb24.pythonanywhere.com",
      authCode: "AuZ9SYtXn",
      contentType: "application/json"
    }
  }
]
//      serviceAddress: "http://localhost:15455/clientEvent",
