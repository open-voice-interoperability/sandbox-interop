import { OVON_Response_Eva , OVON_Response_Jake, OVON_Bye, OVON_Engage_Eva, OVON_Engage_Jake } from "./assistantsData.js";

document.addEventListener('DOMContentLoaded', async () => {
    const responseDiv = document.getElementById('response');
    const connectionStatus = document.getElementById('connectionStatus');
    const questionInput = document.getElementById('questionInput');
    const askButton = document.getElementById('askButton');
    const clearChatButton = document.getElementById('clearChatButton');
    const urlParams = new URLSearchParams(window.location.search);
    const isConnected =urlParams.get('connected');
    const assistantName = urlParams.get('assistantName');
    let previousAssistant = null;
    let currentAssistant = assistantName;
    const goodbyeKeywords = ['goodbye', 'bye', 'farewell', 'see you', 'have a good day','have a good night']
    const weatherKeywords = ['weather', 'temperature', 'forecast']

    console.log('isConnected:', isConnected);
    console.log('Assistant:', assistantName);


    // Function to get the port of the selected assistant
    function getAssistantPort(assistantName) {
        if (assistantName === 'Eva') {
            return 8889; // Eva's port
        } else if (assistantName === 'Jake') {
            return 8890; //Jake's port
        }
    };
    try {
            // Make a request to check the connection status
            const connectionResponse = await fetch(`http://127.0.0.1:${getAssistantPort(assistantName)}/connection`, {
                method: 'GET',
            });
            if (connectionResponse.status === 200) {
                const { connected } = await connectionResponse.json();
                if (connected) {
                    connectionStatus.innerText = `Successfully connected to ${assistantName}'s server...`;
                } else {
                    connectionStatus.innerText = `Failed to connect to ${assistantName} server.`;
                }
            } else {
                connectionStatus.innerText = 'Connection status not available.';
            }
        } catch (error) {
            console.error('An error occurred while checking the connection status.', error);
            connectionStatus.innerText = 'Connection status not available.';
        }

    const displayMessage = (text, className) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.textContent = text;
        responseDiv.appendChild(messageDiv);
    };
    /////// DISPLAYING ASSISTANT MESSAGE//////

    let messageClass;
    function getResponseObject(assistantName) {
        if (assistantName === 'Eva') {
            messageClass='eva-message'
            console.log('OVON_Response_Eva:',OVON_Response_Eva);
            return OVON_Response_Eva;
        } else if (assistantName === 'Jake') {
            messageClass = 'jake-message'
            console.log('OVON_Response_Jake:',OVON_Response_Jake);
            return OVON_Response_Jake;
        }
        // You can add more conditions for other assistants if needed
    }
    const responseObj = getResponseObject(assistantName);

    // Access specific properties within OVON_Response_Eva
    const token = responseObj.ovon.events[1].parameters['dialog-event'].features.text.tokens[0].value;

    displayMessage(`Assistant: ${token}`, messageClass);
    
    ///////////////////////////////////////////////

    const clearChat = () => {
        responseDiv.innerHTML = '';
    };

    const displayUserQuestion = (question) => {
        displayMessage(`You: ${question}`, 'user-question');
    };

    const displayAssistantResponse = (assistantName, responseText) => {
        let className;
        if (assistantName === 'Eva') {
            className = 'eva-message';
        } else if (assistantName === 'Jake') {
            className = 'jake-message';
        }
        displayMessage(`${assistantName}: ${responseText}`, className);
    };


// Add a function to switch back to Eva's server.
    const switchToEva = () => {
        if (currentAssistant === 'Jake') {
            currentAssistant = 'Eva'; // Switch back to Eva
            // Display a message indicating the switch back to Eva.
            const switchMessage = OVON_Response_Eva.ovon.events[1].parameters['dialog-event'].features.text.tokens[1].value;;
            displayAssistantResponse(currentAssistant, switchMessage);
            // Optionally, you can also update the connection status here.
            connectionStatus.innerText = `Connected to ${currentAssistant}'s server...`;
            console.log('OVON_Response_Eva:', OVON_Response_Eva);
        }
        else if (currentAssistant === 'Eva'){
            setTimeout(() => {
                if(currentAssistant === 'Eva'){
                    window.location.href = 'homePage.html';
                }
            }, 800);
        }
    };

    const delegateToJake = async (question) => {
        try {
            
            // Determine the appropriate URL for Jake
            const assistantURL = 'http://127.0.0.1:8890/ask'; // Jake's URL
            const response = await fetch(assistantURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
            connectionStatus.innerText = `Connected to ${currentAssistant}'s server...`;
            console.log("OVON_Response_Jake:",OVON_Response_Jake);
            if (response.status === 200) {
                const { answer } = await response.json();
                const delegate = OVON_Engage_Jake.ovon.events[1].parameters.dialog_event.features.text.tokens[0].value;
                setTimeout(() => {
                    displayAssistantResponse(currentAssistant, delegate);
                    setTimeout(()=>{
                        displayAssistantResponse(currentAssistant, answer);
                    }, 200);
                }, 800);
                
            } else {
                displayAssistantResponse('Error occurred while processing your question.');
            }
        } catch (error) {
            displayAssistantResponse('An error occurred while sending your question to Jake.');
        }
    };
    
    const submitQuestion = async () => {
        const question = questionInput.value.trim();
        if (!question) {
            return;
        }
        const isGoodbye = goodbyeKeywords.some(keyword => question.toLowerCase().includes(keyword));
        const isWeather = weatherKeywords.some(keyword => question.toLowerCase().includes(keyword));
        if (currentAssistant === 'Jake' && isGoodbye) {
            // Remember the current assistant as the previous assistant.
            previousAssistant = currentAssistant;
        // Display the goodbye message from OVON_Bye.
            displayUserQuestion(question);
            const goodbyeToken = OVON_Bye.ovon.events[0].parameters.dialog_event.features.text.tokens[0].value;
            displayAssistantResponse(currentAssistant, goodbyeToken);
            console.log('OVON_Bye:', OVON_Bye);
        // Set a 4-second delay to switch back to Eva.
            setTimeout(switchToEva, 800);
        } else if (currentAssistant === 'Eva' && isGoodbye) {
            displayUserQuestion(question);
            const goodbyeToken = OVON_Bye.ovon.events[0].parameters.dialog_event.features.text.tokens[1].value;
            displayAssistantResponse(currentAssistant, goodbyeToken);
            setTimeout(switchToEva, 500);
        } else if (currentAssistant === 'Eva' && isWeather){
            displayUserQuestion(question);
            const delegateToken = OVON_Engage_Eva.ovon.events[1].parameters.dialog_event.features.text.tokens[0].value;
            displayAssistantResponse(currentAssistant, delegateToken);
            currentAssistant = 'Jake';
            setTimeout(() => {delegateToJake(question);},300);
        }
        else {
            displayUserQuestion(question);
        try {
            // Determine the appropriate URL based on the selected assistant
            let assistantURL;
            if (currentAssistant === 'Eva') {
                assistantURL = 'http://127.0.0.1:8889/ask'; // Eva's URL
            } else if (currentAssistant === 'Jake') {
                assistantURL = 'http://127.0.0.1:8890/ask'; // Jake's URL
            } else {
                // Handle the case where the assistantName is not recognized
                displayAssistantResponse('Unknown assistantName.');
                return;
            }
            const response = await fetch(assistantURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
    
            if (response.status === 200) {
                const { answer } = await response.json();
                displayAssistantResponse(currentAssistant, answer);
            } else {
                displayAssistantResponse('Error occurred while processing your question.');
            }
        } catch (error) {
            displayAssistantResponse('An error occurred while sending your question.');
        }
    }
    
        questionInput.value = '';
    };

    
    
    askButton.addEventListener('click', submitQuestion);
    questionInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
        submitQuestion();
        }
    });
    clearChatButton.addEventListener('click', clearChat);

});