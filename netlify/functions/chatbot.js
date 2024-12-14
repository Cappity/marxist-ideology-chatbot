const fetch = require('node-fetch');  // Fetch API for sending requests

exports.handler = async function(event, context) {
    const { userMessage } = JSON.parse(event.body);  // Parse user message from the frontend

    // Default error message
    let reply = "Sorry, I couldn't understand your request.";

    // Check if the user asks about the creator
    if (userMessage.toLowerCase().includes("who made you")) {
        reply = "Arahant made me! I'm here to help you with anything.";
    } else {
        // Hugging Face API URL and your API key
        const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2'; // Or any other Hugging Face model
        const HUGGING_FACE_API_KEY = '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';  // Replace with your Hugging Face API key

        // Send the user message to the Hugging Face API
        const response = await fetch(HUGGING_FACE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: userMessage })  // Send user input
        });

        // Parse the API response
        const data = await response.json();
        if (data && data[0] && data[0].generated_text) {
            reply = data[0].generated_text;  // Extract the generated text from the model
        }
    }

    // Return the bot's reply
    return {
        statusCode: 200,
        body: JSON.stringify({ reply })  // Send the response back to the frontend
    };
};
