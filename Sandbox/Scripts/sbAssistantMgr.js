var selectedAssistantIndex = 0;

function sbGetAgentParams( someAgentName ){ //return object for this agent
  for (let i = 0; i < assistantTable.length; i++) {
    if( assistantTable[i].assistant && assistantTable[i].assistant.name === someAgentName ){
      return assistantTable[i];
    }
  }
}
async function fetchAssistantData() {
  try {
    const response = await fetch('../Support/ActiveAssistantList.json');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function initializeAssistantData(callback) {
  try {
    const data = await fetchAssistantData();
    assistantTable = data;
    selectedAssistantIndex = localStorage.getItem("currentAssistantIndex");
    assistantObject = assistantTable[selectedAssistantIndex];
    loadAssistantSelect();

    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error('Error fetching assistant data:', error);
  }
}

// Call the initialization function
initializeAssistantData();
//build the Assistant <select> html innerHTML string
function loadAssistantSelect() {
  var assistantSelect = document.getElementById('assistantSelect');

  if (assistantSelect) {
    var selCntl = '<label style="font-size: 18px;" for="AssistantList">Choose an Assistant:</label>';
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

    assistantSelect.innerHTML = selCntl;
  } else {
      return;
      }
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
    localStorage.setItem('lightColor', selectedAssistant.lightColor);
    localStorage.setItem('serviceAddress', selectedAssistant.serviceAddress);

    // assistantObject = sbGetAgentParams(selectedAssistant.name);
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
            <label for="assistantName"><b>Assistant Name:</b></label>
            <strong><input type="text" id="assistantName" value="${selectedAssistant.assistant.name}"></strong>
  </div>
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
      <input type="color" id="lightColor" value="${selectedAssistant.assistant.lightColor}">
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
  </div>
  <div id="updateMessage" class="update-message"></div>
  `;

  // Display settings and input fields in a single box
  document.getElementById('assistantSettings').innerHTML = settingsHTML;
}
var updateClicked = false;
// Function to update the assistant settings based on user input
function updateAssistantSettings() {
  updateClicked = true;
  var selectedAssistantIndex = document.getElementById("sbAssist").value;
  var selectedAssistant = JSON.parse(JSON.stringify(assistantTable[selectedAssistantIndex].assistant));

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
  localStorage.setItem('lightColor', selectedAssistant.lightColor);
  localStorage.setItem('serviceAddress', selectedAssistant.serviceAddress);

  assistantTable[selectedAssistantIndex].assistant = selectedAssistant;
  // Save the updated assistantTable to localStorage
  localStorage.setItem('assistantTable', JSON.stringify(assistantTable));
  // Send a PUT request to update the server-side JSON file
  fetch('../Support/ActiveAssistantList.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assistantTable, null, 2), // Send the updated assistant data
  })
  .then(response => response.json())
  
  .catch(error => {
    console.error('Error updating assistant on the server:', error);
  });
  // Update the local storage with other settings (if needed)
  localStorage.setItem("markerColor", selectedAssistant.markerColor);
  localStorage.setItem('voiceIndex', selectedAssistant.voiceIndex);
  localStorage.setItem('lightColor', selectedAssistant.lightColor);
  localStorage.setItem('serviceAddress', selectedAssistant.serviceAddress);
  displayAssistantSettings();
  var updateMessage = document.getElementById("updateMessage");
  updateMessage.textContent = "Settings updated successfully!";
  updateMessage.style.display = "block";
  // Hide the message after a certain duration (e.g., 3 seconds)
  setTimeout(function () {
    updateMessage.style.display = "none";
  }, 1200);
}

function createAssistant() {
  // Get form values
  var assistantName = document.getElementById("assistantName").value;
  var assistantID = document.getElementById("assistantID").value;
  var voiceIndex = document.getElementById("voiceIndex").value;
  var lightColor = document.getElementById("lightColor").value;
  var markerColor = document.getElementById("markerColor").value;
  var serviceName = document.getElementById("serviceName").value;
  var serviceAddress = document.getElementById("serviceAddress").value;
  var authCode = document.getElementById("authCode").value;
  var contentType = document.getElementById("contentType").value;

  // Create assistant object
  var newAssistant = {
      "name": assistantName,
      "id": assistantID,
      "voiceIndex": voiceIndex,
      "lightColor": lightColor,
      "markerColor": markerColor,
      "serviceName": serviceName,
      "serviceAddress": serviceAddress,
      "authCode": authCode,
      "contentType": contentType
  };
  createAssistantDirectory(assistantName);
  fetch('../Support/ActiveAssistantList.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAssistant),
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
  })
  .catch(error => {
    console.error('Error creating assistant:', error);
    alert('Failed to create assistant. Please try again.');
  });
}

// Use this to get colors, urls, (eventually TTS voice index, etc)
// Get Assistant Info in your Browser JS like this:
/*
	thisAgent = sbGetAgentParams( voiceName );
        if( thisAgent ){
          vIndex = thisAgent.assistant.voiceIndex;
          aColor = thisAgent.assistant.lightColor;
        }

*/