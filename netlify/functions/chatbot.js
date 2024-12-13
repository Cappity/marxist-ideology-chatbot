const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        // Check if the body is empty
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Empty body" })
            };
        }

        const { userMessage } = JSON.parse(event.body);

        // Log the received message for debugging
        console.log("Received user message:", userMessage);

        if (!userMessage) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid JSON input or empty message." })
            };
        }

        // Example: Use an external API for responding (replace with real API)
        const API_KEY = process.env.API_KEY; // Ensure API_KEY is set in your environment variables
        const url = `https://api.example.com/ask?message=${encodeURIComponent(userMessage)}&apiKey=${API_KEY}`;
        
        const apiResponse = await fetch(url);
        const data = await apiResponse.json();

        // Check if the response from the API is valid
        if (data.answer) {
            return {
                statusCode: 200,
                body: JSON.stringify({ response: data.answer })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ response: "Sorry, I couldn't understand that." })
            };
        }
    } catch (error) {
        // Log any errors that occur
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error processing the request" })
        };
    }
};
