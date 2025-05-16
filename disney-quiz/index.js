const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Example usage of the API key
const apiKey = process.env.API_KEY;
console.log(`Your API key is: ${apiKey}`);

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Replace the require statement for 'node-fetch' with a dynamic import
(async () => {
    const fetch = (await import('node-fetch')).default;

    // DisneyBot API route
    app.post('/api/disneybot', async (req, res) => {
        const userMessage = req.body.message;

        try {
            // Example interaction with an external API using the API key
            const response = await fetch('https://api.example.com/disneybot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_KEY}`,
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            res.json({ reply: data.reply });
        } catch (error) {
            console.error('Error interacting with DisneyBot API:', error);
            res.status(500).json({ reply: 'Sorry, I am having trouble responding right now.' });
        }
    });

    // Start the server
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})();