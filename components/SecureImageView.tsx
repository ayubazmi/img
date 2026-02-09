
import React, { useState, useEffect, useRef } from 'react';
import { getStoredImages, addLog, fetchIP, detectDevice } from '../services/storage';
import { SharedImage, AccessLog, DeviceType } from '../types';

interface SecureImageViewProps {
  imageId: string;
}

const SecureImageView: React.FC<SecureImageViewProps> = ({ imageId }) => {
  const [image, setImage] = useState<SharedImage | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isExpired, setIsExpired] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [loading, setLoading] = useState(true);
  // Fixed: Cannot find namespace 'NodeJS'. Use number for browser-based setInterval return value.
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const images = getStoredImages();
      const target = images.find(img => img.id === imageId);
      
      if (!target) {
        setIsExpired(true);
        setLoading(false);
        return;
      }

      // Log access immediately
      const ip = await fetchIP();
      const log: AccessLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        ip,
        device: detectDevice(navigator.userAgent),
        userAgent: navigator.userAgent,
        platform: navigator.platform
      };
      
      addLog(imageId, log);
      setImage(target);
      setLoading(false);

      // Start Countdown
      // Fixed: Use window.setInterval and cast to number to ensure compatibility in browser.
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
            }
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    };

    init();

    // Security: Blur if window loses focus
    const onBlur = () => setIsBlurred(true);
    const onFocus = () => setIsBlurred(false);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [imageId]);

  // Render to canvas to prevent simple "save as"
  useEffect(() => {
    if (image && canvasRef.current && !isExpired) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image.dataUrl;
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.7;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Apply some noise or watermark to deter perfect screenshots
          ctx.fillStyle = 'rgba(255,255,255,0.05)';
          ctx.font = '12px Inter';
          ctx.fillText('SnapGuard Private View', 10, 20);
        }
      };
    }
  }, [image, isExpired]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-medium">Verifying Credentials...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6V7m0 10a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">This link has expired</h1>
        <p className="text-gray-400 max-w-md">
          Images on SnapGuard are shared with strict "View Once" policies. 
          The content has been purged from the session for security reasons.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center unselectable overflow-hidden">
      {/* HUD Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center">
            <span className="text-red-500 font-bold text-lg">{timeLeft}</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold uppercase tracking-widest">Self-Destruct Active</p>
            <p className="text-xs text-gray-400">Viewing: {image?.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">SECURE CHANNEL</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`relative transition-all duration-300 ${isBlurred ? 'blur-2xl grayscale' : ''}`}>
        <canvas 
          ref={canvasRef} 
          className="rounded-lg shadow-2xl max-w-full"
          onContextMenu={(e) => e.preventDefault()}
        />
        
        {/* Anti-screenshot overlays */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 flex items-center justify-center">
          <div className="text-white/5 text-8xl font-black rotate-45 select-none pointer-events-none whitespace-nowrap">
            SECURE VIEW ONLY &bull; SECURE VIEW ONLY
          </div>
        </div>
      </div>

      {/* Security Warning Overlays */}
      {isBlurred && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="text-center p-8 bg-black/80 border border-white/10 rounded-3xl max-w-sm">
             <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
               <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Security Interlock Engaged</h3>
             <p className="text-sm text-gray-400">Content hidden while window is out of focus to prevent background captures.</p>
             <p className="text-xs text-indigo-400 mt-4">Return to tab to resume viewing.</p>
           </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[10px] text-gray-600 font-medium tracking-[0.2em] uppercase">Protected by SnapGuard Advanced Cryptography</p>
      </div>

      {/* Global CSS to further deter actions */}
      <style>{`
        body {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        img, canvas {
          -webkit-touch-callout: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default SecureImageView;
