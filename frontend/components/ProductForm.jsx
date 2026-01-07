import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { extractProductDetails } from '../services/geminiService';
import { Upload, Loader } from 'lucide-react';

const ProductForm = ({ initialData, onSave, onCancel, isLoading, darkMode = false }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: '',
    batchNumber: '',
    quantity: 0,
    unit: 'units',
    expiryDate: '',
    description: '',
    image: null
  });
  const [extracting, setExtracting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [extractError, setExtractError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const parseExpiryDate = (dateString) => {
    if (!dateString) return '';
    
    // Remove common prefixes
    let cleanDate = dateString.replace(/^(exp|exp\.|expiry|expiry date|exp date)[\s:.-]*/i, '').trim();
    
    // Try different date patterns
    const patterns = [
      // DD/MM/YYYY or DD-MM-YYYY
      { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parse: (m) => `${m[3]}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}` },
      // YYYY-MM-DD
      { regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, parse: (m) => `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}` },
      // MM/YYYY or MM-YYYY (use first day of month)
      { regex: /(\d{1,2})[\/\-](\d{4})/, parse: (m) => {
        const month = String(m[1]).padStart(2, '0');
        const year = m[2];
        return `${year}-${month}-01`;
      }},
      // Month Year format like "December 2025" (use first day of month)
      { regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-]*(\d{4})/i, parse: (m) => {
        const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
        const month = String(months[m[1].toLowerCase().substring(0, 3)]).padStart(2, '0');
        const year = m[2];
        return `${year}-${month}-01`;
      }},
    ];

    for (const { regex, parse } of patterns) {
      const match = cleanDate.match(regex);
      if (match) {
        return parse(match);
      }
    }

    return '';
  };

  // Compress image to reduce payload size
  const compressImage = (base64String, quality = 0.7, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = base64String;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Extract details using Gemini
    setExtracting(true);
    setExtractError(null);
    try {
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      // Compress image to reduce payload size
      const compressedImage = await compressImage(base64String, 0.7, 800);

      // Store compressed base64 image in form data
      setImagePreview(compressedImage);
      setFormData(prev => ({
        ...prev,
        image: compressedImage
      }));

      const extractedData = await extractProductDetails(base64String);
      
      // Auto-fill form with extracted data
      setFormData(prev => ({
        ...prev,
        name: extractedData.productName || prev.name,
        category: extractedData.category || prev.category,
        batchNumber: extractedData.batchNumber || prev.batchNumber,
        quantity: extractedData.quantity ? parseInt(extractedData.quantity) || prev.quantity : prev.quantity,
        expiryDate: parseExpiryDate(extractedData.expiryDate) || prev.expiryDate,
        description: extractedData.description || prev.description,
        unit: prev.unit,
        image: compressedImage
      }));
    } catch (error) {
      setExtractError(error.message || 'Failed to extract product details from image');
      console.error('Error extracting details:', error);
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image Upload Section */}
      <div className="space-y-3">
        <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload Product Image</label>
        <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors cursor-pointer ${darkMode ? 'border-slate-600 hover:border-cyan-500 bg-slate-700/50' : 'border-slate-300 hover:border-blue-400'}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={extracting}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="flex flex-col items-center gap-2 cursor-pointer">
            {extracting ? (
              <>
                <Loader className={`w-6 h-6 sm:w-8 sm:h-8 animate-spin ${darkMode ? 'text-cyan-500' : 'text-blue-500'}`} />
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Extracting product details...</p>
              </>
            ) : (
              <>
                <Upload className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Click to upload an image of the product</p>
              </>
            )}
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className={`text-xs sm:text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Image Preview:</p>
            <img
              src={imagePreview}
              alt="Product preview"
              className={`w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}
            />
          </div>
        )}
        
        {/* Error Message */}
        {extractError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-700">{extractError}</p>
          </div>
        )}

        {/* Success Message */}
        {formData.name && imagePreview && !extractError && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-700">✓ Product details extracted successfully</p>
          </div>
        )}
      </div>

      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Amoxicillin 500mg"
        darkMode={darkMode}
        required
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g. Antibiotics"
          darkMode={darkMode}
          required
        />
        <Input
          label="Batch Number"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          placeholder="e.g. B-12345"
          darkMode={darkMode}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Quantity"
          name="quantity"
          type="number"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          darkMode={darkMode}
          required
        />
        <Input
          label="Unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          placeholder="e.g. tablets"
          darkMode={darkMode}
          required
        />
      </div>

      <Input
        label="Expiry Date"
        name="expiryDate"
        type="date"
        value={formData.expiryDate}
        onChange={handleChange}
        darkMode={darkMode}
        required
      />

      <div className="space-y-2">
        <label className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`flex w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-300 focus:ring-cyan-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-blue-400'}`}
          placeholder="Enter product description..."
          required
        />
      </div>

      <div className={`flex justify-end gap-3 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;