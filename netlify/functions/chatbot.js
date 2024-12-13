const fetch = require('node-fetch'); // Import fetch to make HTTP requests

exports.handler = async function(event, context) {
    const { userMessage } = JSON.parse(event.body); // Get the user input from the request body

    const API_KEY = process.env.API_KEY; // Access the API key from environment variables
    const apiUrl = 'https://api-inference.huggingface.co/models/gpt2'; // Hugging Face API URL

    try {
        // Make a POST request to the Hugging Face API with the user message
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Pass API key in header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: userMessage }) // Send user message to the model
        });

        const data = await response.json(); // Get the AI's response

        return {
            statusCode: 200,
            body: JSON.stringify({
                response: data[0]?.generated_text || "Sorry, I couldn't understand that."
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error with the API request" })
        };
    }
};
