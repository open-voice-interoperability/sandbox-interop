document.addEventListener('DOMContentLoaded', function () {
    displayLogs(logs);
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

function showFullDialog() {
    const fullDialog = logs.map(log => {
    try {
        const contentObject = JSON.parse(log.content);
        const sender = contentObject?.ovon?.sender?.from || 'Unknown';
        let token;

        if (log.direction && log.direction.toLowerCase() === 'sent') {
        // Check if it's an "invite" event type
            if (contentObject?.ovon?.events[0]?.eventType === 'invite') {
          
            const url = contentObject?.ovon?.events[0]?.parameters?.to?.url || 'URL not found';
            const whisperMessageEvent = contentObject?.ovon?.events.find(event => event.eventType === 'whisper');
            const whisperMessage = whisperMessageEvent?.parameters?.dialogEvent?.features?.text?.tokens[0]?.value || '';

            if (whisperMessage) {
                return `${sender} - Invite w/ whisper: ${whisperMessage}`;
            } else {
                return `${sender} - Bare Invite to: ${url}`;
            }
            } else {
            const tokens = contentObject?.ovon?.events.find(event => event.eventType === 'utterance')?.parameters?.dialogEvent?.features?.text?.tokens;
            token = tokens ? tokens[0]?.value : 'Token not found';
            return `${sender} - ${token}`;
            }
        } else if (log.direction && log.direction.toLowerCase() === 'received') {
            const tokens = contentObject?.ovon?.events.find(event => event.eventType === 'utterance')?.parameters?.dialogEvent?.features?.text?.tokens;
            token = tokens ? tokens[0]?.value : 'Token not found';
            return `${sender} - ${token}`;
        }else{
            return 'Invalid log direction';
        }
    } catch (error) {
      console.error('Error parsing log content:', error);
      return 'Error parsing log content';
    }
  });
    displayLogs(fullDialog); // Display full dialog
}
  
  
    // Function to display logs
function displayLogs(logsToDisplay) {
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = ''; // Clear previous logs

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