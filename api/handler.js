// Vercel API route handler for Express app

// Import the main app
const app = require('../index.js');

module.exports = function handler(req, res) {
  // Use the imported Express app to handle the request (including CORS and preflight)
  return app(req, res);
};

// Configure Vercel serverless function body size limit
module.exports.config = {
  api: {
    responseStreaming: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};