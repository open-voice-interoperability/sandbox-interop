document.querySelector('#questionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const question = document.querySelector('input[name="question"]').value;
    // Print the question to the console
    console.log(question);

    if (question.toLowerCase().includes("weather")) {
        // Send a request to Jake's server
        fetch('/ask', {  // Use the correct endpoint for Jake's server
            method: 'POST',
            body: new URLSearchParams({ 'question': question }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(data => {
            // Append Jake's response to the #answers element
            appendResponse(data);
        });
    } else {
        // For non-weather questions, send the question to Cassandra's server
        fetch('/ask', {
            method: 'POST',
            body: new URLSearchParams({ 'question': question }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.text())
        .then(data => {
            // Append Cassandra's response to the #answers element
            appendResponse(data);
        });
    }
});
document.querySelector('#clear-button').addEventListener('click', function () {
    // Clear the text in the input field
    document.querySelector('#questionInput').value = '';
    // Clear the #answers section
    clearAnswers();
    document.querySelector('#weather-info').textContent = '';
});

// function getUserLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             const { latitude, longitude } = position.coords;
            
//             // Send the latitude and longitude to Flask
//             fetch('/get_weather', {
//                 method: 'POST',
//                 body: new URLSearchParams({ 'latitude': latitude, 'longitude': longitude }),
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             })
//             .then(response => response.text())
//             .then(data => {
//                 // Append the weather response to the #answers element
//                 appendResponse(data);
//             });
//         });
//     } else {
//         document.querySelector('#weather-info').textContent = 'Geolocation is not supported by your browser.';
//     }
// }


function appendResponse(responseText) {
    const answersElement = document.querySelector('#answers');
    const responseElement = document.createElement('div');
    // Check if the response starts with "Cassandra:" or "Jake:" and display accordingly
    if (responseText.startsWith("Cassandra: ")) {
        responseElement.textContent = responseText;
        responseElement.classList.add("cassandra-response");
    } else if (responseText.startsWith("Jake: ")) {
        responseElement.textContent = responseText;
        responseElement.classList.add("jake-response");
    } else {
        // If the response doesn't have a specific prefix, display it as is
        responseElement.textContent = responseText;
    }

    answersElement.appendChild(responseElement);
}

function clearAnswers() {
    document.querySelector('#answers').textContent = '';
    
}
