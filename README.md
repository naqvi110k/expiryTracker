# Expiry Tracker (INVENTA)

An AI-powered expiry tracker application for small shopkeepers to manage inventory and receive automated notifications about expiring products.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage](#usage)

## ✨ Features

- **Product Management**: Add, update, delete, and view products with expiry dates
- **Automated Notifications**: Daily WhatsApp alerts about expiring products
- **Categorized Alerts**: 
  - Expired products (❌)
  - Critical products (expires in 0-7 days) (🚨)
  - Warning products (expires in 8-30 days) (⚠️)
- **PDF Reports**: Generate comprehensive expiry reports with visual indicators
- **User Authentication**: Secure login and registration system
- **Image Upload**: Store product images as base64 data
- **Real-time Dashboard**: React-based UI for managing inventory

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB/Mongoose
- JSON Web Tokens (JWT)
- bcryptjs (password hashing)
- node-cron (scheduled tasks)
- PDFKit (PDF generation)
- Twilio (WhatsApp notifications)

### Frontend
- React.js
- Vite (build tool)
- Lucide React (icons)
- Axios (HTTP client)
- JWT Decode (token handling)

## 🚀 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd expiry-tracker
```

2. **Install backend dependencies**:
```bash
npm install
```

3. **Navigate to frontend directory and install dependencies**:
```bash
cd frontend
npm install
```

4. **Return to root directory**:
```bash
cd ..
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
GEMINI_API_KEY=your_gemini_api_key (for frontend)
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products for the authenticated user
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `POST /api/products/alert` - Send expiry alert for a product
- `GET /api/products/report` - Generate expiry report (PDF)

## 🧩 Frontend Components

### UI Components
- **Button.jsx** - Reusable button component
- **Input.jsx** - Styled input field
- **Dialog.jsx** - Modal dialog component
- **Sheet.jsx** - Side sheet component
- **Badge.jsx** - Status badge component

### Main Components
- **App.jsx** - Main application component
- **Login.jsx** - User login form
- **Register.jsx** - User registration form
- **ProductCard.jsx** - Display individual product cards
- **ProductDetails.jsx** - Detailed product information
- **ProductForm.jsx** - Form for adding/editing products
- **Profile.jsx** - User profile management
- **ProtectedRoute.jsx** - Route protection middleware

### Services
- **authService.js** - Authentication API calls
- **productService.js** - Product management API calls
- **userService.js** - User profile API calls
- **geminiService.js** - AI integration service

## 📁 Project Structure

```
expiry-tracker/
├── config/
│   ├── db.js          # Database configuration
│   └── twilio.js      # Twilio/WhatsApp configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management logic
│   ├── reportController.js  # Report generation logic
│   └── userController.js    # User profile logic
├── frontend/
│   ├── components/
│   │   ├── ui/        # Reusable UI components
│   │   └── ...        # Main components
│   ├── services/      # API service functions
│   ├── public/        # Static assets
│   └── ...            # Main app files
├── middleware/
│   └── authMiddleware.js # Authentication middleware
├── models/
│   ├── productModel.js # Product schema
│   └── userModel.js    # User schema
├── routes/
│   ├── authRoutes.js   # Authentication routes
│   ├── productRoutes.js # Product routes
│   └── userRoutes.js   # User routes
├── services/
│   └── notificationScheduler.js # Automated notification system
├── .env.example       # Environment variables example
├── index.js           # Main server file
├── package.json       # Backend dependencies
└── README.md          # This file
```

## 📊 Automated Notifications

The system includes a daily notification scheduler that runs at 9:00 AM (Asia/Karachi timezone) and sends WhatsApp messages with:

- Summary of expired products
- Products expiring soon (critical and warning categories)
- Overall inventory statistics
- Detailed product information

## 📈 Report Generation

The application can generate comprehensive PDF reports that include:

- Visual statistics cards for different expiry categories
- Categorized product lists with expiry information
- Color-coded indicators for product status
- Professional styling and formatting

## 🤖 AI Integration

The frontend includes integration with Google's Gemini AI for enhanced product management features.

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**:
```bash
npm run start
```

2. **In a separate terminal, start the frontend**:
```bash
cd frontend
npm run dev
```

### Production Deployment

The application is configured for deployment on Vercel, with the backend serving as an API server.

## 📱 Usage

1. Register a new account or login to an existing one
2. Add products with their expiry dates
3. Receive daily WhatsApp notifications about expiring products
4. Generate PDF reports to analyze inventory health
5. Update or delete products as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.