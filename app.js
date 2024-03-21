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
        if (action === 'remove' && wordId) {
            const updatedData = wordsData.map(word => {
                if (word.id === wordId) {
                    // Add a new property "Status" to the word object
                    return { ...word, Status: action === 'correct' ? 'Correct' : 'Wrong' };
                }
                return word;
            });
            updateCSVFile(updatedData);
            wordsData = updatedData;
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid request' });
        }
    } else {
        res.status(400).json({ error: 'req.body is undefined' });
    }
});

// Function to update the CSV file with new data
const updateCSVFile = (data) => {
    const csvData = fs.readFileSync('data/words_to_learn.csv', 'utf8').trim().split('\n');
    const header = csvData[0].trim() + ',Status'; // Add "Status" to the header
    const newDataRows = data.map(word => {
        const rowData = Object.values(word).map(value => `"${value}"`).join(',');
        return `${rowData},${word.Status}`; // Add status to each row
    }).join('\n');
    const updatedCSV = `${header}\n${newDataRows}`;

    // Write the updated CSV data back to the file
    fs.writeFileSync('data/words_to_learn.csv', updatedCSV);
};

app.listen(port, () => {
   console.log(`Flashy app listening at http://localhost:${port}`);
});