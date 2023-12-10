document.addEventListener('DOMContentLoaded', function () {
    displayLogs(logs);
    document.getElementById('backgroundColorPicker').value ;
    document.getElementById('brightnessSlider').value = '65';
    // Trigger the changeBackgroundColor function with default values
    changeBackgroundColor();
});

const logs = JSON.parse(localStorage.getItem('conversationLog')) || [];
const logContainer = document.getElementById('logContainer');
    // Function to display logs based on the selected filter
function applyFilter(filter) {
    let filteredLogs = [];
    if (filter === 'sent') {
        filteredLogs = logs.filter(log => log.direction === 'sent');
    } else if (filter === 'received') {
        filteredLogs = logs.filter(log => log.direction === 'received');
    } else {
        filteredLogs = logs;
    }
    displayLogs(filteredLogs);
}

function showFullDialog(lightColor) {
    const dialogContainer = document.getElementById('logContainer');
    dialogContainer.innerHTML = ''; // Clear previous logs
    logs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = `log ${log.direction ? log.direction.toLowerCase() : ''}`;

        const contentObject = JSON.parse(log.content);

        const ovon = contentObject?.ovon || {};
        const user = ovon.sender?.from 
        const assistantName = localStorage.getItem('assistantName');
        const eventType = ovon.events[0]?.eventType || '';
        const parameters = ovon.events[0]?.parameters || {};
        if (log.direction === 'sent') {
            if (eventType === 'invite') {
                logElement.textContent = `${user} - Bare Invite to: ${localStorage.getItem("assistantName")} at ${parameters.to.url || 'unknown'}`;
            } else {
                logElement.textContent = `${user} - ${parameters.dialogEvent.features.text.tokens[0].value || 'unknown'}`;
            }
        } else if (log.direction === 'received') {
            logElement.textContent = `${assistantName} - ${parameters.dialogEvent.features.text.tokens[0].value || 'unknown'}`;
            logElement.style.backgroundColor = lightColor; 
        }else{
            return 'Invalid log direction';
        }
        dialogContainer.appendChild(logElement);
     }); // Display full dialog
}
  
  
    // Function to display logs
function displayLogs(logsToDisplay) {
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = ''; // Clear previous logs
    const lightColor = localStorage.getItem("lightColor");
    logsToDisplay.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = `log ${log.direction ? log.direction.toLowerCase() : ''}`;

        const logDirection = log.direction ? log.direction.toLowerCase() : '';

        if (logDirection === 'sent' || logDirection === 'received') {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = logDirection === 'sent' ? 'Sent Message' : 'Received Message';
            logElement.appendChild(labelDiv);

            const contentObject = JSON.parse(log.content);
            const ovon = contentObject?.ovon || {};

            if (logDirection === 'received') {
                // Set background color for received messages
                logElement.style.backgroundColor = lightColor;
                const conversationId = ovon.conversation?.id || 'Unknown Conversation ID';
                const convoDate = ovon.events[0].parameters.dialogEvent.span.startTime
                const datePart = convoDate.split(' ')[0];
                document.getElementById('displayedConversationId').textContent = conversationId;
                document.getElementById('displayedDate').textContent = datePart;
              }
            for (const [key, value] of Object.entries(ovon)) {
                if (key !== 'events') {
                const elementDiv = document.createElement('div');
                elementDiv.className = 'element';
                elementDiv.textContent = `${key}: ${JSON.stringify(value, null, 2)}`;
                logElement.appendChild(elementDiv);
                }
            }
            const events = ovon.events || [];
            events.forEach((event, index) => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.textContent = `Event ${index + 1}: ${JSON.stringify(event, null, 2)}`;
                logElement.appendChild(eventDiv);
            });
        } else {
            logElement.textContent = `${log}`;
        }

        logContainer.appendChild(logElement);
    });
}
  
    // Function to go back to sbConverse.html
function goBack() {
    window.location.href = 'sbConverse.html'; // Adjust the URL as needed
}

/*
// Leah: I tried to put this here but when I add the sbLogs.js to sbConverse.html is keeps trying
//      to fill in the log container which does not exist.
function saveTimeStampedLogFile(){
    var fileName = "OVON";
    fileName += cleanDateTimeString();
    fileName += ".log.txt";
    writeSBFile( fileName, JSON.stringify(conversationLOG, null, 2 ) );
}
*/


function changeBackgroundColor() {
    const colorPicker = document.getElementById("backgroundColorPicker");
    const brightnessSlider = document.getElementById("brightnessSlider");
    const brightnessPercentage = document.getElementById('brightnessPercentage');
    brightnessPercentage.textContent = `${brightnessSlider.value}%`;
    // Get the selected color and brightness
    const selectedColor = colorPicker.value;
    const brightness = brightnessSlider.value;
    // Adjust brightness using a helper function
    const adjustedColor = adjustBrightness(selectedColor, brightness);
    // Update the CSS for sent messages
    document.styleSheets[0].addRule('.log.sent', `background-color: ${adjustedColor} !important`);
    const lightColor = localStorage.getItem("lightColor");
    document.styleSheets[0].addRule('.log.received', `background-color: ${lightColor} !important`);
}
// Helper function to adjust brightness
function adjustBrightness(hex, percent) {
  // Convert hex to RGB
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Adjust brightness
  const adjustedR = Math.min(255, r + (percent * 2.55));
  const adjustedG = Math.min(255, g + (percent * 2.55));
  const adjustedB = Math.min(255, b + (percent * 2.55));
  // Convert back to hex
  const adjustedHex = `#${(1 << 24 | adjustedR << 16 | adjustedG << 8 | adjustedB).toString(16).slice(1)}`;
  return adjustedHex;
}