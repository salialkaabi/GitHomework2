document.getElementById('start-quiz').addEventListener('click', () => {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
});

// Store the character result globally so we can use it when chatting
let userCharacter = '';

document.getElementById('quiz-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value,
        q2: document.querySelector('input[name="q2"]:checked')?.value,
        q3: document.querySelector('input[name="q3"]:checked')?.value,
    };

    // Check if all questions are answered
    if (!answers.q1 || !answers.q2 || !answers.q3) {
        alert('Please answer all questions!');
        return;
    }

    // Determine which Disney character the user is
    if (answers.q1 === 'red' && answers.q2 === 'adventure' && answers.q3 === 'dog') {
        userCharacter = 'Simba';
    } else if (answers.q1 === 'blue' && answers.q2 === 'reading' && answers.q3 === 'cat') {
        userCharacter = 'Belle';
    } else if (answers.q1 === 'green' && answers.q2 === 'singing' && answers.q3 === 'bird') {
        userCharacter = 'Ariel';
    } else if (answers.q1 === 'yellow' && answers.q2 === 'cooking' && answers.q3 === 'fish') {
        userCharacter = 'Tiana';
    } else {
        userCharacter = 'Mickey Mouse';
    }

    alert(`You are ${userCharacter}!`);

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    const messages = document.getElementById('messages');
    
    // Display welcome message from DisneyBot
    const botWelcome = document.createElement('div');
    botWelcome.textContent = `DisneyBot: Welcome ${userCharacter}! How are you feeling about your result? Ask me anything about Disney!`;
    botWelcome.className = 'bot-message';
    messages.appendChild(botWelcome);
    
    // Display user character result
    const userMessage = document.createElement('div');
    userMessage.textContent = `I got ${userCharacter}!`;
    userMessage.className = 'user-message';
    messages.appendChild(userMessage);
});

// Extract the sending functionality to a separate function so we can reuse it
async function sendMessageToDisneyBot(message) {
    const messages = document.getElementById('messages');
    
    // Call the DisneyBot API
    try {
        console.log('Sending to DisneyBot:', message, 'Character:', userCharacter);
        const response = await fetch('/api/disneybot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                character: userCharacter
            }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);

        const botMessage = document.createElement('div');
        botMessage.textContent = `DisneyBot: ${data.reply}`;
        botMessage.className = 'bot-message';
        messages.appendChild(botMessage);
        
        // Auto-scroll to the bottom of the chat
        messages.scrollTop = messages.scrollHeight;
    } catch (error) {
        console.error('Error communicating with DisneyBot:', error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'DisneyBot: Sorry, something went wrong! Please try again later.';
        errorMessage.className = 'bot-message';
        messages.appendChild(errorMessage);
    }
}

document.getElementById('send-message').addEventListener('click', () => {
    sendUserMessage();
});

// Also allow sending messages with Enter key
document.getElementById('chat-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendUserMessage();
    }
});

function sendUserMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        const messages = document.getElementById('messages');

        const userMessage = document.createElement('div');
        userMessage.textContent = message;
        userMessage.className = 'user-message';
        messages.appendChild(userMessage);
        
        // Send to DisneyBot
        sendMessageToDisneyBot(message);

        input.value = '';
    }
}