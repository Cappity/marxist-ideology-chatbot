const fetch = require('node-fetch'); // Make sure 'node-fetch' is included

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET', // Allow specific HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allow Content-Type header
    };

    // Handle OPTIONS request for preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: headers,
            body: JSON.stringify({})
        };
    }

    try {
        // Check if the request is a POST request
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: headers,
                body: JSON.stringify({ error: 'Only POST method is allowed' })
            };
        }

        // Parse the incoming JSON body
        const { userMessage } = JSON.parse(event.body);

        if (!userMessage) {
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Message is missing' })
            };
        }

        // Use your OpenAI API or any chatbot API here
        const apiKey = process.env.API_KEY; // Ensure your API key is available in environment variables

        // Replace with actual chatbot service call, for example OpenAI API
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        const data = await response.json();

        // Check if the response is successful
        if (response.ok && data) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ response: data.choices[0].message.content })
            };
        } else {
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'Error in fetching the response from the AI model.' })
            };
        }
    } catch (error) {
        console.error('Error in function:', error);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
