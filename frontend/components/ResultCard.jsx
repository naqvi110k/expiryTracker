import React, { useState } from 'react';
import axios from 'axios';

const extractNumber = (value) => {
  if (!value) return 0;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

const ResultCard = ({ details, onReset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: details.productName || '',
    batchNumber: details.batchNumber || '',
    expiryDate: details.expiryDate || '',
    quantity: extractNumber(details.quantity) || '',
    category: details.category || '',
    description: details.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fields = [
    { label: 'Product Name', name: 'name', icon: '📦', type: 'text' },
    { label: 'Batch Number', name: 'batchNumber', icon: '🔢', type: 'text' },
    { label: 'Expiry Date', name: 'expiryDate', icon: '📅', type: 'date' },
    { label: 'Quantity/Size', name: 'quantity', icon: '⚖️', type: 'number' },
    { label: 'Category', name: 'category', icon: '🏷️', type: 'text' },
    { label: 'Description', name: 'description', icon: '📝', type: 'text' },
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log('Submitting data:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setSubmitStatus('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        onReset();
      }, 2000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus(`Error: ${error.response?.data?.error || error.message || 'An error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Extraction Successful
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-white hover:text-indigo-100 transition-colors flex items-center gap-1 text-sm"
        >
          {isEditing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              View Mode
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </>
          )}
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {fields.map((field) => (
            <div key={field.name} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-200 transition-colors">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                {field.icon} {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  value={formData[field.name]}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full text-gray-900 font-semibold text-lg bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              ) : (
                <p className="text-gray-900 font-semibold text-lg">
                  {formData[field.name] || 'Not Detected'}
                </p>
              )}
            </div>
          ))}
        </div>

        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-semibold">Data submitted successfully!</span>
          </div>
        )}

        {submitStatus && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-semibold">{submitStatus}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Submit to Backend
              </>
            )}
          </button>
          
          <button
            onClick={onReset}
            className="py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;