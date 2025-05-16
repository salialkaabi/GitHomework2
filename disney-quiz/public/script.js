document.getElementById('start-quiz').addEventListener('click', () => {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
});

document.getElementById('quiz-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value,
        q2: document.querySelector('input[name="q2"]:checked')?.value,
        q3: document.querySelector('input[name="q3"]:checked')?.value,
    };

    let character = '';

    if (answers.q1 === 'red' && answers.q2 === 'adventure' && answers.q3 === 'dog') {
        character = 'Simba';
    } else if (answers.q1 === 'blue' && answers.q2 === 'reading' && answers.q3 === 'cat') {
        character = 'Belle';
    } else if (answers.q1 === 'green' && answers.q2 === 'singing' && answers.q3 === 'bird') {
        character = 'Ariel';
    } else if (answers.q1 === 'yellow' && answers.q2 === 'cooking' && answers.q3 === 'fish') {
        character = 'Tiana';
    } else {
        character = 'Mickey Mouse';
    }

    alert(`You are ${character}!`);

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    const messages = document.getElementById('messages');
    const userMessage = document.createElement('div');
    userMessage.textContent = `I got ${character}!`;
    userMessage.className = 'user-message';
    messages.appendChild(userMessage);
});

document.getElementById('send-message').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        const messages = document.getElementById('messages');

        const userMessage = document.createElement('div');
        userMessage.textContent = message;
        userMessage.className = 'user-message';
        messages.appendChild(userMessage);

        // Call the DisneyBot API
        try {
            const response = await fetch('/api/disneybot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            const botMessage = document.createElement('div');
            botMessage.textContent = `DisneyBot: ${data.reply}`;
            botMessage.className = 'bot-message';
            messages.appendChild(botMessage);
        } catch (error) {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'DisneyBot: Sorry, something went wrong!';
            errorMessage.className = 'bot-message';
            messages.appendChild(errorMessage);
        }

        input.value = '';
    }
});