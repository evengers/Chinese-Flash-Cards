const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Add this line to parse JSON bodies

// Read words data from CSV file
let wordsData = [];
fs.createReadStream('data/words_to_learn.csv')
   .pipe(csv())
   .on('data', (row) => {
       wordsData.push(row);
   })
   .on('end', () => {
      console.log('Words loaded');
      // Sort wordsData by the "Status" column after reading the CSV file
      wordsData.sort((a, b) => parseInt(a.Status) - parseInt(b.Status));
   });

// Serve index.html for the root URL
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve words data as JSON
app.get('/words', (req, res) => {
   res.json(wordsData);
});

// Update CSV file endpoint
app.post('/update-csv', (req, res) => {
    // Check if req.body exists
    if (req.body) {
        const { action, wordId } = req.body;
        switch (action) {
            case 'correct':
                handleAction(wordId, -1); // decrement value so moves to top of file
                break;
            case 'incorrect':
                handleAction(wordId, 1); // incrementvalue
                break;
            case 'ignore':
                handleAction(wordId, 99); //so moves to end of file
               break;
            // Add cases for future actions here
            default:
                res.status(400).json({ error: 'Invalid action' });
                break;
        }
    } else {
        res.status(400).json({ error: 'req.body is undefined' });
    }

    // Function to handle 'correct' or 'incorrect' action
    function handleAction(wordId, incrementValue) {
        if (wordId) {
            const updatedData = wordsData.map(word => {
                if (word.id === wordId) {
                    word.Status = parseInt(word.Status) + incrementValue; // Add or subtract incrementValue
                }
                return word;
            });
            updateCSVFile(updatedData);
            wordsData = updatedData;
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid request' });
        }
    }
});

// Function to update the CSV file with new data
const updateCSVFile = (data) => {
    const header = Object.keys(data[0]).join(','); // Get CSV header
    const newDataRows = data.map(word => {
        return Object.values(word).map(value => `"${value}"`).join(',');
    }).join('\n');
    const updatedCSV = `${header}\n${newDataRows}`;

    // Write the updated CSV data back to the file
    fs.writeFileSync('data/words_to_learn.csv', updatedCSV);
};

app.listen(port, () => {
   console.log(`Flashy app listening at http://localhost:${port}`);
});
