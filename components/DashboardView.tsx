
import React, { useState, useEffect } from 'react';
import { getStoredImages } from '../services/storage';
import { SharedImage, AccessLog, DeviceType } from '../types';

const DashboardView: React.FC = () => {
  const [images, setImages] = useState<SharedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<SharedImage | null>(null);

  useEffect(() => {
    setImages(getStoredImages());
    const interval = setInterval(() => {
      setImages(getStoredImages());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (device: DeviceType) => {
    switch (device) {
      case DeviceType.MOBILE:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case DeviceType.TABLET:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tracking & Monitoring</h1>
          <p className="text-gray-400">View real-time access logs for your shared images.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Active Links</p>
          <p className="text-2xl font-bold text-indigo-500">{images.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {images.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No active links found.</p>
            </div>
          ) : (
            images.sort((a,b) => b.createdAt - a.createdAt).map(img => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                  selectedImage?.id === img.id 
                  ? 'bg-indigo-600/10 border-indigo-500/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-tighter">ID: {img.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${img.isViewed ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {img.isViewed ? 'Viewed' : 'Unopened'}
                  </span>
                </div>
                <h3 className="text-white font-semibold truncate mb-1">{img.name}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{img.viewCount} Hits</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedImage ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Access History: {selectedImage.name}</h2>
                  <p className="text-sm text-gray-500">Detailed forensics for this link.</p>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs text-gray-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Live
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedImage.logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                       <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No access attempts recorded yet.</p>
                  </div>
                ) : (
                  selectedImage.logs.sort((a,b) => b.timestamp - a.timestamp).map(log => (
                    <div key={log.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-black/60 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                          {getDeviceIcon(log.device)}
                        </div>
                        <div>
                          <p className="text-white font-mono text-sm">{log.ip}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            {log.platform} &bull; {log.device}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        <p className="text-[10px] text-gray-600">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center h-full min-h-[400px]">
              <p className="text-gray-500">Select a link from the left to view tracking data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
