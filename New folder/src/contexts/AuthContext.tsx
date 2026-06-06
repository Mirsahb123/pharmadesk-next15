"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, RegisterData, LoginData, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<{ success: boolean; needsOTP?: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; message: string }>;
  checkNewDevice: (phoneNumber: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('darbar_user');
    const storedSession = localStorage.getItem('darbar_session');

    if (storedUser && storedSession) {
      try {
        const userData = JSON.parse(storedUser);
        const sessionData = JSON.parse(storedSession);

        // Check if session is still valid (24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        const isSessionValid = sessionAge < 24 * 60 * 60 * 1000;

        if (isSessionValid) {
          setUser(userData);
        } else {
          // Session expired
          localStorage.removeItem('darbar_user');
          localStorage.removeItem('darbar_session');
        }
      } catch (error) {
        console.error('Error loading user session:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Check if this is a new device
  const checkNewDevice = (phoneNumber: string): boolean => {
    const deviceFingerprint = navigator.userAgent;
    const storedDevices = localStorage.getItem('darbar_devices');

    if (!storedDevices) return true;

    try {
      const devices = JSON.parse(storedDevices);
      const userDevices = devices[phoneNumber] || [];
      return !userDevices.includes(deviceFingerprint);
    } catch {
      return true;
    }
  };

  // Register new device
  const registerDevice = (phoneNumber: string) => {
    const deviceFingerprint = navigator.userAgent;
    const storedDevices = localStorage.getItem('darbar_devices');

    let devices = {};
    if (storedDevices) {
      try {
        devices = JSON.parse(storedDevices);
      } catch {
        devices = {};
      }
    }

    if (!devices[phoneNumber]) {
      devices[phoneNumber] = [];
    }

    if (!devices[phoneNumber].includes(deviceFingerprint)) {
      devices[phoneNumber].push(deviceFingerprint);
    }

    localStorage.setItem('darbar_devices', JSON.stringify(devices));
  };

  // Register new user
  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      // Get existing users
      const storedUsers = localStorage.getItem('darbar_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if phone number already exists
      const existingUser = users.find((u: UserProfile) => u.phoneNumber === data.phoneNumber);
      if (existingUser) {
        return {
          success: false,
          message: 'Phone number already registered. Please login.',
        };
      }

      // Create new user
      const newUser: UserProfile = {
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        locationLink: data.locationLink,
        createdAt: new Date(),
        lastLogin: new Date(),
        isPhoneVerified: true, // Already verified via OTP
        isWhatsAppLinked: data.phoneNumber.startsWith('+923') || data.phoneNumber.startsWith('03'),
      };

      // Store password separately (in production, this should be hashed on backend)
      const passwords = localStorage.getItem('darbar_passwords');
      const passwordStore = passwords ? JSON.parse(passwords) : {};
      passwordStore[data.phoneNumber] = data.password; // TODO: Hash in production
      localStorage.setItem('darbar_passwords', JSON.stringify(passwordStore));

      // Add to users array
      users.push(newUser);
      localStorage.setItem('darbar_users', JSON.stringify(users));

      // Set as current user
      setUser(newUser);
      localStorage.setItem('darbar_user', JSON.stringify(newUser));

      // Create session
      const session = {
        timestamp: Date.now(),
        phoneNumber: data.phoneNumber,
      };
      localStorage.setItem('darbar_session', JSON.stringify(session));

      // Register device
      registerDevice(data.phoneNumber);

      return {
        success: true,
        message: 'Registration successful!',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  };

  // Login user
  const login = async (data: LoginData): Promise<{ success: boolean; needsOTP?: boolean; message: string }> => {
    try {
      // Get users
      const storedUsers = localStorage.getItem('darbar_users');
      if (!storedUsers) {
        return {
          success: false,
          message: 'No account found with this phone number.',
        };
      }

      const users = JSON.parse(storedUsers);
      const foundUser = users.find((u: UserProfile) => u.phoneNumber === data.phoneNumber);

      if (!foundUser) {
        return {
          success: false,
          message: 'No account found with this phone number.',
        };
      }

      // Check password
      const passwords = localStorage.getItem('darbar_passwords');
      const passwordStore = passwords ? JSON.parse(passwords) : {};

      if (passwordStore[data.phoneNumber] !== data.password) {
        return {
          success: false,
          message: 'Incorrect password.',
        };
      }

      // Check if new device
      const isNewDevice = checkNewDevice(data.phoneNumber);

      if (isNewDevice) {
        return {
          success: false,
          needsOTP: true,
          message: 'New device detected. Please verify with OTP.',
        };
      }

      // Update last login
      foundUser.lastLogin = new Date();
      const userIndex = users.findIndex((u: UserProfile) => u.uid === foundUser.uid);
      users[userIndex] = foundUser;
      localStorage.setItem('darbar_users', JSON.stringify(users));

      // Set as current user
      setUser(foundUser);
      localStorage.setItem('darbar_user', JSON.stringify(foundUser));

      // Create session
      const session = {
        timestamp: Date.now(),
        phoneNumber: data.phoneNumber,
      };
      localStorage.setItem('darbar_session', JSON.stringify(session));

      return {
        success: true,
        message: 'Login successful!',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('darbar_user');
    localStorage.removeItem('darbar_session');
  };

  // Update user profile
  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return {
          success: false,
          message: 'No user logged in.',
        };
      }

      // Update user object
      const updatedUser = { ...user, ...data };

      // Update in users array
      const storedUsers = localStorage.getItem('darbar_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const userIndex = users.findIndex((u: UserProfile) => u.uid === user.uid);

        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('darbar_users', JSON.stringify(users));
        }
      }

      // Update current user
      setUser(updatedUser);
      localStorage.setItem('darbar_user', JSON.stringify(updatedUser));

      return {
        success: true,
        message: 'Profile updated successfully!',
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile.',
      };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isGuest,
    login,
    register,
    logout,
    updateProfile,
    checkNewDevice,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
