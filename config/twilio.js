const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const twilio = require('twilio');

const sendTelegramMessage = async (message, chatId) => {
  // Validate credentials before sending
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in .env file");
  }
  
  // If no specific chatId provided, fall back to global chat ID
  const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;
  
  if (!targetChatId) {
    throw new Error("No chat ID provided and TELEGRAM_CHAT_ID is not defined in .env file");
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: targetChatId,
        text: message
      },
      { timeout: 10000 } // 10 second timeout
    );
    console.log("✓ Telegram message sent successfully");
    return response.data;
  } catch (err) {
    console.error("✗ Error sending message to Telegram:", err.message);
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.error("  → Network issue: Cannot reach Telegram API. Check your internet connection or firewall settings.");
    }
    throw err;
  }
};


let _client = null;
function getTwilioClient() {
  if (!_client) {
    _client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return _client;
}

async function sendWhatsApp(message, toPhoneNumber) {
  try {
    const to = toPhoneNumber || process.env.SHOPKEEPER_WHATSAPP_TO;

    if (!to) {
      throw new Error('No destination WhatsApp number provided and SHOPKEEPER_WHATSAPP_TO is not set');
    }

    const client = getTwilioClient();
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      body: message
    });

    console.log("✅ WhatsApp sent:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ WhatsApp error:", error.message);
    throw error;
  }
}



module.exports = { sendTelegramMessage, sendWhatsApp };
