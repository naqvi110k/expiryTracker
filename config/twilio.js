
const twilio = require('twilio');

// Set up Twilio client using environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send a WhatsApp message
const sendExpiryAlert = (phoneNumber, message) => {
    client.messages.create({
        body: message,
        from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio WhatsApp number
        to: `whatsapp:${phoneNumber}` // Shopkeeper's phone number
    })
    .then(message => console.log('WhatsApp message sent:', message.sid))
    .catch(err => console.log('Error sending message:', err));
};

module.exports = { sendExpiryAlert };
    