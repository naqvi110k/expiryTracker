import React, { useState } from 'react';
import Button from './ui/Button';
import { Upload, FileText, X } from 'lucide-react';
import { bulkImportProducts } from '../services/productService';

const BulkImport = ({ onClose, onImportSuccess, onSuccess, darkMode = false }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (
        !validTypes.includes(selectedFile.type) &&
        !selectedFile.name.toLowerCase().endsWith('.csv') &&
        !selectedFile.name.toLowerCase().endsWith('.xlsx')
      ) {
        alert('Please select a CSV or Excel file (.csv, .xlsx)');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await bulkImportProducts(file, (prog) => {
        setProgress(prog);
      });

      setUploadResult(result);
      setProgress(100);

      if (result.imported > 0) {
        if (onImportSuccess) onImportSuccess();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setUploadResult({
        error: error.message || 'Failed to upload file',
        imported: 0,
        errors: 1
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadResult(null);
  };

  const downloadSampleTemplate = () => {
    const csvContent = `name,category,batchNumber,quantity,unit,expiryDate,manufacturingDate,description,storageLocation,barcode,image\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-product-template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      <div
        className={`p-4 rounded-lg border text-xs space-y-1.5 ${
          darkMode ? 'bg-[#0A0A0A] border-[#262626] text-[#A3A39E]' : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#4A4A46]'
        }`}
      >
        <div className="font-semibold text-[#111111] dark:text-[#F5F5F3]">Manifest Formatting Guide:</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>Required columns: <code className="font-mono">name, batchNumber, expiryDate, quantity</code></li>
          <li>Supported formats: <code className="font-mono">.csv</code> or <code className="font-mono">.xlsx</code></li>
          <li>Date format: <code className="font-mono">YYYY-MM-DD</code> (e.g., 2026-12-31)</li>
        </ul>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider">Select Manifest File</label>
          <button
            type="button"
            onClick={downloadSampleTemplate}
            className="text-xs font-semibold flex items-center gap-1.5 text-[#15803D] dark:text-[#4ADE80] hover:underline cursor-pointer"
          >
            <FileText size={13} />
            <span>Download Sample CSV</span>
          </button>
        </div>

        <div
          className={`border border-dashed rounded-xl p-6 text-center transition-colors ${
            darkMode ? 'border-[#383838] bg-[#0A0A0A]' : 'border-[#CFCFC8] bg-[#FAF9F6]'
          }`}
        >
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80]" />
                  <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="text-xs font-mono text-[#767670] text-left">
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-7 h-7 mx-auto mb-2 text-[#767670]" />
              <p className="text-xs text-[#767670] mb-3">
                Drag and drop your CSV/XLSX manifest here, or browse files
              </p>
              <label
                className={`inline-block px-3.5 py-2 rounded-lg border text-xs font-semibold cursor-pointer ${
                  darkMode
                    ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                    : 'border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE]'
                }`}
              >
                Choose File
                <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
              </label>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span>Importing records...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-[#E4E4E0] dark:bg-[#262626]">
            <div
              className="h-full bg-[#15803D] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {uploadResult && (
        <div
          className={`p-4 rounded-lg border text-xs ${
            uploadResult.error
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] dark:bg-[#2A1212] dark:border-[#5E1A1A] dark:text-[#F87171]'
              : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] dark:bg-[#0D2116] dark:border-[#19422B] dark:text-[#4ADE80]'
          }`}
        >
          {uploadResult.error ? (
            <div>
              <div className="font-bold mb-1">Import Failed</div>
              <div>{uploadResult.error}</div>
            </div>
          ) : (
            <div>
              <div className="font-bold mb-1">Import Completed</div>
              <div>
                Successfully imported <strong>{uploadResult.imported}</strong> products.
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2.5 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={uploading}>
          Close
        </Button>
        <Button
          type="button"
          variant="accent"
          onClick={handleUpload}
          disabled={!file || uploading}
          isLoading={uploading}
        >
          {uploading ? 'Importing...' : 'Import Products'}
        </Button>
      </div>
    </div>
  );
};

export default BulkImport;
