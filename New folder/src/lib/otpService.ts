// Mock OTP Service for Development
// Replace with actual Twilio/WhatsApp Business API in production

import { OTPSession } from '@/types/auth';

// In-memory OTP storage (use Redis/Database in production)
const otpStore = new Map<string, OTPSession>();

// Check if phone number is WhatsApp-linked (mock implementation)
export const isWhatsAppLinked = (phoneNumber: string): boolean => {
  // In production, integrate with WhatsApp Business API
  // For now, assume numbers starting with +92 3 are WhatsApp-linked
  return phoneNumber.startsWith('+923') || phoneNumber.startsWith('03');
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via WhatsApp or SMS
export const sendOTP = async (
  phoneNumber: string,
  purpose: string
): Promise<{ success: boolean; method: 'whatsapp' | 'sms'; message: string }> => {
  try {
    // Check if phone has too many recent attempts
    const existingSession = otpStore.get(phoneNumber);
    if (existingSession && existingSession.attempts >= 3) {
      const timeLeft = Math.ceil((existingSession.expiresAt.getTime() - Date.now()) / 1000 / 60);
      return {
        success: false,
        method: existingSession.method,
        message: `Too many attempts. Please wait ${timeLeft} minutes.`,
      };
    }

    const otp = generateOTP();
    const method = isWhatsAppLinked(phoneNumber) ? 'whatsapp' : 'sms';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP session
    otpStore.set(phoneNumber, {
      phoneNumber,
      otp,
      expiresAt,
      attempts: existingSession ? existingSession.attempts + 1 : 1,
      method,
    });

    // Mock sending (in production, integrate actual API)
    console.log(`[${method.toUpperCase()}] OTP for ${phoneNumber}: ${otp}`);
    console.log(`Purpose: ${purpose}`);
    console.log(`Expires at: ${expiresAt.toLocaleString()}`);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      method,
      message: `OTP sent via ${method.toUpperCase()} to ${phoneNumber}`,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      method: 'sms',
      message: 'Failed to send OTP. Please try again.',
    };
  }
};

// Verify OTP
export const verifyOTP = (
  phoneNumber: string,
  otp: string
): { success: boolean; message: string } => {
  const session = otpStore.get(phoneNumber);

  if (!session) {
    return {
      success: false,
      message: 'No OTP session found. Please request a new OTP.',
    };
  }

  // Check expiration
  if (new Date() > session.expiresAt) {
    otpStore.delete(phoneNumber);
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.',
    };
  }

  // Verify OTP
  if (session.otp !== otp) {
    return {
      success: false,
      message: 'Invalid OTP. Please try again.',
    };
  }

  // Success - remove session
  otpStore.delete(phoneNumber);
  return {
    success: true,
    message: 'OTP verified successfully!',
  };
};

// Clear OTP session
export const clearOTPSession = (phoneNumber: string): void => {
  otpStore.delete(phoneNumber);
};

// Resend OTP
export const resendOTP = async (
  phoneNumber: string,
  purpose: string
): Promise<{ success: boolean; method: 'whatsapp' | 'sms'; message: string }> => {
  // Clear existing session
  clearOTPSession(phoneNumber);
  // Send new OTP
  return sendOTP(phoneNumber, purpose);
};
