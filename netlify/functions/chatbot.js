const fetch = require('node-fetch');

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
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: headers,
                body: JSON.stringify({ error: 'Only POST method is allowed' })
            };
        }

        const { userMessage } = JSON.parse(event.body);

        // Debugging: check if the user message is present
        if (!userMessage) {
            console.log('Error: No message provided');
            return {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({ error: 'Message is missing' })
            };
        }

        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.log('Error: No API key found');
            return {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ error: 'API key not found in environment variables' })
            };
        }

        // Call to OpenAI API or any other service (add debugging)
        console.log(`Sending request to OpenAI API with message: ${userMessage}`);
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
        console.log('OpenAI Response:', data); // Debugging

        if (response.ok && data) {
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({ response: data.choices[0].message.content })
            };
        } else {
            console.log('Error fetching response from OpenAI:', data);
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
