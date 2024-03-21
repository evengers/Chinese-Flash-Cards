document.addEventListener('DOMContentLoaded', () => {
    let wordsData = []; // Variable to store the words data

    // Fetch words data from server and store it in wordsData variable
    fetch('/words')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch words data');
            }
            return response.json();
        })
        .then(data => {
            wordsData = data;
            displayWord(); // Display the first word when data is loaded
        })
        .catch(error => console.error('Error fetching words:', error));

    // Function to display the current word on the page
    const displayWord = () => {
        const currentWord = wordsData[0]; // Get the first word from the data
        const wordsContainer = document.getElementById('words-container');
        wordsContainer.textContent = `${currentWord.Chinese} - ${currentWord.English}`;
    };

    // Function to update CSV file on the server
    const updateCSVFile = (action, wordId) => {
        fetch('/update-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, wordId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update CSV file');
            }
            console.log('CSV file updated successfully');
            return response.json(); // Parse JSON response
        })
        .then(data => {
            console.log('Server response:', data); // Log server response
        })
        .catch(error => console.error('Error updating CSV file:', error));
    };

    // Event listeners for control buttons
    const wrongButton = document.getElementById('wrong-button');
    const correctButton = document.getElementById('correct-button');

    wrongButton.addEventListener('click', () => {
        const currentWord = wordsData[0]; // Get the current word
        if (currentWord) {
            console.log('Incorrect:', currentWord);
            updateCSVFile('incorrect', currentWord.id); // Update CSV file (set status to 'incorrect')
            nextWord(); // Move to the next word
        }
    });

    correctButton.addEventListener('click', () => {
        const currentWord = wordsData[0]; // Get the current word
        if (currentWord) {
            console.log('Correct:', currentWord);
            updateCSVFile('correct', currentWord.id); // Update CSV file (set status to 'correct')
            nextWord(); // Move to the next word
        }
    });
});