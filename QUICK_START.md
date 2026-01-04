# Quick Start Guide

## Backend Setup (One Time)

1. **Install Dependencies**
   ```bash
   cd d:\expiry-tracker
   npm install
   ```

2. **Verify `.env` Configuration**
   The root `.env` should have:
   - `MONGO_URI` ✅ (already configured)
   - `TWILIO_AUTH_TOKEN` ✅
   - `TWILIO_ACCOUNT_SID` ✅
   - `TELEGRAM_BOT_TOKEN` ✅

3. **Start Backend Server**
   ```bash
   npm start
   ```
   ✅ Backend running on `http://localhost:5000`

## Frontend Setup (One Time)

1. **Install Dependencies**
   ```bash
   cd d:\expiry-tracker\frontend
   npm install
   ```

2. **Verify `.env` Configuration**
   Check that `.env` has:
   - `VITE_API_KEY` ✅ (Gemini API key)
   - `VITE_API_URL=http://localhost:5000/api/products` ✅

3. **Start Frontend Server**
   ```bash
   npm run dev
   ```
   ✅ Frontend running on `http://localhost:5173` (or next available port)

## Daily Usage

### Terminal 1 - Backend
```bash
cd d:\expiry-tracker
npm start
```

### Terminal 2 - Frontend  
```bash
cd d:\expiry-tracker\frontend
npm run dev
```

### Open Browser
- Navigate to `http://localhost:5173`
- Start using the app!

## What Changed?

### Before (Mock Data)
- Products stored in React state
- Data lost on page refresh
- No backend communication
- Mock data hardcoded in constants

### After (Real Backend)
- Products stored in MongoDB
- Data persists across sessions
- All operations use backend API
- Real production-ready setup

## Key Features Working

✅ **Product Creation**
- Upload image with Gemini AI extraction
- Save to MongoDB
- See in real-time product list

✅ **Product Management**
- Edit products
- Delete products
- Search & filter live data

✅ **Image Processing**
- Upload product packaging photo
- AI extracts product name, batch, expiry, etc.
- Auto-fill form with extracted data

## Database

**MongoDB Atlas** is already set up and connected:
- Cluster: `cluster0.uexy3vc.mongodb.net`
- Database: Automatic (default)
- Collections: `products` (auto-created)

Your products are saved permanently!

## Troubleshooting

### "Cannot connect to backend"
- Verify backend is running (`npm start` in root folder)
- Check that port 5000 is available
- Wait a few seconds after starting backend

### "Products not loading"
- Check MongoDB connection in root `.env`
- Verify `VITE_API_URL` in `frontend/.env`
- Open browser console (F12) to see errors

### "Image upload not working"  
- Verify `VITE_API_KEY` is set in `frontend/.env`
- Check browser console for Gemini API errors
- Ensure API key is valid

## File Structure

```
expiry-tracker/
├── index.js                          # Backend entry
├── package.json                      # Backend dependencies
├── .env                              # Backend config (MongoDB, Twilio, etc)
├── controllers/
│   └── productController.js          # ✅ Updated with unit field
├── models/
│   └── productModel.js               # ✅ Updated with unit field
├── routes/
│   └── productRoutes.js              # API endpoints
├── frontend/
│   ├── package.json
│   ├── .env                          # ✅ Added VITE_API_URL
│   ├── services/
│   │   └── productService.js         # ✅ Calls real backend API
│   ├── App.jsx                       # ✅ Normalizes _id to id
│   └── components/
│       └── ProductForm.jsx           # ✅ Image upload + AI extraction
└── INTEGRATION_GUIDE.md              # Detailed documentation
```

## Commands Summary

```bash
# Backend
npm start                    # Start backend server

# Frontend
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build
```

## Next Steps

1. ✅ Start both servers
2. ✅ Open the application
3. ✅ Add a product with image
4. ✅ Verify it saves to MongoDB
5. ✅ Test edit and delete
6. ✅ Try filtering and search

Everything is ready to use! 🚀
