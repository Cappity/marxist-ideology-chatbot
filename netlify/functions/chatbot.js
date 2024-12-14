const fetch = require('node-fetch');  // Add this for API requests

exports.handler = async function(event, context) {
    const { userMessage } = JSON.parse(event.body);

    const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2'; // Change this to your specific model endpoint
    const HUGGING_FACE_API_KEY = 'your_huggingface_api_key'; // Add your Hugging Face API key here

    const response = await fetch(HUGGING_FACE_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: userMessage, // Send user input to the model
        }),
    });

    const data = await response.json();

    let reply = "Sorry, I couldn't understand your request.";  // Default error message
    if (data && data[0] && data[0].generated_text) {
        reply = data[0].generated_text;  // Extract the response from Hugging Face API
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ reply: reply })
    };
};
