"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { mockDeliveryZones, getDeliveryChargesByArea, generateOrderNumber } from "@/lib/mockData";

const CheckoutPage = () => {
  const router = useRouter();
  const { items, subtotal, deliveryCharges, total, setDeliveryCharges, clearCart } = useCartStore();

  const [customerType, setCustomerType] = useState<"guest" | "registered">("guest");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    locationLink: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa">("cod");
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [processing, setProcessing] = useState(false);

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleAreaChange = (area: string) => {
    setFormData({ ...formData, area });
    const charges = getDeliveryChargesByArea(area);
    setDeliveryCharges(charges);
  };

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.name || !formData.phone || !formData.address || !formData.area) {
      alert("Please fill all required fields");
      return;
    }

    setProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const orderNumber = generateOrderNumber();

      // Store order in sessionStorage for demo
      const order = {
        orderNumber,
        ...formData,
        items,
        subtotal,
        deliveryCharges,
        total,
        paymentMethod,
        whatsappNotif,
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem("lastOrder", JSON.stringify(order));

      // Clear cart
      clearCart();

      // Redirect to confirmation
      router.push(`/orders/${orderNumber}`);
    }, 1500);
  };

  const allAreas = mockDeliveryZones.flatMap((zone) => zone.areas);

  return (
    <div className="min-h-screen pt-20 bg-[#FAF8F0]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[#7B1818] hover:text-[#D4AF37] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-[family-name:var(--font-cinzel)]">Back to Cart</span>
          </Link>
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl font-bold text-[#7B1818]">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Customer Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
                1. Customer Details
              </h2>

              {/* Customer Type Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setCustomerType("guest")}
                  className={`flex-1 py-3 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors ${
                    customerType === "guest"
                      ? "bg-[#7B1818] text-[#FAF8F0]"
                      : "border-2 border-[#7B1818]/30 text-[#7B1818] hover:border-[#D4AF37]"
                  }`}
                >
                  Continue as Guest
                </button>
                <button
                  onClick={() => setCustomerType("registered")}
                  className={`flex-1 py-3 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors ${
                    customerType === "registered"
                      ? "bg-[#7B1818] text-[#FAF8F0]"
                      : "border-2 border-[#7B1818]/30 text-[#7B1818] hover:border-[#D4AF37]"
                  }`}
                >
                  Sign In
                </button>
              </div>

              {customerType === "registered" ? (
                <div className="text-center py-8 border-2 border-dashed border-[#7B1818]/20 rounded">
                  <p className="text-[#7B1818]/60 mb-4 font-[family-name:var(--font-cormorant)] text-lg">
                    Sign in to save your details and track orders
                  </p>
                  <button className="bg-[#D4AF37] hover:bg-[#C5A028] text-[#7B1818] px-6 py-2 rounded font-[family-name:var(--font-cinzel)] transition-colors">
                    Sign In / Sign Up
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                      placeholder="Ahmed Khan"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                        placeholder="03001234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                        placeholder="ahmed@email.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
                2. Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                    rows={3}
                    placeholder="House#, Street, Area, Landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                    Area / Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.area}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                  >
                    <option value="">Select your area</option>
                    {allAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {formData.area && deliveryCharges > 0 && (
                    <p className="mt-2 text-sm text-[#D4AF37] font-[family-name:var(--font-cormorant)]">
                      Delivery: Rs. {deliveryCharges} • Est. 30-45 mins
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-[#7B1818] mb-1">
                    Location Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.locationLink}
                    onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })}
                    className="w-full px-4 py-3 border border-[#7B1818]/30 rounded focus:outline-none focus:border-[#D4AF37] bg-white"
                    placeholder="Paste Google Maps link"
                  />
                  <p className="mt-1 text-xs text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                    Share your Google Maps location for accurate delivery
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-4 p-4 border-2 border-[#7B1818]/20 rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-cinzel)] font-semibold text-[#7B1818]">
                      Cash on Delivery
                    </p>
                    <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-[#7B1818]/20 rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="jazzcash"
                    checked={paymentMethod === "jazzcash"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-cinzel)] font-semibold text-[#7B1818]">
                      JazzCash
                    </p>
                    <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                      Pay securely via JazzCash
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 border-2 border-[#7B1818]/20 rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="easypaisa"
                    checked={paymentMethod === "easypaisa"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-cinzel)] font-semibold text-[#7B1818]">
                      EasyPaisa
                    </p>
                    <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                      Pay securely via EasyPaisa
                    </p>
                  </div>
                </label>
              </div>

              <label className="flex items-center gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappNotif}
                  onChange={(e) => setWhatsappNotif(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm text-[#7B1818] font-[family-name:var(--font-cormorant)]">
                  Send order updates via WhatsApp
                </span>
              </label>
            </div>
          </div>

          {/* Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                      {item.menuItem.image ? (
                        <Image src={item.menuItem.image} alt={item.menuItem.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#7B1818]/10 flex items-center justify-center">
                          <span className="text-[#D4AF37]">&#9830;</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-cinzel)] text-sm text-[#7B1818]">
                        {item.menuItem.name}
                      </p>
                      <p className="text-xs text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                        {item.selectedWeight.weight} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#7B1818]/20 pt-4 space-y-2 mb-6">
                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
                  <span className="text-[#7B1818]/60">Subtotal:</span>
                  <span className="text-[#7B1818]">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
                  <span className="text-[#7B1818]/60">Delivery:</span>
                  <span className="text-[#7B1818]">Rs. {deliveryCharges}</span>
                </div>
                <div className="border-t border-[#7B1818]/20 pt-2">
                  <div className="flex justify-between font-[family-name:var(--font-cinzel)] text-2xl font-bold">
                    <span className="text-[#7B1818]">Total:</span>
                    <span className="text-[#D4AF37]">Rs. {total}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-[#7B1818] hover:bg-[#5A1010] text-[#FAF8F0] py-4 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : `Place Order - Rs. ${total}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
