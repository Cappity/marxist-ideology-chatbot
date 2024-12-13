const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  let body;

  // Safely parse the body and check if it's empty
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON input or empty body." })
    };
  }

  // Check if userMessage is present in the request body
  if (!body || !body.userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'userMessage' in the input" })
    };
  }

  const userMessage = body.userMessage;

  try {
    // Call the Hugging Face API with the message
    const response = await fetch('https://api-inference.huggingface.co/models/YOUR_MODEL_NAME', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: userMessage })
    });

    const data = await response.json();

    // Return the response from the Hugging Face API
    return {
      statusCode: 200,
      body: JSON.stringify({ response: data })
    };
  } catch (error) {
    console.error('Error fetching from Hugging Face:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
