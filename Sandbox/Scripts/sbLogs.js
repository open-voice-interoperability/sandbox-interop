document.addEventListener('DOMContentLoaded', function () {
    let logs = JSON.parse(localStorage.getItem('conversationLog')) || [];
    displayLogs(logs);
    changeBackgroundColor();
    fetchLogsAndPopulateDropdown();
    const logDropdown = document.getElementById('logFileDropdown');
    const showAllButton = document.getElementById('showAllButton');
    logDropdown.addEventListener('change', function () {
        const selectedFileName = logDropdown.value;
        if (selectedFileName && selectedFileName.endsWith('.txt')) {
            fetchLogFileContent(selectedFileName);
        }
    });
    showAllButton.addEventListener('click', function () {
        const selectedFileName = logDropdown.value;
        if (selectedFileName && selectedFileName.endsWith('.txt')) {
            fetchLogFileContent(selectedFileName);
        }
    });
    ovonSentButton.addEventListener('click', function () {
        const selectedFileName = logDropdown.value;
        if (selectedFileName && selectedFileName.endsWith('.txt')) {
            // Fetch and display sent messages
            fetchOvonLogs(selectedFileName, 'sent');
        }
    });
    ovonReceivedButton.addEventListener('click', function () {
        const selectedFileName = logDropdown.value;
        if (selectedFileName && selectedFileName.endsWith('.txt')) {
            // Fetch and display received messages
            fetchOvonLogs(selectedFileName, 'received');
        }
    });
    ovonFullDialogButton.addEventListener('click', function () {
        const selectedFileName = logDropdown.value;
        if (selectedFileName && selectedFileName.endsWith('.txt')) {
            // Fetch and display the full dialog for the selected log file
            fetchLogFileContent(selectedFileName);
        }
    });
});

let logs = JSON.parse(localStorage.getItem('conversationLog')) || [];
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

        if (!log.content) {
            // Handle the case where log.content is undefined or null
            logElement.textContent = 'Invalid log content';
            dialogContainer.appendChild(logElement);
            return;
        }

        let contentObject;
        try {
            contentObject = JSON.parse(log.content);
        } catch (error) {
            // If parsing as JSON fails, treat the content as plain text
            contentObject = { textContent: log.content };
        }

        
        const ovon = contentObject?.ovon || {};
        const user = ovon.sender?.from;
        const assistantName = localStorage.getItem('assistantName');
        const events = ovon.events || [];
        
        // Check if there's an "invite" event
        const inviteEvent = events.find(event => event.eventType === 'invite');

        if (log.direction === 'sent') {
            if (inviteEvent) {
                // Check if there's also a "whisper" event
                const whisperEvent = events.find(event => event.eventType === 'whisper');
                if (whisperEvent) {
                    logElement.textContent = `${user} - Invite w/ Whisper: ${whisperEvent.parameters.dialogEvent.features.text.tokens[0].value || 'unknown'}`;
                } else {
                    logElement.textContent = `${user} - Bare Invite to: ${localStorage.getItem("assistantName")} at ${inviteEvent.parameters.to.url || 'unknown'}`;
                }
            }else {
                logElement.textContent = `${user} - ${events[0]?.parameters.dialogEvent.features.text.tokens[0].value || 'unknown'}`;                        }
        } else if (log.direction === 'received') {
            logElement.textContent = `${assistantName} - ${events[0]?.parameters.dialogEvent.features.text.tokens[0].value || 'unknown'}`;
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

function changeBackgroundColor() {
    const adjustedColor = 'lightcoral';
    document.documentElement.style.setProperty('--received-color', localStorage.getItem("lightColor"));
}

function saveFullDialogToFile() {
    const dateStr = cleanDateTimeString();    
    const assistantName = localStorage.getItem('assistantName');
    const fileName = `OVON_${assistantName}_${dateStr}.log.txt`;
    const logContent = generateFullDialogContent(logs, assistantName);
    writeSBFile(fileName, logContent, function () {
        console.log('File written successfully');
        readLogFile(fileName);
    });
}

function generateFullDialogContent(logsToDisplay, assistantName) {
    let content = '';
    logsToDisplay.forEach(log => {
        const timestamp = new Date(log.timestamp).toLocaleString(); // Convert timestamp to a human-readable format
        const logDirection = log.direction ? log.direction.toLowerCase() : '';
        if (logDirection === 'sent' || logDirection === 'received') {
            content += `${timestamp} - ${logDirection === 'sent' ? 'Sent' : 'Received'} Message\n`;
            // Extract relevant information and format it
            const contentObject = JSON.parse(log.content);
            const ovon = contentObject?.ovon || {};
            if (logDirection === 'received') {
                content += `Assistant Name: ${assistantName}\n`;
            } else if (logDirection === 'sent') {
                const humanName = localStorage.getItem('humanFirstName') || 'Human';
                content += `Human Name: ${humanName}\n`;
            }
            content += `Conversation ID: ${ovon.conversation?.id || 'Unknown Conversation ID'}\n`;
            const events = ovon.events || [];
            events.forEach((event, index) => {
                content += `Event ${index + 1}: ${event.eventType}\n`;
                // Display tokens/values for 'utterance' events
                if (event.eventType === 'utterance') {
                    const tokens = event.parameters.dialogEvent.features.text.tokens || [];
                    tokens.forEach((token, tokenIndex) => {
                        content += `Token ${tokenIndex + 1}: ${token.value}\n`;
                    });
                } else if (event.eventType === 'whisper') {
                    // Include the token value for "whisper" events
                    const whisperToken = event.parameters.dialogEvent.features.text.tokens[0].value;
                    content += `Whisper Token: ${whisperToken}\n`;
                }
            });
        } else {
            // If log direction is neither 'sent' nor 'received', just append the log content
            content += `${timestamp} - ${log.content}\n`;
        }
        content += '\n'; // Add a newline to separate log entries
    });
    return content;
}

function fetchLogsAndPopulateDropdown() {
    const logDropdown = document.getElementById('logFileDropdown');
    const logFileNameRegex = /^OVON_\w+_\d{4}_\d{2}_\d{2}_\d{2}_\d{2}_\d{2}\.log\.txt$/;
    // Add a default option at index 1
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select';
    logDropdown.add(defaultOption);
    fetch('/Report/Logs/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch log files`);
            }
            return response.text(); // Parse the response as JSON here
        })
        .then(data => {
            const lines = data.trim().split('\n');
            // Iterate over each line to find valid log file names
            lines.forEach(logFileName => {
                logFileName = logFileName.trim();
                if (logFileNameRegex.test(logFileName)) {
                    const option = document.createElement('option');
                    option.value = logFileName;
                    option.text = logFileName;
                    logDropdown.add(option);
                }
            });
            // Debugging: Log the number of options in the dropdown
            console.log('Number of options:', logDropdown.length);
        })
        .catch(error => {
            console.error('Error fetching log files:', error);
        });
}

function fetchLogFileContent(fileName) {
    fetch(`/Report/Logs/${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch log file content for ${fileName}. HTTP status ${response.status}`);
            }
            // Read the response as text
            return response.text();
        })
        .then(content => {
            // Split the content into lines
            const lines = content.split('\n');
            
            // Filter out empty lines
            const nonEmptyLines = lines.filter(line => line.trim() !== '');
            // Find the index where the log content begins
            const startIndex = nonEmptyLines.findIndex(line => line.includes('12/'));
            // Use the content from the identified index onwards
            const logsContent = nonEmptyLines.slice(startIndex).join('\n');
            // Split the log content into lines
            logs = logsContent.split('\n');
            // Display the updated logs
            console.log('Updated logs:', logs);
            displayLogFileContent(logs, 'all');
        })
        .catch(error => {
            console.error(`Error fetching content for file ${fileName}:`, error);
        });
}

function displayLogFileContent(content, filter) {
    // Clear previous logs in the container
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = ''; // Clear previous logs
    // Get the light color from local storage
    const lightColor = localStorage.getItem("lightColor");
    let currentLogElement = null; // Track the current log element
    content.forEach(logLine => {
        if (logLine.trim() === '') {
            return;
        }
        // Check if the log line indicates a new message
        if (logLine.includes('Sent Message')) {
            // If there's an existing log element, append it to the log container
            if (currentLogElement) {
                logContainer.appendChild(currentLogElement);
            }
            // Create a new log element for the sent message
            currentLogElement = document.createElement('div');
            currentLogElement.className = 'log sent';
        } else if (logLine.includes('Received Message')) {
            // If there's an existing log element, append it to the log container
            if (currentLogElement) {
                logContainer.appendChild(currentLogElement);
            }
            // Create a new log element for the received message
            currentLogElement = document.createElement('div');
            currentLogElement.className = 'log received';
            currentLogElement.style.backgroundColor = lightColor; // Set the background color for received messages
        }
        // Concatenate the log line to the current log element's content
        if (currentLogElement) {
            // Add a newline character between lines of the same message
            if (currentLogElement.innerHTML !== '') {
                currentLogElement.innerHTML += '<br>';
            }
            currentLogElement.innerHTML += logLine;
        }
    });
    // If there's an existing log element at the end, append it to the log container
    if (currentLogElement) {
        logContainer.appendChild(currentLogElement);
    }
}

function fetchOvonLogs(fileName, direction) {
    fetch(`/Report/Logs/${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch log file content for ${fileName}. HTTP status ${response.status}`);
            }
            // Read the response as text
            return response.text();
        })
        .then(content => {
            // Split the content into lines
            const lines = content.split('\n');
            // Filter out empty lines
            const nonEmptyLines = lines.filter(line => line.trim() !== '');
            // Find the index where the log content begins
            const startIndex = nonEmptyLines.findIndex(line => line.includes('12/'));
            // Use the content from the identified index onwards
            const logsContent = nonEmptyLines.slice(startIndex).join('\n');
            // Split the log content into lines
            logs = logsContent.split('\n');
            // Extract the content of sent or received messages based on the specified direction
            const messageContent = [];
            let isMessage = false;

            logs.forEach(logLine => {
                if ((direction === 'sent' && logLine.includes('Sent Message')) ||
                    (direction === 'received' && logLine.includes('Received Message'))) {
                    // Start capturing content when a sent or received message is encountered
                    isMessage = true;
                    messageContent.push(logLine);
                } else if (logLine.includes('Sent Message') || logLine.includes('Received Message')) {
                    // Stop capturing content when the next message (sent or received) is encountered
                    isMessage = false;
                } else if (isMessage) {
                    // Capture content of the sent or received message
                    messageContent.push(logLine);
                }
            });
            // Display the filtered logs
            displayLogFileContent(messageContent, direction);
        })
        .catch(error => {
            console.error(`Error fetching content for file ${fileName}:`, error);
        });
}