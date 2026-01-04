# Frontend-Backend Integration Guide

## Overview
The frontend has been successfully integrated with the backend to fetch all data from MongoDB instead of using mock data.

## Changes Made

### 1. **Frontend Product Service** (`frontend/services/productService.js`)
- Replaced mock in-memory data with real API calls using axios
- All CRUD operations now connect to the backend API at `http://localhost:5000/api/products`
- Supports `GET`, `POST`, `PUT`, `DELETE` operations

### 2. **Backend Model Updates** (`models/productModel.js`)
- Added `unit` field to the product schema (default: 'units')
- This allows storing the measurement unit (tablets, vials, ml, etc.)

### 3. **Backend Controller Updates** (`controllers/productController.js`)
- Updated `createProduct()` to handle the `unit` field
- Updated `updateProduct()` to handle the `unit` field

### 4. **Frontend Data Normalization** (`frontend/App.jsx`)
- Added normalization layer to convert MongoDB's `_id` to `id` field
- Ensures compatibility between frontend components and backend responses
- Implemented in: `fetchData()`, `handleCreateProduct()`, `handleUpdateProduct()`

### 5. **Environment Configuration** (`frontend/.env`)
- Added `VITE_API_URL=http://localhost:5000/api/products`
- Keep existing `VITE_API_KEY` for Gemini API

## API Endpoints

All endpoints are prefixed with: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all products |
| POST | `/` | Create a new product |
| PUT | `/:id` | Update a product by ID |
| DELETE | `/:id` | Delete a product by ID |
| POST | `/alert` | Send expiry alert (existing) |

## Expected Data Format

### Product Object (from Backend)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Amoxicillin 500mg",
  "category": "Antibiotics",
  "batchNumber": "AX-2023-001",
  "quantity": 1500,
  "unit": "tablets",
  "expiryDate": "2025-06-15T00:00:00Z",
  "description": "Broad-spectrum antibiotic",
  "__v": 0
}
```

### Product Object (used in Frontend - normalized)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "_id": "507f1f77bcf86cd799439011",
  "name": "Amoxicillin 500mg",
  "category": "Antibiotics",
  "batchNumber": "AX-2023-001",
  "quantity": 1500,
  "unit": "tablets",
  "expiryDate": "2025-06-15T00:00:00Z",
  "description": "Broad-spectrum antibiotic"
}
```

## How to Run

### Backend
```bash
# Install dependencies (if not already done)
npm install

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173 (or next available port)
```

## Features Now Connected to Backend

✅ **Create Product** - Image upload with Gemini AI extraction
✅ **List Products** - Real-time data from MongoDB
✅ **Update Product** - Edit existing products in database
✅ **Delete Product** - Remove products from database
✅ **Search & Filter** - Works with live data
✅ **Expiry Tracking** - All calculations based on real data

## Important Notes

1. **MongoDB Connection**: Ensure your MongoDB connection string is set in `.env` in the root directory
2. **CORS**: The backend has CORS enabled to accept requests from `http://localhost:5173` and other origins
3. **Date Format**: Backend stores dates as ISO strings (e.g., "2025-06-15T00:00:00Z")
4. **ID Normalization**: The frontend automatically converts `_id` from MongoDB to `id` for internal use

## Testing the Integration

1. Start backend server: `npm start` (from root directory)
2. Start frontend server: `npm run dev` (from frontend directory)
3. Open http://localhost:5173 (or the port shown in terminal)
4. Click "Add Product" and upload an image
5. Verify data is saved to MongoDB and reflects in the product list
6. Test Edit and Delete operations
7. Check MongoDB to confirm data persistence

## Troubleshooting

### API Connection Issues
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

### Data Not Saving
- Verify MongoDB connection in root `.env`
- Check backend console for error messages
- Ensure all required fields are provided

### Images Not Showing
- Image URLs won't work with new backend (no imageUrl field)
- Consider adding image upload to backend if needed
- For now, products display without image

## Future Enhancements

1. **Image Upload to Server**: Store product images on backend storage
2. **User Authentication**: Add login/signup functionality
3. **Batch Operations**: Bulk delete/update
4. **Export/Import**: CSV export of products
5. **Analytics**: Expiry statistics and trends
