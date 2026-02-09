
import { SharedImage, AccessLog, DeviceType } from '../types';

const STORAGE_KEY = 'snapguard_data';

export const getStoredImages = (): SharedImage[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveImage = (image: SharedImage): void => {
  const images = getStoredImages();
  images.push(image);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const updateImage = (id: string, updates: Partial<SharedImage>): void => {
  const images = getStoredImages();
  const index = images.findIndex(img => img.id === id);
  if (index !== -1) {
    images[index] = { ...images[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }
};

export const addLog = (imageId: string, log: AccessLog): void => {
  const images = getStoredImages();
  const index = images.findIndex(img => img.id === imageId);
  if (index !== -1) {
    images[index].logs.push(log);
    images[index].viewCount += 1;
    images[index].isViewed = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }
};

export const detectDevice = (ua: string): DeviceType => {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return DeviceType.TABLET;
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return DeviceType.MOBILE;
  }
  return DeviceType.DESKTOP;
};

export const fetchIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'Hidden/Protected';
  }
};
