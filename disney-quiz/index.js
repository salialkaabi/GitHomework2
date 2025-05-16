const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// DisneyBot implementation
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

// DisneyBot API route
app.post('/api/disneybot', async (req, res) => {
  const userMessage = req.body.message;
  const userCharacter = req.body.character || null;
  
  try {
    // Generate response based on user input
    let botReply = '';
    
    // Check for character-specific mentions
    const characters = ['Simba', 'Belle', 'Ariel', 'Tiana', 'Mickey Mouse'];
    let characterDetected = userCharacter;
    
    // If no character provided, try to detect from message
    if (!characterDetected) {
      for (const character of characters) {
        if (userMessage.toLowerCase().includes(character.toLowerCase())) {
          characterDetected = character;
          break;
        }
      }
    }
    
    // Detect common questions or keywords
    if (userMessage.toLowerCase().includes('who are you')) {
      botReply = "I'm DisneyBot, a magical helper who loves to chat about all things Disney!";
    } 
    else if (userMessage.toLowerCase().includes('favorite movie')) {
      botReply = "That's a tough one! So many classics to choose from. What's your favorite Disney movie?";
    }
    else if (userMessage.toLowerCase().includes('favorite character')) {
      botReply = "I love all Disney characters! Each one has their own special magic. Who's your favorite?";
    }
    else if (userMessage.toLowerCase().includes('tell me about')) {
      // Extract what they want to know about
      const aboutIndex = userMessage.toLowerCase().indexOf('tell me about');
      const subject = userMessage.slice(aboutIndex + 'tell me about'.length).trim();
      
      switch(subject.toLowerCase()) {
        case 'disney world':
        case 'disneyworld':
          botReply = "Disney World in Florida is the most magical place on Earth with four amazing theme parks: Magic Kingdom, Epcot, Hollywood Studios, and Animal Kingdom!";
          break;
        case 'disneyland':
          botReply = "Disneyland in California is where the Disney park magic began in 1955! It's Walt Disney's original dream come true.";
          break;
        default:
          botReply = `I'd love to tell you more about ${subject}! What would you like to know specifically?`;
      }
    }
    // Character-specific responses if we detected a character
    else if (characterDetected && disneyResponses[characterDetected]) {
      const responses = disneyResponses[characterDetected];
      botReply = responses[Math.floor(Math.random() * responses.length)];
    }
    // Default to a general Disney response
    else {
      const generalResponses = disneyResponses.general;
      botReply = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
    
    // Send the response
    res.json({ reply: botReply });
    
  } catch (error) {
    console.error('Error with DisneyBot:', error);
    res.status(500).json({ reply: 'Sorry, I am having trouble responding right now.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});