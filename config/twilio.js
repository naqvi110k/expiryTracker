const axios = require("axios");
const dotenv = require("dotenv");

// Ensure environment variables are loaded
dotenv.config();

const sendTelegramMessage = async (message) => {
  // Validate credentials before sending
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in .env file");
  }
  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID is not defined in .env file");
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
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


module.exports = { sendTelegramMessage };
