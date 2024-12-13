const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Ensure that the request method is POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            body: JSON.stringify({ error: 'Only POST method is allowed' }),
        };
    }

    try {
        // Parse the incoming JSON body to get the user message
        const { userMessage } = JSON.parse(event.body);

        // Basic logic to respond based on the user message
        let responseMessage;

        if (userMessage.toLowerCase().includes('marxism')) {
            responseMessage = "Marxism is a theory of history and political economy, associated with Karl Marx and Friedrich Engels. It critiques capitalism and promotes a revolutionary transition to socialism.";
        } else {
            responseMessage = "Sorry, I could not understand your request.";
        }

        // Return a response as JSON
        return {
            statusCode: 200,
            body: JSON.stringify({ response: responseMessage }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500, // Internal Server Error
            body: JSON.stringify({ error: 'An error occurred while processing your request' }),
        };
    }
};
