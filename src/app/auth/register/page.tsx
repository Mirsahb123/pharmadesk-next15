"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { sendOTP, verifyOTP } from '@/lib/otpService';
import { RegisterData } from '@/types/auth';

const RegisterPage = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpMethod, setOtpMethod] = useState<'whatsapp' | 'sms'>('sms');

  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    phoneNumber: '',
    password: '',
    address: '',
    locationLink: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Send OTP
      const otpResponse = await sendOTP(formData.phoneNumber, 'registration');

      if (otpResponse.success) {
        setOtpMethod(otpResponse.method);
        setSuccess(otpResponse.message);
        setStep('otp');
      } else {
        setError(otpResponse.message);
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify OTP
      const verifyResponse = verifyOTP(formData.phoneNumber, otpCode);

      if (verifyResponse.success) {
        // Register user
        const registerResponse = await registerUser(formData);

        if (registerResponse.success) {
          setSuccess('Registration successful! Redirecting...');
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          setError(registerResponse.message);
        }
      } else {
        setError(verifyResponse.message);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);

    try {
      const otpResponse = await sendOTP(formData.phoneNumber, 'registration');
      if (otpResponse.success) {
        setSuccess('OTP resent successfully!');
      } else {
        setError(otpResponse.message);
      }
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)`
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#D4AF37] mb-2">
              {step === 'form' ? 'Create Account' : 'Verify Phone'}
            </h1>
            <p className="text-gray-400 font-[family-name:var(--font-cormorant)]">
              {step === 'form'
                ? 'Join Darbar Restaurant today'
                : `Enter the OTP sent via ${otpMethod.toUpperCase()} to ${formData.phoneNumber}`
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Registration Form */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 font-[family-name:var(--font-cormorant)]"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 font-[family-name:var(--font-cormorant)]"
                  placeholder="+92 300 1234567"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 font-[family-name:var(--font-cormorant)]"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37]"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 font-[family-name:var(--font-cormorant)] resize-none"
                  placeholder="Your complete delivery address"
                  required
                />
              </div>

              {/* Location Link */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                  Location Link (Optional)
                </label>
                <input
                  type="url"
                  name="locationLink"
                  value={formData.locationLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg text-gray-100 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 font-[family-name:var(--font-cormorant)]"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)] text-sm tracking-wider bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Register Account'}
              </button>
            </form>
          )}

          {/* OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-4 text-center">
                  Enter 6-Digit OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-black/30 border-2 border-gray-700 rounded-lg text-[#D4AF37] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some(d => !d)}
                className="w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)] text-sm tracking-wider bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-gray-400 hover:text-[#D4AF37] text-sm font-[family-name:var(--font-cormorant)] transition-colors disabled:opacity-50"
                >
                  Didn't receive code? <span className="underline">Resend OTP</span>
                </button>
              </div>

              {/* Back to Form */}
              <button
                onClick={() => {
                  setStep('form');
                  setOtp(['', '', '', '', '', '']);
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-gray-400 hover:text-[#D4AF37] text-sm font-[family-name:var(--font-cormorant)] transition-colors"
              >
                ← Change Phone Number
              </button>
            </div>
          )}

          {/* Login Link */}
          {step === 'form' && (
            <p className="mt-6 text-center text-gray-400 text-sm font-[family-name:var(--font-cormorant)]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#D4AF37] hover:text-yellow-500 transition-colors">
                Login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
