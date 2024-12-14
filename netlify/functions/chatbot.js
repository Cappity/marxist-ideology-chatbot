const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Handle preflight request (OPTIONS method)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // No Content
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
                'Access-Control-Allow-Methods': 'OPTIONS,POST', // Allow specific methods
                'Access-Control-Allow-Headers': 'Content-Type' // Allow Content-Type header
            }
        };
    }

    // Handle POST request
    if (event.httpMethod === 'POST') {
        let userMessage;
        try {
            const { userMessage: message } = JSON.parse(event.body);
            userMessage = message;
        } catch (error) {
            return {
                statusCode: 400, // Bad Request
                body: JSON.stringify({ error: 'Invalid JSON input or empty body.' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            };
        }

        // Generate a response based on the user's message
        let response = "Sorry, I could not understand your request.";

        // Simple response logic for the Marxism-related question
        if (userMessage.toLowerCase().includes('marxism')) {
            response = "Marxism is a socio-economic theory founded by Karl Marx that focuses on class struggle, capitalism, and the eventual establishment of a communist society.";
        } else if (userMessage.toLowerCase().includes('capitalism')) {
            response = "Capitalism is an economic system in which the means of production are privately owned, and the production of goods and services is for profit.";
        } else if (userMessage.toLowerCase().includes('class struggle')) {
            response = "Class struggle refers to the conflict between different classes in society, especially between the bourgeoisie (owners of production) and the proletariat (working class).";
        }

        // Return the response in JSON format
        return {
            statusCode: 200,
            body: JSON.stringify({ response }),
            headers: {
                'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
                'Access-Control-Allow-Methods': 'OPTIONS,POST', // Allow specific methods
                'Access-Control-Allow-Headers': 'Content-Type' // Allow Content-Type header
            }
        };
    }

    // Handle invalid HTTP methods
    return {
        statusCode: 405, // Method Not Allowed
        body: JSON.stringify({ error: 'Only POST method is allowed' }),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };
};
