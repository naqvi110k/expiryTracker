import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScan, onError, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scanning || !scannerRef.current) return;
      
    // Configuration for the scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      disableFlip: false,
    };
      
    // Define the formats to support for better barcode detection
    const formatsToSupport = [
      'code_128',
      'code_39',
      'ean_13',
      'ean_8',
      'upc_a',
      'upc_e',
      'qr_code'
    ];
      
    let html5QrCode = null;
      
    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(scannerRef.current.id);
          
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
          setScanning(false);
          onScan(decodedText, decodedResult);
        };
  
        const qrCodeErrorCallback = (error) => {
          // Don't treat NotAllowedError as a general error
          if (error && typeof error === 'string' && error.includes('Only one request')) {
            // This is a known warning, not an error
            return;
          }
          if (error && !(error.name === 'NotAllowedError' || error.message.includes('Permission'))) {
            console.error('QR Code error:', error);
          }
        };
  
        // Try to start the camera with formats to support
        await html5QrCode.start({ facingMode: 'environment' }, {...config, formatsToSupport}, qrCodeSuccessCallback, qrCodeErrorCallback);
      } catch (err) {
        console.error('Camera initialization error:', err);
        
        // Provide a more helpful error message
        if (err.name === 'NotAllowedError') {
          onError(new Error('Camera permission was denied. Please check your browser settings and allow camera access for this site.'));
        } else if (err.name === 'NotFoundError') {
          onError(new Error('No camera was found on this device.'));
        } else if (err.name === 'NotSupportedError') {
          onError(new Error('Secure context required. Use HTTPS or localhost.'));
        } else {
          onError(err);
        }
        
        // Close scanner if camera access failed
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    };
    
    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          // Ignore errors when stopping, as the component is unmounting
        });
      }
    };
  }, [scanning, onScan, onError, onClose]);

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto'
  };

  return (
    <div className="barcode-scanner-container p-4">
      <div style={containerStyle}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Scan Barcode/QR Code</h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        
        {scanning ? (
          <div>
            <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 text-center">
              Point your camera at a barcode or QR code
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Scanning completed. Processing barcode data...
            </p>
            <button
              onClick={() => setScanning(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;