const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { userMessage } = JSON.parse(event.body); // Get user input from request body

    const API_KEY = process.env.HUGGING_FACE_API_KEY; // Use environment variable for the API key
    const apiUrl = 'https://api-inference.huggingface.co/models/gpt2'; // Hugging Face API URL

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: userMessage })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify({ response: data[0]?.generated_text || "Sorry, I couldn't understand that." })
    };
};
