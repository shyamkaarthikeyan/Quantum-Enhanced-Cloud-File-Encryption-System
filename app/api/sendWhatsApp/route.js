// app/api/sendWhatsApp/route.js
import { Client } from 'twilio';

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function POST(req) {
  const { contentSid, contentVariables } = await req.json();

  // Validate input
  if (!contentSid || !contentVariables) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }),
      { status: 400 }
    );
  }

  // Create a Twilio client using the credentials
  const client = new Client(accountSid, authToken);

  try {
    // Send the WhatsApp message using Twilio's API
    const message = await client.messages.create({
      from: fromWhatsAppNumber,  // The Twilio WhatsApp number
      to: 'whatsapp:+1234567890', // Replace with the recipient's WhatsApp number
      body: 'Here is your custom message',
      contentSid: contentSid,
      contentVariables: JSON.stringify(contentVariables),  // Send content as a stringified object
    });

    // Return success response
    return new Response(JSON.stringify({ message: 'Message sent successfully', data: message }), { status: 200 });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500 });
  }
}
