"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // const { signIn, signUp, signInWithGoogle } = useAuth();  // Uncomment after packages installed

  // Temporary mock functions for demo
  const signIn = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock signIn:", email);
  };
  const signUp = async (email: string, password: string, name: string, phone: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock signUp:", { email, name, phone });
  };
  const signInWithGoogle = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Mock Google signIn");
  };
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        await signUp(formData.email, formData.password, formData.name, formData.phone);
        toast.success("Account created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#FAF8F0] rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-[#7B1818] px-6 py-4 flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#D4AF37]">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#D4AF37] hover:text-[#FAF8F0] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7B1818] hover:bg-[#5A1010] text-[#FAF8F0] py-3 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#7B1818]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#FAF8F0] text-[#7B1818]/60 font-[family-name:var(--font-cinzel)]">
                OR
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-[#7B1818]/30 hover:border-[#D4AF37] py-3 rounded transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-[family-name:var(--font-cinzel)] text-[#7B1818]">
              Continue with Google
            </span>
          </button>

          {/* Toggle Mode */}
          <p className="mt-4 text-center text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[#D4AF37] hover:text-[#7B1818] font-semibold"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
