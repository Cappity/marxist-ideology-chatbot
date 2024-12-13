const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Set CORS headers to allow the frontend domain to access the function
    const headers = {
        'Access-Control-Allow-Origin': 'https://cappity.github.io', // Allow your frontend domain here
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // If the request is a preflight request (OPTIONS), we just return the CORS headers without processing the request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    try {
        // Ensure the body is not empty
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Empty body" })
            };
        }

        // Try to parse the incoming JSON body
        let parsedBody;
        try {
            parsedBody = JSON.parse(event.body);
        } catch (error) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON format" })
            };
        }

        const { userMessage } = parsedBody;

        // Log the received message
        console.log("Received user message:", userMessage);

        // Ensure there's a message
        if (!userMessage || userMessage.trim() === "") {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Message is empty or invalid" })
            };
        }

        // Example: Use an external API for responding (replace with your API URL)
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "API_KEY is missing" })
            };
        }

        const url = `https://api.example.com/ask?message=${encodeURIComponent(userMessage)}&apiKey=${API_KEY}`;
        
        // Make a request to the API (replace with your actual API)
        const apiResponse = await fetch(url);
        
        if (!apiResponse.ok) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Failed to fetch response from external API" })
            };
        }

        const data = await apiResponse.json();

        // Check if the API returned a valid response
        if (data.answer) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ response: data.answer })
            };
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ response: "Sorry, I couldn't understand that." })
            };
        }
    } catch (error) {
        // Log any errors for debugging
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Error processing the request" })
        };
    }
};
