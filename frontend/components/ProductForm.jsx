import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import BarcodeScanner from './BarcodeScanner';
import { extractProductDetails } from '../services/productService';
import { getToken } from '../services/authService';
import {
  Upload,
  Loader,
  Scan,
  Info,
  Image as ImageIcon,
  Package,
  Database,
  Tag,
  Save,
  X,
  CheckCircle
} from 'lucide-react';

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading, darkMode = false }) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          name: initialData.name || '',
          category: initialData.category || '',
          brand: initialData.brand || '',
          batchNumber: initialData.batchNumber || '',
          quantity: initialData.quantity || 0,
          unit: initialData.unit || 'units',
          expiryDate: initialData.expiryDate ? initialData.expiryDate.split('T')[0] : '',
          description: initialData.description || '',
          image: initialData.image || null,
          barcode: initialData.barcode || null
        }
      : {
          name: '',
          category: '',
          brand: '',
          batchNumber: '',
          quantity: 0,
          unit: 'units',
          expiryDate: '',
          description: '',
          image: null,
          barcode: null
        }
  );
  const [extracting, setExtracting] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [extractError, setExtractError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const parseExpiryDate = (dateString) => {
    if (!dateString) return '';
    let cleanDate = dateString.replace(/^(exp|exp\.|expiry|expiry date|exp date)[\s:.-]*/i, '').trim();
    const patterns = [
      {
        regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
        parse: (m) => `${m[3]}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`
      },
      {
        regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
        parse: (m) => `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`
      },
      {
        regex: /(\d{1,2})[\/\-](\d{4})/,
        parse: (m) => {
          const month = String(m[1]).padStart(2, '0');
          const year = m[2];
          return `${year}-${month}-01`;
        }
      },
      {
        regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-]*(\d{4})/i,
        parse: (m) => {
          const months = {
            jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
            jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
          };
          const month = String(months[m[1].toLowerCase().substring(0, 3)]).padStart(2, '0');
          const year = m[2];
          return `${year}-${month}-01`;
        }
      }
    ];

    for (const { regex, parse } of patterns) {
      const match = cleanDate.match(regex);
      if (match) return parse(match);
    }
    return '';
  };

  const compressImage = (base64String, quality = 0.7, maxWidth = 800) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = base64String;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setExtractError(null);
    try {
      const base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const compressedImage = await compressImage(base64String, 0.7, 800);
      setImagePreview(compressedImage);
      setFormData((prev) => ({ ...prev, image: compressedImage }));

      const extractedData = await extractProductDetails(compressedImage);

      setFormData((prev) => ({
        ...prev,
        name: extractedData.productName || prev.name,
        category: extractedData.category || prev.category,
        brand: extractedData.brand || prev.brand,
        batchNumber: extractedData.batchNumber || prev.batchNumber,
        quantity: extractedData.quantity ? parseInt(extractedData.quantity) || prev.quantity : prev.quantity,
        expiryDate: parseExpiryDate(extractedData.expiryDate) || prev.expiryDate,
        description: extractedData.description || prev.description,
        image: compressedImage
      }));
    } catch (error) {
      setExtractError(error.message || 'Failed to extract product details from image');
    } finally {
      setExtracting(false);
    }
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const token = getToken();
      if (!token) return null;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/lookup?barcode=${encodeURIComponent(barcode)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const productData = await response.json();
      return {
        name: productData.name,
        category: productData.category,
        brand: productData.brand,
        description: productData.description
      };
    } catch (error) {
      return null;
    }
  };

  const handleBarcodeScan = async (decodedText) => {
    setShowScanner(false);
    setExtracting(true);
    try {
      const productData = await fetchProductByBarcode(decodedText);
      if (productData) {
        setFormData((prev) => ({
          ...prev,
          name: productData.name || prev.name,
          category: productData.category || prev.category,
          description: productData.description || prev.description,
          brand: productData.brand || prev.brand,
          barcode: decodedText
        }));
        setExtractError(null);
      } else {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || `Product ${decodedText}`,
          barcode: decodedText
        }));
      }
    } catch (error) {
      setExtractError('Could not fetch product details. Please enter manually.');
      setFormData((prev) => ({ ...prev, barcode: decodedText }));
    } finally {
      setExtracting(false);
    }
  };

  const validateForm = () => {
    const checks = [
      { field: 'name', value: formData.name, validator: (v) => v.trim().length > 0 },
      { field: 'category', value: formData.category, validator: (v) => v.trim().length > 0 },
      { field: 'batchNumber', value: formData.batchNumber, validator: (v) => v.trim().length > 0 },
      {
        field: 'quantity',
        value: formData.quantity,
        validator: (v) => {
          const numValue = parseInt(v);
          return !isNaN(numValue) && numValue >= 0;
        }
      },
      {
        field: 'expiryDate',
        value: formData.expiryDate,
        validator: (v) => {
          if (!v) return false;
          if (initialData) return true;
          const selectedDate = new Date(v);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      }
    ];
    return checks.every((check) => check.validator(check.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      alert('Please complete all required fields before saving.');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Image Upload & Barcode Scanner (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div
              className={`relative aspect-video sm:aspect-square rounded-xl border border-dashed overflow-hidden flex flex-col items-center justify-center transition-colors ${
                darkMode
                  ? 'bg-[#141414] border-[#383838] hover:border-[#22C55E]'
                  : 'bg-white border-[#CFCFC8] hover:border-[#15803D]'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={extracting}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                id="form-image-upload"
              />

              {imagePreview ? (
                <div className="relative w-full h-full p-6">
                  <img
                    src={imagePreview}
                    alt="Product label preview"
                    className="w-full h-full object-contain"
                  />
                  {extracting && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader className="w-10 h-10 text-[#22C55E] animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 z-20">
                    <span className="px-3 py-1.5 bg-[#111111] text-white rounded-md text-xs font-medium">
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  {extracting ? (
                    <Loader className="w-12 h-12 animate-spin text-[#15803D]" />
                  ) : (
                    <div
                      className={`p-3.5 rounded-xl border ${
                        darkMode ? 'bg-[#1A1A1A] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
                      }`}
                    >
                      <Upload className="w-7 h-7 text-[#15803D] dark:text-[#4ADE80]" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-bold">Upload Product Label Photo</h3>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
                      AI Vision automatically extracts SKU, batch code, and expiry date
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowScanner(true)}
                className="gap-2 text-xs"
              >
                <Scan size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                <span>Scan Barcode</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('form-image-upload').click()}
                className="gap-2 text-xs"
              >
                <ImageIcon size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                <span>Choose Photo</span>
              </Button>
            </div>

            {extractError && (
              <div className="p-3.5 rounded-lg flex items-center gap-2.5 border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] dark:border-[#5E1A1A] dark:bg-[#2A1212] dark:text-[#F87171] text-xs">
                <Info size={16} className="shrink-0" />
                <span>{extractError}</span>
              </div>
            )}

            {formData.name && imagePreview && !extracting && (
              <div className="p-3.5 rounded-lg flex items-center gap-2.5 border border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] dark:border-[#19422B] dark:bg-[#0D2116] dark:text-[#4ADE80] text-xs">
                <CheckCircle size={16} className="shrink-0" />
                <span>AI Vision extracted product details from label photo.</span>
              </div>
            )}
          </div>

          {/* Right Column: Form Fields (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-5">
            <div
              className={`p-5 rounded-xl border ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E4E4E0] dark:border-[#262626]">
                <Package className="text-[#15803D] dark:text-[#4ADE80]" size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Product Identity</h4>
              </div>
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Amoxicillin 500mg Capsules"
                  darkMode={darkMode}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Pharmacy / Dairy"
                    darkMode={darkMode}
                    required
                  />
                  <Input
                    label="Brand / Manufacturer"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleChange}
                    placeholder="e.g. GSK"
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E4E4E0] dark:border-[#262626]">
                <Database className="text-[#15803D] dark:text-[#4ADE80]" size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Batch &amp; Expiration</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Batch / Lot Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  placeholder="e.g. LOT-8941A"
                  darkMode={darkMode}
                  required
                />
                <Input
                  label="Barcode / EAN"
                  name="barcode"
                  value={formData.barcode || ''}
                  onChange={handleChange}
                  placeholder="e.g. 8901234567890"
                  darkMode={darkMode}
                />
                <div className="grid grid-cols-2 gap-3">
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
                    placeholder="e.g. boxes"
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
              </div>
            </div>

            <div
              className={`p-5 rounded-xl border ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Tag className="text-[#15803D] dark:text-[#4ADE80]" size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">Storage Notes</h4>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F3] placeholder-[#6E6E68] focus:border-[#22C55E]'
                    : 'bg-white border-[#CFCFC8] text-[#111111] placeholder-[#767670] focus:border-[#15803D]'
                }`}
                placeholder="Enter aisle location, temperature requirements, or supplier return notes..."
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`mt-6 pt-5 border-t flex items-center justify-end gap-3 ${
            darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'
          }`}
        >
          <Button type="button" variant="outline" onClick={onCancel} className="gap-1.5">
            <X size={15} />
            <span>Cancel</span>
          </Button>
          <Button type="submit" variant="accent" isLoading={isLoading} className="gap-1.5 px-6">
            <Save size={15} />
            <span>{initialData ? 'Save Changes' : 'Save Product'}</span>
          </Button>
        </div>
      </form>

      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className={`w-full max-w-lg rounded-xl overflow-hidden border ${
              darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
            }`}
          >
            <BarcodeScanner
              onScan={handleBarcodeScan}
              onError={(e) => {
                console.error(e);
                setShowScanner(false);
              }}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
