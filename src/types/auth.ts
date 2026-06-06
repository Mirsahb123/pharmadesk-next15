// Authentication Types for Darbar Restaurant

export interface UserProfile {
  uid: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  locationLink?: string; // Optional Google Maps link
  createdAt: Date;
  lastLogin: Date;
  isPhoneVerified: boolean;
  isWhatsAppLinked: boolean;
}

export interface RegisterData {
  fullName: string;
  phoneNumber: string;
  password: string;
  address: string;
  locationLink?: string;
}

export interface LoginData {
  phoneNumber: string;
  password: string;
}

export interface GuestCheckoutData {
  name: string;
  phoneNumber: string;
  address: string;
  locationLink?: string;
  specialInstructions?: string;
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
  purpose: 'registration' | 'login' | 'forgot-password' | 'guest-checkout';
}

export interface OTPSession {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  method: 'whatsapp' | 'sms';
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
}

export interface LoginHistory {
  uid: string;
  phoneNumber: string;
  deviceInfo: string;
  ipAddress: string;
  timestamp: Date;
  isNewDevice: boolean;
}
