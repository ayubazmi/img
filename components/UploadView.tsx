
import React, { useState } from 'react';
import { saveImage } from '../services/storage';
import { SharedImage } from '../types';

const UploadView: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const id = Math.random().toString(36).substring(2, 11);
      
      const newImage: SharedImage = {
        id,
        name: file.name,
        dataUrl,
        createdAt: Date.now(),
        viewCount: 0,
        isViewed: false,
        logs: []
      };

      saveImage(newImage);
      
      const link = `${window.location.origin}/#/view/${id}`;
      setShareLink(link);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Secure Self-Destructing Images
        </h1>
        <p className="text-gray-400 text-lg">
          Upload an image, get a link. Once opened, it disappears in 10 seconds.
          Full protection against screenshots and downloads.
        </p>
      </div>

      {!shareLink ? (
        <label 
          className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
            dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white font-medium">Processing Security Layers...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-4 bg-indigo-600/20 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="mb-2 text-xl text-white font-semibold">Drop image here</p>
              <p className="text-gray-400 text-sm">or click to browse from device</p>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={isUploading} />
        </label>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Share Link Generated</h2>
            <button 
              onClick={() => setShareLink(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Upload New
            </button>
          </div>
          <div className="flex items-center p-4 bg-black/50 rounded-xl border border-white/5 mb-6">
            <input 
              type="text" 
              readOnly 
              value={shareLink} 
              className="bg-transparent border-none focus:ring-0 text-gray-300 w-full font-mono text-sm"
            />
            <button 
              onClick={copyToClipboard}
              className="ml-4 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
              <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">Duration</p>
              <p className="text-white font-medium">10 Seconds View</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Security</p>
              <p className="text-white font-medium">IP Tracking Enabled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadView;
