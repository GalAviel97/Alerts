const express = require('express');
const fs = require('fs');
const axios = require('axios');
const watch = require('watch');

const app = express();
const port = 3000;

const sourceFilePath = 'source.json';  // Replace with your source JSON file
const destinationFilePath = 'destination.json';  // Replace with your destination JSON file
const apiUrl = 'https://www.mako.co.il/Collab/amudanan/alerts.json';

// Function to fetch data from the API and update the destination file
async function updateDestination() {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Referer': 'https://www.oref.org.il/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Write the response data to the destination file
        fs.writeFileSync(destinationFilePath, JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// Watch for changes and update the destination file
watch.watchTree('.', { interval: 1 }, () => {
    updateDestination();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    updateDestination(); // Initial update when the server starts
});
