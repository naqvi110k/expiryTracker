# INVENTA Frontend

This is the frontend component of the INVENTA expiry tracking application, built with React and Vite.

## Overview

The frontend provides a user-friendly interface for small shopkeepers to manage their inventory, including:
- Adding and editing products with expiry dates
- Viewing product cards with expiry status indicators
- Generating PDF reports
- Managing user profiles
- AI-powered product recognition

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the frontend directory and add your environment variables:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Application

### Development Mode

To run the frontend in development mode:

```bash
npm run dev
```

This will start the development server, typically available at `http://localhost:5173`.

### Production Build

To build the frontend for production:

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

## Environment Variables

The frontend requires the following environment variables:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI features

These should be placed in a `.env.local` file in the frontend directory.

## Key Features

- **Responsive Design**: Works on desktop and mobile devices
- **Product Management**: Add, edit, and delete products
- **Visual Indicators**: Color-coded badges for expiry status
- **Barcode Scanner**: Integrated barcode scanning capability
- **Bulk Import**: Import multiple products at once
- **AI Integration**: Google Gemini integration for product recognition

## Project Structure

```
frontend/
├── components/     # React components
│   ├── ui/         # Reusable UI components
│   └── ...         # Main application components
├── services/       # API service functions
├── utils/          # Utility functions
├── src/            # Source files
├── public/         # Static assets
├── App.jsx         # Main application component
├── index.jsx       # Entry point
├── index.css       # Main styles
├── package.json    # Dependencies
└── vite.config.js  # Vite configuration
```

## Technologies Used

- React.js
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)
- HTML5 QR Code (barcode scanning)
- Google Gemini AI
- Service Workers (PWA features)

## API Integration

The frontend communicates with the backend API at `/api/*` endpoints. Make sure the backend server is running when using the frontend in development mode.

## Deployment

The frontend is configured for deployment to Vercel through the root `vercel.json` file. The build process will execute `npm run build` and serve the resulting files.
