const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const FILE_NAME = 'data.json';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CRUD operations for JSON data
app.post('/crud', (req, res) => {
    const { action, payload } = req.body;

    // Read operation
    if (action === 'read') {
        const data = readDataFromFile();
        if (payload === 'all') {
            res.json(data);
        } else {
            const item = data.find(item => item.id === parseInt(payload));
            if (item) {
                res.json(item);
            } else {
                res.status(404).send('Item not found.');
            }
        }
    }
    // Update operation
    else if (action === 'update') {
        const { id, statusChange } = payload;
        const data = readDataFromFile();
        const index = data.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            // Update status based on statusChange ('correct' or 'incorrect')
            const status = data[index].Status || 0;
            data[index].Status = status + (statusChange === 'correct' ? 1 : -1);
            saveDataToFile(data);
            res.send('Item updated successfully.');
        } else {
            res.status(404).send('Item not found.');
        }
    }
    // Other actions
    else {
        res.status(400).send('Invalid action.');
    }
});

// Utility functions to read/write data from/to file
function readDataFromFile() {
    try {
        const data = fs.readFileSync(FILE_NAME, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveDataToFile(data) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(data), 'utf8');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});