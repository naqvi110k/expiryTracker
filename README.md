# 📦 INVENTA — Expiry Tracker

> **Smart inventory management for small shopkeepers.**  
> Upload a product photo via WhatsApp → AI reads the expiry date → Product is saved automatically. No app required.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Twilio](https://img.shields.io/badge/WhatsApp-Twilio-red?style=flat-square&logo=whatsapp)](https://twilio.com)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-purple?style=flat-square&logo=google)](https://ai.google.dev)

---

## 🌟 Main Feature — Add Products via WhatsApp

**No app to download. No form to fill. Just send a photo on WhatsApp.**

```
📱 You:  [sends photo of product/label]
🤖 Bot:  📸 Product Preview
         Name: Nestle Milk Powder
         Qty: 500g
         Batch: B21934
         Expiry: 12/2025
         Category: Dairy

         Is this correct?
         ✅ Reply YES to save
         ❌ Reply NO to cancel
         ✏️ Or reply with corrections (e.g. "Name is Milk")

📱 You:  YES
🤖 Bot:  ✅ Product Nestle Milk Powder added to database!
```

### How It Works
1. **Send a photo** of the product or its label to your registered WhatsApp number
2. **Gemini AI reads** the product name, batch number, expiry date, and category from the image
3. **A preview is sent back** — you confirm, cancel, or correct any details via reply
4. **Product is saved** to your inventory automatically — no manual entry needed

---

## ✨ All Features

| Feature | Description |
|---|---|
| 📸 **WhatsApp Image Upload** | Send a product photo on WhatsApp — AI extracts all details and adds it to inventory |
| 🤖 **AI-Powered Extraction** | Google Gemini AI reads product name, expiry date, batch number, and category from images |
| 🔔 **Daily WhatsApp Alerts** | Automated morning alerts at 9:00 AM for expired and expiring products |
| 🏪 **Product Dashboard** | React web UI to view, add, edit, and delete products with expiry status |
| 📊 **PDF Reports** | One-click professional PDF report with color-coded expiry categories |
| 📂 **Bulk CSV/Excel Import** | Import hundreds of products at once via CSV or Excel file |
| 🔍 **Barcode Scanner** | Scan product barcode to auto-fill product details |
| 🔐 **User Authentication** | Secure JWT-based login/register system |
| 🌐 **Multi-channel Alerts** | Notifications via WhatsApp and Telegram |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database
- **Twilio** — WhatsApp messaging (sending & receiving)
- **Google Gemini AI** — Image analysis and product extraction
- **node-cron** — Scheduled daily notifications
- **PDFKit** — PDF report generation
- **JWT** + **bcryptjs** — Authentication & security
- **multer** — File uploads (CSV/Excel import)

### Frontend
- **React.js** + **Vite** — Fast modern UI
- **Axios** — HTTP client
- **Lucide React** — Icons

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/atlas))
- [Twilio account](https://twilio.com) with WhatsApp Sandbox enabled
- [Google Gemini API key](https://ai.google.dev)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd expiry-tracker

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Scheduler (set to true to enable daily notifications on production)
ENABLE_SCHEDULER_IN_PRODUCTION=false
```

### Running Locally

```bash
# Start the backend server (from root)
npm run start

# In a separate terminal, start the frontend
cd frontend
npm run dev
```

---

## ⚙️ WhatsApp Webhook Setup

For the WhatsApp image upload feature to work, Twilio must be able to reach your server.

1. **Expose your server** using [ngrok](https://ngrok.com):
   ```bash
   ngrok http 5000
   ```

2. **Copy the ngrok HTTPS URL** (e.g. `https://abc123.ngrok.io`)

3. **Set the Twilio WhatsApp Sandbox webhook** to:
   ```
   https://abc123.ngrok.io/api/notifications/whatsapp-webhook
   ```

4. **Register your number** in the Twilio sandbox by sending the join phrase to `+1 415 523 8886`

5. **Update your user profile** in the app with your WhatsApp phone number

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add a new product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| POST | `/api/products/alert` | Send expiry alert for a product |
| GET | `/api/products/report` | Generate PDF report |
| POST | `/api/products/bulk-import` | Bulk import from CSV/Excel |
| GET | `/api/products/lookup-barcode` | Auto-fill details from barcode |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications/whatsapp-webhook` | **WhatsApp image/text handler** |
| POST | `/api/notifications/trigger-daily-alerts` | Manually trigger daily alerts |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile (incl. WhatsApp number) |

---

## 📁 Project Structure

```
expiry-tracker/
├── api/
│   └── handler.js               # Vercel serverless entry point
├── config/
│   ├── db.js                    # MongoDB connection
│   └── twilio.js                # Twilio / WhatsApp config
├── controllers/
│   ├── authController.js        # Login / Register logic
│   ├── productController.js     # Product CRUD + WhatsApp webhook
│   ├── reportController.js      # PDF report generation
│   └── userController.js        # User profile logic
├── middleware/
│   └── authMiddleware.js        # JWT authentication
├── models/
│   ├── productModel.js          # Product schema
│   ├── pendingProduct.js        # Temp storage for WhatsApp uploads
│   └── userModel.js             # User schema
├── routes/
│   ├── authRoutes.js
│   ├── notificationRoutes.js    # WhatsApp webhook route
│   ├── productRoutes.js
│   └── userRoutes.js
├── services/
│   ├── geminiService.js         # Gemini AI image analysis
│   └── notificationScheduler.js # Daily cron notification
├── frontend/
│   ├── components/              # UI Components
│   ├── services/                # API service functions
│   ├── App.jsx
│   ├── index.jsx
│   └── vite.config.js
├── uploads/                     # Temp file storage (CSV/Excel)
├── .env.example
├── index.js                     # Express server entry point
├── package.json
└── vercel.json                  # Vercel deployment config
```

---

## 📊 Daily Notification System

The scheduler runs automatically at **9:00 AM (Asia/Karachi timezone)** and sends a WhatsApp summary including:

- ❌ **Expired products** — immediate action required
- 🚨 **Critical products** — expire within 7 days
- ⚠️ **Warning products** — expire within 8–30 days
- ℹ️ Overall inventory statistics

---

## 🚀 Deployment on Vercel

1. Push your code to GitHub
2. Connect the repository on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel → Settings → Environment Variables
4. Vercel will auto-deploy using `vercel.json` configuration

> ⚠️ **Note:** `node-cron` doesn't work reliably on serverless platforms. For production daily alerts, use:
> - Vercel Cron Jobs
> - GitHub Actions scheduled workflows
> - A manual call to `POST /api/notifications/trigger-daily-alerts` from an external scheduler

---

## 📱 Usage Guide

1. **Register** an account at the web app
2. **Add your WhatsApp number** in the Profile section
3. **Send a product photo** to your Twilio WhatsApp number
4. **Confirm the details** by replying YES (or correct them by replying with text)
5. **View your inventory** on the dashboard
6. **Receive daily alerts** every morning about expiring items
7. **Generate PDF report** anytime for a full inventory overview

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| WhatsApp webhook not receiving | Check ngrok is running and webhook URL is set in Twilio console |
| User not found error | Ensure the phone number in your profile matches your WhatsApp number (with country code) |
| Database connection failed | Check `MONGO_URI` is correct and IP is whitelisted in MongoDB Atlas |
| No daily notifications | Set `ENABLE_SCHEDULER_IN_PRODUCTION=true` or use an external scheduler |
| Image extraction inaccurate | Ensure the product label is clearly visible and well-lit in the photo |
| Bulk import errors | Check that your CSV/Excel has columns: `name`, `batchNumber`, `expiryDate`, `quantity` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Built with ❤️ for small shopkeepers who don't have time for manual inventory tracking.**

*No app. No form. Just WhatsApp.*

</div>