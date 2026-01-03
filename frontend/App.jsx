
import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import ResultCard from './components/ResultCard.jsx';
import { extractProductDetails } from './services/geminiService.js';

const App = () => {
  const [image, setImage] = useState(null);
  const [extraction, setExtraction] = useState({
    isLoading: false,
    error: null,
    data: null,
  });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImage(base64String);
        processImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64) => {
    setExtraction({ isLoading: true, error: null, data: null });
    try {
      const data = await extractProductDetails(base64);
      setExtraction({ isLoading: false, error: null, data });
     console.log(extraction.data);
     
    } catch (err) {
      setExtraction({
        isLoading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred.",
        data: null,
      });
    }
  };

  const reset = () => {
    setImage(null);
    setExtraction({ isLoading: false, error: null, data: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">

          <section className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Extract Product Data
            </h2>
            <p className="text-gray-500 text-lg">
              Upload or snap a photo of product packaging to identify details instantly.
            </p>
          </section>

          {!image ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer group relative block w-full border-2 border-gray-300 border-dashed rounded-3xl p-12 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-white transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col items-center">
                <div className="p-4 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                  <svg className="mx-auto h-12 w-12 text-indigo-600" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="mt-4 block text-lg font-bold text-gray-900">Click to Upload or Take Photo</span>
                <span className="mt-1 block text-sm text-gray-500">Supports JPG, PNG (Max 10MB)</span>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                capture="environment"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={image}
                  alt="Product preview"
                  className="w-full h-auto max-h-96 object-contain rounded-3xl shadow-lg bg-black"
                />
                {!extraction.isLoading && (
                  <button
                    onClick={reset}
                    className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>

              {extraction.isLoading && (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg text-center space-y-4 animate-pulse">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Analyzing Product...</h3>
                  <p className="text-gray-500">Our AI is reading text, dates, and codes from your photo.</p>
                </div>
              )}

              {extraction.error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Extraction Failed</h3>
                    <p className="text-red-700 mt-1">{extraction.error}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {extraction.data && (
                <ResultCard details={extraction.data} onReset={reset} />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ScanLogix Pro. Powered by Gemini Vision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
