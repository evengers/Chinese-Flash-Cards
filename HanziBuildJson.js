const fs = require('fs');
const hanzi = require('hanzi');

// Start the hanzi module
hanzi.start();

// Main function to fetch all characters
const fetchAllCharacters = () => {
  const characters = [];

  // Iterate through all characters and add them to the array
  for (let id = 1; id <= 9933; id++) {
    const entry = hanzi.getCharacterInFrequencyListByPosition(id);
    characters.push({ id, character: entry.character, Status: 1 }); // Add Status field
  }

  return characters;
};

// Function to fetch definitions for all characters
const fetchDefinitionsForAllCharacters = async (characters) => {
  const allDefinitions = [];

  // Iterate through all characters and fetch definitions
  for (let character of characters) {
    console.log(`Fetching definitions for character: ${character.character}`);
    const definitions = await hanzi.definitionLookup(character.character);
    if (definitions && definitions.length > 0) {
     // allDefinitions.push({ id: character.id, character: character.character, Status: character.Status, definitions });
      let  concatDefinitions = "";
      let ctr = 1;
      for (let def of definitions){
          if (ctr > 1) concatDefinitions = concatDefinitions + "  OR-> ";
          concatDefinitions = concatDefinitions + def.definition;
          ctr = ctr +1;
         }
      allDefinitions.push({ id: character.id, Chinese: character.character, English: concatDefinitions, Status: character.Status });
    } else {
      console.log(`No definitions found for character: ${character.character}`);
    }
  }

  return allDefinitions;
};

// Main function to fetch data and save to JSON file
const fetchDataAndSaveToFile = async () => {
  try {
    console.log('Fetching all characters...');
    const characters = fetchAllCharacters();

    const definitions = await fetchDefinitionsForAllCharacters(characters);
    const outputFilePath = 'output.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(definitions, null, 2));
    console.log(`Data saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error fetching or saving data:', error);
  }
};

// Call the main function to fetch data and save to file
fetchDataAndSaveToFile();
