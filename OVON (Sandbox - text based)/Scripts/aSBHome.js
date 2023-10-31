document.addEventListener('DOMContentLoaded', function () {
    const startAssistantButton = document.getElementById('connectButton');
    const assistantSelector = document.getElementById('assistantSelector');
    const urlParams = new URLSearchParams(window.location.search);
    const selectedAssistantName = urlParams.get('assistantName'); // Declare the assistantName variable in the outer scope
    const responseDiv = document.getElementById('response');


    
    startAssistantButton.addEventListener('click', async function () {
        assistantName = assistantSelector.value; 

        
        // Connect to the selected assistant's server
        try {
            const response = await fetch(`http://127.0.0.1:${getAssistantPort(assistantName)}/connection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const { connected } = await response.json();
                if (connected) {
                    // Redirect to the "questions.html" page with the connected query parameter and assistantName
                    const url = "../Browsers/questions.html";
                    window.location.href = url;
                } else {
                    console.error('Connection to the assistant failed.');
                }
            } else {
                console.error('Error occurred while connecting to the assistant.');
            }
        } catch (error) {
            console.error('An error occurred while connecting to the assistant.', error);
        }
    });

    function getAssistantPort(assistantName) {
        // Define the port mapping for each assistant
        const portMap = {
            Eva: 8889,
            Jake: 8890,
        };
        return portMap[assistantName];
    }
});