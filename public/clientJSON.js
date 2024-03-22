document.addEventListener('DOMContentLoaded', () => {
    let wordsData = []; // Variable to store the words data
    let currentIndex = 0; // Variable to track the current index in wordsData

    // Fetch words data from server and store it in wordsData variable
    const fetchWordsData = () => {
        fetch('/crud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'read', payload: 'all' })
        })
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
    };

    // Function to display the current word on the page
    const displayWord = () => {
        const currentWord = wordsData[currentIndex]; // Get the current word from the data
        const wordsContainer = document.getElementById('words-container');
        wordsContainer.textContent = `${currentWord.Chinese} - ${currentWord.English}`;
    };

    // Function to update data on the server and display the next word
    const updateData = (action, wordId, statusChange) => {
        fetch('/crud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'update',
                payload: {
                    id: wordId,
                    statusChange // 'correct' or 'incorrect'
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update data');
            }
            console.log('Data updated successfully');
            removeUpdatedWord(); // Remove the updated word from the list
        })
        .catch(error => console.error('Error updating data:', error));
    };

    // Function to remove the updated word from the list and display the next word
    const removeUpdatedWord = () => {
        wordsData.splice(currentIndex, 1); // Remove the updated word
        if (currentIndex >= wordsData.length) {
            currentIndex = 0; // Reset index if at the end of the list
        }
        displayWord(); // Display the next word
    };

    // Event listeners for control buttons
    const wrongButton = document.getElementById('wrong-button');
    const correctButton = document.getElementById('correct-button');
    const ignoreButton = document.getElementById('ignore-button');

    wrongButton.addEventListener('click', () => {
        const currentWord = wordsData[currentIndex]; // Get the current word
        if (currentWord) {
            console.log('Incorrect:', currentWord);
            updateData('update', currentWord.id, 'incorrect'); // Update data (set status to 'incorrect')
        }
    });

    correctButton.addEventListener('click', () => {
        const currentWord = wordsData[currentIndex]; // Get the current word
        if (currentWord) {
            console.log('Correct:', currentWord);
            updateData('update', currentWord.id, 'correct'); // Update data (set status to 'correct')
        }
    });

    ignoreButton.addEventListener('click', () => {
        const currentWord = wordsData[currentIndex]; // Get the current word
        if (currentWord) {
            console.log('Ignore:', currentWord);
            removeUpdatedWord(); // Remove the current word from the list and display the next word
        }
    });

    // Fetch words data from server and display the first word
    fetchWordsData();
});