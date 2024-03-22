const fs = require('fs');
const csv = require('csv-parser');

// Input and output file paths
const inputFile = 'input.csv'; // Replace 'input.csv' with your CSV file path
const outputFile = 'output.json'; // Output JSON file path

// Array to store JSON objects
const jsonData = [];

// Read CSV file and convert to JSON
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    // Convert each CSV row to JSON object
    const jsonRow = {
      id: parseInt(row.id),
      Chinese: row.Chinese,
      English: row.English,
      Status: row.Status ? parseInt(row.Status) : 0 // Convert Status to integer
    };
    jsonData.push(jsonRow);
  })
  .on('end', () => {
    // Write JSON data to output file
    fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2));
    console.log('CSV to JSON conversion completed.');
  })
  .on('error', (error) => {
    console.error('Error:', error.message);
  });