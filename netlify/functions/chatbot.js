const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Check if the method is POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ error: 'Only POST method is allowed' }),
        };
    }

    // Parse the incoming request body to extract the user's message
    let userMessage;
    try {
        const { userMessage: message } = JSON.parse(event.body);
        userMessage = message;
    } catch (error) {
        return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ error: 'Invalid JSON input or empty body.' }),
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
    };
};
