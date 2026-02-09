
export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  UNKNOWN = 'UNKNOWN'
}

export interface AccessLog {
  id: string;
  timestamp: number;
  ip: string;
  device: DeviceType;
  userAgent: string;
  platform: string;
  capturedImage?: string;
}

export interface SharedImage {
  id: string;
  dataUrl: string;
  name: string;
  createdAt: number;
  viewCount: number;
  isViewed: boolean;
  expiresAt?: number;
  logs: AccessLog[];
}

export interface AppState {
  images: SharedImage[];
}
