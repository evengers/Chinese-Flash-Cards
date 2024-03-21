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

   // Function to remove the current word from the data and display the next word
   const nextWord = () => {
       wordsData.shift(); // Remove the first word from the data
       displayWord(); // Display the next word after removing
   };

   // Event listeners for control buttons
   const wrongButton = document.getElementById('wrong-button');
   const correctButton = document.getElementById('correct-button');
   const showPinyinButton = document.getElementById('show-pinyin-button');
   const narratorButton = document.getElementById('narrator-button');

   wrongButton.addEventListener('click', () => {
       const currentWord = wordsData[0]; // Get the current word
       if (currentWord) {
           console.log('Incorrect:', currentWord);
           updateCSVFile('remove', currentWord.id); // Update CSV file (remove word)
           nextWord(); // Move to the next word
       }
   });

   correctButton.addEventListener('click', () => {
       const currentWord = wordsData[0]; // Get the current word
       if (currentWord) {
           console.log('Correct:', currentWord);
           updateCSVFile('correct', currentWord.id); // Update CSV file (remove word)
           nextWord(); // Move to the next word
       }
   });

   showPinyinButton.addEventListener('click', () => {
       const currentWord = wordsData[0]; // Get the current word
       if (currentWord) {
           console.log('Show Pinyin:', currentWord.Pinyin);
           // Add logic to show pinyin (if applicable)
       }
   });

   narratorButton.addEventListener('click', () => {
       const currentWord = wordsData[0]; // Get the current word
       if (currentWord) {
           console.log('Narrate:', currentWord.Chinese);
           // Add logic to narrate the word (if applicable)
       }
   });

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
           })
           .catch(error => console.error('Error updating CSV file:', error));
   };
});