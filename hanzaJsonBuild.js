const fs = require('fs');
const hanzi = require('hanzi');

// Start the hanzi module
hanzi.start();

// Function to fetch definitions for a Chinese character
const fetchDefinitions = (character, id) => {
  return new Promise((resolve, reject) => {
    hanzi.definitionLookup(character, (results) => {
      if (results.length > 0) {
        const data = results.map((entry) => ({
          id,
          character: entry.simplified || entry.traditional,
          pinyin: entry.pinyin,
          definition: entry.definition
        }));
        resolve(data);
      } else {
        resolve([]);
      }
    });
  });
};

// Function to fetch all entries and their definitions
const fetchAllEntries = async () => {
  const allEntries = [];

  for (let id = 1; id <= 9933; id++) {
    const entry = hanzi.getCharacterInFrequencyListByPosition(id);
    const definitions = await fetchDefinitions(entry.character, id);
    if (definitions.length > 0) {
      allEntries.push(...definitions);
    }
  }

  return allEntries;
};

// Main function to fetch and save data
const fetchDataAndSaveToFile = async () => {
  try {
    const data = await fetchAllEntries();
    const outputFilePath = 'output.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
};

// Call the main function to fetch data and save to file
fetchDataAndSaveToFile();