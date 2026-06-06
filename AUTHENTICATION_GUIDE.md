# Darbar Restaurant - Phone Number Authentication System
## Complete Implementation Guide

---

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Flows](#user-flows)
3. [UI Design Specifications](#ui-design-specifications)
4. [Database Schema](#database-schema)
5. [API Structure](#api-structure)
6. [Security Measures](#security-measures)
7. [Implementation Status](#implementation-status)

---

## 🎯 System Overview

### Features Implemented
- ✅ Phone number-based registration
- ✅ OTP verification (WhatsApp/SMS)
- ✅ Login with password + OTP for new devices
- ✅ Forgot password with OTP
- ✅ Guest checkout without registration
- ✅ User profile management
- ✅ Order history tracking

### Tech Stack
- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS (Dark Elegant Premium Theme)
- **State Management**: React Context API
- **Storage**: LocalStorage (development), Firebase (production)
- **OTP Service**: Mock (development), Twilio/WhatsApp Business API (production)

---

## 🔄 User Flows

### 1. Registration Flow

```
┌─────────────────┐
│  Start          │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Registration Form          │
│  - Full Name                │
│  - Phone Number             │
│  - Password                 │
│  - Address                  │
│  - Location Link (optional) │
└────────┬────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Check if Phone      │
│  Already Registered  │
└────┬───────┬─────────┘
     │       │
  Yes│       │No
     │       │
     ▼       ▼
┌─────────┐ ┌──────────────────┐
│  Error  │ │  Check if Phone  │
│  Show   │ │  WhatsApp-Linked │
└─────────┘ └────┬─────┬───────┘
                 │     │
            Yes  │     │  No
                 │     │
                 ▼     ▼
      ┌─────────────────────┐
      │   Send OTP via      │
      │  WhatsApp  OR  SMS  │
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │  OTP Verification   │
      │  (5 min expiry)     │
      └──────┬───────┬──────┘
             │       │
        Valid│       │Invalid
             │       │
             ▼       ▼
      ┌──────────┐ ┌──────┐
      │ Create   │ │ Retry│
      │ Account  │ │ OTP  │
      └────┬─────┘ └──────┘
           │
           ▼
      ┌──────────┐
      │  Login   │
      │ Success  │
      └──────────┘
```

### 2. Login Flow

```
┌────────────────┐
│  Start Login   │
└───────┬────────┘
        │
        ▼
┌─────────────────┐
│  Login Form     │
│  - Phone Number │
│  - Password     │
└───────┬─────────┘
        │
        ▼
┌───────────────────┐
│  Verify Phone &   │
│  Password         │
└────┬──────┬───────┘
     │      │
  Yes│      │No
     │      │
     ▼      ▼
┌───────────────┐ ┌─────────┐
│  Check Device │ │  Error  │
│  Fingerprint  │ │  Message│
└────┬───┬──────┘ └─────────┘
     │   │
New  │   │  Known
Device│   │  Device
     │   │
     ▼   ▼
┌──────────┐ ┌──────────┐
│  Send    │ │  Login   │
│  OTP     │ │  Success │
└────┬─────┘ └──────────┘
     │
     ▼
┌──────────────┐
│  Verify OTP  │
└────┬─────────┘
     │
     ▼
┌──────────────┐
│  Login       │
│  Success     │
└──────────────┘
```

### 3. Forgot Password Flow

```
┌─────────────────────┐
│  Forgot Password    │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────┐
│  Enter Phone Number  │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│  Check if Phone     │
│  Registered         │
└────┬──────┬─────────┘
     │      │
  Yes│      │No
     │      │
     ▼      ▼
┌──────────┐ ┌─────────┐
│  Send    │ │  Error  │
│  OTP     │ │  Message│
└────┬─────┘ └─────────┘
     │
     ▼
┌────────────────┐
│  Verify OTP    │
└────┬───────────┘
     │
     ▼
┌────────────────────┐
│  Enter New         │
│  Password          │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│  Verify OTP Again  │
│  (Security)        │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│  Password Reset    │
│  Success           │
└────────────────────┘
```

### 4. Guest Checkout Flow

```
┌─────────────────┐
│  Start Checkout │
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│  Check if        │
│  Logged In       │
└────┬──────┬──────┘
     │      │
  Yes│      │No
     │      │
     ▼      ▼
┌─────────┐ ┌───────────────────┐
│  User   │ │  Guest Form       │
│  Info   │ │  - Name           │
└─────────┘ │  - Phone          │
            │  - Address        │
            │  - Location Link  │
            │  - Special Note   │
            └────┬──────────────┘
                 │
                 ▼
            ┌──────────────┐
            │  Send OTP    │
            └────┬─────────┘
                 │
                 ▼
            ┌──────────────┐
            │  Verify OTP  │
            └────┬─────────┘
                 │
                 ▼
            ┌──────────────┐
            │  Proceed to  │
            │  Payment     │
            └──────────────┘
```

---

## 🎨 UI Design Specifications

### Color Palette (Dark Elegant Premium Theme)
```
Primary Colors:
- Background: #0f172a (slate-900)
- Secondary Background: #1e293b (slate-800)
- Gold Accent: #D4AF37
- Text Primary: #f1f5f9 (gray-100)
- Text Secondary: #cbd5e1 (gray-300)

Interactive Elements:
- Button Primary: linear-gradient(#D4AF37, #B8941F)
- Button Hover: linear-gradient(#F5C842, #D4AF37)
- Border: #D4AF37 with 20% opacity
- Input Focus: #D4AF37 with glow effect

Status Colors:
- Success: #10b981 (green-500)
- Error: #ef4444 (red-500)
- Warning: #f59e0b (amber-500)
- Info: #3b82f6 (blue-500)
```

### Typography
```
Font Families:
- Headings: 'Cinzel' (serif - royal style)
- Body: 'Cormorant Garamond' (serif)
- Buttons: 'Cinzel' with letter-spacing

Font Sizes:
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
```

### Component Patterns

#### Input Field
```tsx
<div className="relative">
  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
    Phone Number *
  </label>
  <input
    type="tel"
    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg
    text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20
    transition-all duration-300 font-[family-name:var(--font-cormorant)]"
    placeholder="+92 300 1234567"
  />
</div>
```

#### Button Primary
```tsx
<button className="w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)]
text-sm tracking-wider bg-gradient-to-r from-[#D4AF37] to-yellow-600
hover:from-yellow-600 hover:to-[#D4AF37] text-black font-semibold
shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300
transform hover:scale-105">
  Continue
</button>
```

#### Card Container
```tsx
<div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm
rounded-xl p-8 border border-[#D4AF37]/20 shadow-2xl">
  {/* Content */}
</div>
```

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
  uid VARCHAR(50) PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  location_link VARCHAR(255),
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_whatsapp_linked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_phone (phone_number)
);
```

### OTP_Sessions Table
```sql
CREATE TABLE otp_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  purpose ENUM('registration', 'login', 'forgot-password', 'guest-checkout') NOT NULL,
  method ENUM('whatsapp', 'sms') NOT NULL,
  attempts INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  INDEX idx_phone_purpose (phone_number, purpose),
  INDEX idx_expires (expires_at)
);
```

### Login_History Table
```sql
CREATE TABLE login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  is_new_device BOOLEAN DEFAULT FALSE,
  login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(uid),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (login_timestamp)
);
```

### Guest_Orders Table
```sql
CREATE TABLE guest_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  location_link VARCHAR(255),
  special_instructions TEXT,
  order_data JSON NOT NULL,
  is_otp_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phone_number),
  INDEX idx_created (created_at)
);
```

### Orders Table (Extended)
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id VARCHAR(50), -- NULL for guest orders
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  location_link VARCHAR(255),
  area VARCHAR(100),
  items JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_charges DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cod', 'jazzcash', 'easypaisa', 'card') NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled') DEFAULT 'pending',
  is_guest_order BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(uid),
  INDEX idx_order_number (order_number),
  INDEX idx_user_id (user_id),
  INDEX idx_phone (customer_phone),
  INDEX idx_status (order_status),
  INDEX idx_created (created_at)
);
```

---

## 🔌 API Structure

### Authentication Endpoints

#### 1. Register User
```typescript
POST /api/auth/register

Request Body:
{
  fullName: string;
  phoneNumber: string; // format: +92XXXXXXXXXX
  password: string; // min 8 characters
  address: string;
  locationLink?: string;
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    requiresOTP: boolean;
    otpMethod: 'whatsapp' | 'sms';
  }
}
```

#### 2. Verify Registration OTP
```typescript
POST /api/auth/verify-registration

Request Body:
{
  phoneNumber: string;
  otp: string; // 6 digits
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  }
}
```

#### 3. Login
```typescript
POST /api/auth/login

Request Body:
{
  phoneNumber: string;
  password: string;
  deviceInfo?: string;
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
    requiresOTP?: boolean;
    otpMethod?: 'whatsapp' | 'sms';
  }
}
```

#### 4. Verify Login OTP
```typescript
POST /api/auth/verify-login

Request Body:
{
  phoneNumber: string;
  otp: string;
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  }
}
```

#### 5. Forgot Password - Send OTP
```typescript
POST /api/auth/forgot-password

Request Body:
{
  phoneNumber: string;
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    otpMethod: 'whatsapp' | 'sms';
  }
}
```

#### 6. Verify Forgot Password OTP
```typescript
POST /api/auth/verify-forgot-password

Request Body:
{
  phoneNumber: string;
  otp: string;
}

Response:
{
  success: boolean;
  message: string;
  data?: {
    resetToken: string; // temporary token for password reset
  }
}
```

#### 7. Reset Password
```typescript
POST /api/auth/reset-password

Request Body:
{
  resetToken: string;
  newPassword: string;
  phoneNumber: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

### OTP Endpoints

#### 8. Send OTP
```typescript
POST /api/otp/send

Request Body:
{
  phoneNumber: string;
  purpose: 'registration' | 'login' | 'forgot-password' | 'guest-checkout';
}

Response:
{
  success: boolean;
  message: string;
  method: 'whatsapp' | 'sms';
  expiresIn: number; // seconds
}
```

#### 9. Resend OTP
```typescript
POST /api/otp/resend

Request Body:
{
  phoneNumber: string;
  purpose: string;
}

Response:
{
  success: boolean;
  message: string;
  method: 'whatsapp' | 'sms';
}
```

### User Profile Endpoints

#### 10. Get User Profile
```typescript
GET /api/user/profile

Headers:
Authorization: Bearer <token>

Response:
{
  success: boolean;
  data: UserProfile;
}
```

#### 11. Update User Profile
```typescript
PUT /api/user/profile

Headers:
Authorization: Bearer <token>

Request Body:
{
  fullName?: string;
  address?: string;
  locationLink?: string;
}

Response:
{
  success: boolean;
  message: string;
  data: UserProfile;
}
```

#### 12. Change Password
```typescript
POST /api/user/change-password

Headers:
Authorization: Bearer <token>

Request Body:
{
  currentPassword: string;
  newPassword: string;
  otp: string; // OTP for verification
}

Response:
{
  success: boolean;
  message: string;
}
```

#### 13. Get Order History
```typescript
GET /api/user/orders?page=1&limit=10

Headers:
Authorization: Bearer <token>

Response:
{
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  }
}
```

### Guest Checkout Endpoints

#### 14. Guest Checkout - Send OTP
```typescript
POST /api/guest/send-otp

Request Body:
{
  phoneNumber: string;
  name: string;
  address: string;
  locationLink?: string;
}

Response:
{
  success: boolean;
  message: string;
  method: 'whatsapp' | 'sms';
}
```

#### 15. Guest Checkout - Verify & Create Order
```typescript
POST /api/guest/checkout

Request Body:
{
  name: string;
  phoneNumber: string;
  address: string;
  locationLink?: string;
  otp: string;
  items: CartItem[];
  paymentMethod: string;
}

Response:
{
  success: boolean;
  message: string;
  data: {
    orderId: string;
    orderNumber: string;
  }
}
```

---

## 🔒 Security Measures

### 1. Password Security
```typescript
// Use bcrypt for password hashing
import bcrypt from 'bcryptjs';

// Hash password before storing
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Password Requirements:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - Optional: Special character
```

### 2. OTP Security
```typescript
// OTP Configuration
const OTP_CONFIG = {
  length: 6,
  expiryMinutes: 5,
  maxAttempts: 3,
  resendCooldown: 60, // seconds
  blockDuration: 15, // minutes after max attempts
};

// Rate Limiting
const OTP_RATE_LIMITS = {
  perPhone: 5, // max OTPs per phone per hour
  perIP: 10, // max OTPs per IP per hour
};
```

### 3. Session Management
```typescript
// JWT Token Configuration
const JWT_CONFIG = {
  accessTokenExpiry: '1h',
  refreshTokenExpiry: '7d',
  algorithm: 'HS256',
};

// Session Storage (Redis recommended)
interface Session {
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
}
```

### 4. Phone Number Validation
```typescript
// Phone Number Validation
const validatePhoneNumber = (phone: string): boolean => {
  // Pakistan phone number format
  const pakistanRegex = /^(\+92|0)?3[0-9]{9}$/;
  return pakistanRegex.test(phone);
};

// Normalize phone number
const normalizePhoneNumber = (phone: string): string => {
  // Convert to international format
  let normalized = phone.replace(/\s+/g, '');
  if (normalized.startsWith('0')) {
    normalized = '+92' + normalized.substring(1);
  }
  return normalized;
};
```

### 5. Device Fingerprinting
```typescript
// Device Fingerprint
const generateDeviceFingerprint = (): string => {
  const data = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return btoa(JSON.stringify(data));
};
```

### 6. Request Throttling
```typescript
// Rate Limiter Middleware
const rateLimiter = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
  },
  otp: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 OTP requests per hour
  },
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registration attempts per hour
  },
};
```

---

## ✅ Implementation Status

### Completed ✓
- [x] Type definitions (auth.ts)
- [x] Mock OTP service (otpService.ts)
- [x] Authentication context (AuthContext.tsx)
- [x] Layout integration
- [x] Documentation

### In Progress 🔄
- [ ] Registration page UI
- [ ] Login page UI
- [ ] OTP verification component
- [ ] Forgot password page
- [ ] User profile page
- [ ] Guest checkout integration

### Pending ⏳
- [ ] Firebase integration
- [ ] Twilio SMS integration
- [ ] WhatsApp Business API integration
- [ ] Email notifications
- [ ] Admin dashboard for user management
- [ ] Two-factor authentication (optional)

---

## 📱 Screen Wireframes

### Registration Screen
```
┌─────────────────────────────────────┐
│  ← Back              DARBAR         │
│                                     │
│  Create Account                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                     │
│  Full Name *                        │
│  ┌───────────────────────────────┐ │
│  │ Enter your full name          │ │
│  └───────────────────────────────┘ │
│                                     │
│  Phone Number *                     │
│  ┌───────────────────────────────┐ │
│  │ +92 300 1234567               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Password *                         │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••••        👁         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Address *                          │
│  ┌───────────────────────────────┐ │
│  │ Your delivery address         │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Location Link (Optional)           │
│  ┌───────────────────────────────┐ │
│  │ Google Maps link              │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Register Account         │ │
│  └───────────────────────────────┘ │
│                                     │
│  Already have an account? Login    │
└─────────────────────────────────────┘
```

### OTP Verification Screen
```
┌─────────────────────────────────────┐
│  ← Back              DARBAR         │
│                                     │
│  Verify Phone Number                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                     │
│  We've sent a 6-digit code via      │
│  WhatsApp to +92 300 1234567       │
│                                     │
│  Enter OTP Code                     │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │  5  │ │  4  │ │  3  │          │
│  └─────┘ └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │  2  │ │  1  │ │  0  │          │
│  └─────┘ └─────┘ └─────┘          │
│                                     │
│  Expires in: 04:23                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Verify & Continue        │ │
│  └───────────────────────────────┘ │
│                                     │
│  Didn't receive code?               │
│  Resend OTP (available in 0:30)    │
└─────────────────────────────────────┘
```

### Login Screen
```
┌─────────────────────────────────────┐
│  ← Back              DARBAR         │
│                                     │
│  Welcome Back                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                     │
│  Phone Number *                     │
│  ┌───────────────────────────────┐ │
│  │ +92 300 1234567               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Password *                         │
│  ┌───────────────────────────────┐ │
│  │ ••••••••••••        👁         │ │
│  └───────────────────────────────┘ │
│                        Forgot?      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │         Login                 │ │
│  └───────────────────────────────┘ │
│                                     │
│  ─────────── OR ───────────        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Continue as Guest           │ │
│  └───────────────────────────────┘ │
│                                     │
│  Don't have an account? Register   │
└─────────────────────────────────────┘
```

### User Profile Screen
```
┌─────────────────────────────────────┐
│  ← Back    Profile        Logout    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Profile Information     │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                             │   │
│  │  Full Name                  │   │
│  │  Ahmed Khan           ✏️    │   │
│  │                             │   │
│  │  Phone Number               │   │
│  │  +92 300 1234567      ✓     │   │
│  │                             │   │
│  │  Address                    │   │
│  │  Gulberg, Lahore      ✏️    │   │
│  │                             │   │
│  │  Location Link              │   │
│  │  maps.google.com/...  ✏️    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Order History           │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │                             │   │
│  │  Order #DRB-001234          │   │
│  │  Chicken Biryani x2         │   │
│  │  Rs. 700    Delivered ✓     │   │
│  │  25 Nov 2025                │   │
│  │  ───────────────────────    │   │
│  │                             │   │
│  │  Order #DRB-001233          │   │
│  │  Seekh Kabab x1             │   │
│  │  Rs. 400    Preparing ⏱     │   │
│  │  24 Nov 2025                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Change Password            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Implement UI Components**
   - Create reusable form components
   - Build OTP input component
   - Design loading states

2. **Integrate Backend**
   - Set up Firebase Authentication
   - Configure Twilio for SMS
   - Set up WhatsApp Business API

3. **Testing**
   - Unit tests for auth logic
   - Integration tests for OTP flow
   - E2E tests for user journeys

4. **Deployment**
   - Environment configuration
   - Security hardening
   - Performance optimization

---

## 📞 Support

For implementation support or questions:
- Developer: Darbar Restaurant Dev Team
- Documentation: This file
- Issues: Create GitHub issue

---

**Last Updated**: November 25, 2025
**Version**: 1.0.0
