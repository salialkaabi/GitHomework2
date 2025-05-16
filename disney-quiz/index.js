console.log('Starting server...');

console.log('Loading express...');
const express = require('express');
console.log('Express loaded successfully.');

const app = express(); // Define the app here
console.log('Express app initialized.');

console.log('Loading path...');
const path = require('path');
console.log('Path loaded successfully.');

console.log('Loading dotenv...');
require('dotenv').config();
console.log('Dotenv loaded successfully.');

console.log('Loading body-parser...');
const bodyParser = require('body-parser');
console.log('Body-parser loaded successfully.');

console.log('Loading cors...');
const cors = require('cors');
console.log('CORS loaded successfully.');

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// DisneyBot response templates
const disneyResponses = {
  // Character-specific responses
  Simba: [
    "Hakuna Matata! Life's problems shouldn't worry you!",
    "Remember who you are! You're the one true king!",
    "Sometimes you have to leave the past behind to find your future.",
    "The great kings of the past look down on us from those stars."
  ],
  Belle: [
    "There must be more than this provincial life!",
    "I love books! They take you to amazing places where you've never been before.",
    "Don't judge a beast by its appearance. True beauty lies within.",
    "Adventure is out there in the great wide somewhere!"
  ],
  Ariel: [
    "Look at this stuff, isn't it neat?",
    "The human world is fascinating, isn't it?",
    "Sometimes you have to take risks to follow your dreams!",
    "I want to be where the people are!"
  ],
  Tiana: [
    "The only way to get what you want in this world is through hard work.",
    "Dreams do come true, if you work hard enough!",
    "Gumbo is my specialty! It's all in the roux.",
    "Never lose sight of what's important in life."
  ],
  "Mickey Mouse": [
    "Oh boy! Hot dog! That's swell!",
    "Remember, it all started with a mouse!",
    "Dreams really do come true, don't they?",
    "The greatest moments in life are the magical ones you share with friends."
  ],
  // Generic responses
  general: [
    "Disney magic is everywhere if you just believe!",
    "All our dreams can come true, if we have the courage to pursue them.",
    "Laughter is timeless, imagination has no age, and dreams are forever.",
    "If you can dream it, you can do it!",
    "The flower that blooms in adversity is the most rare and beautiful of all."
  ]
};

console.log('Defining POST /api/disneybot route...');
app.post('/api/disneybot', (req, res) => {
    try {
        console.log('Request received at /api/disneybot');
        console.log('Request method:', req.method);
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);

        if (!req.body || !req.body.message) {
            console.error('Invalid request body:', req.body);
            return res.status(400).json({ reply: 'Invalid request. Please include a message.' });
        }

        const userMessage = req.body.message;
        const character = req.body.character;

        console.log('User message:', userMessage);
        console.log('Character received:', character);

        // Log available keys in disneyResponses
        console.log('Available characters:', Object.keys(disneyResponses));

        let botReply;

        if (character && disneyResponses[character]) {
            console.log(`Character "${character}" found. Selecting a response.`);
            const responses = disneyResponses[character];
            botReply = responses[Math.floor(Math.random() * responses.length)];
        } else {
            console.warn(`Character "${character}" not found. Falling back to generic responses.`);
            const genericResponses = disneyResponses.general;
            botReply = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }

        console.log('Sending response:', botReply);
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error in /api/disneybot route:', error);
        res.status(500).json({ reply: 'Internal Server Error. Please try again later.' });
    }
});
console.log('POST /api/disneybot route defined successfully.');

// Also add a GET endpoint for testing
app.get('/api/disneybot', (req, res) => {
  res.json({ reply: "I'm DisneyBot! Send me a POST request to chat with me." });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

