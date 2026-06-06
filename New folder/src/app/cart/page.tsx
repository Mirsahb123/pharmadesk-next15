"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const CartPage = () => {
  const { items, removeItem, updateQuantity, updateInstructions, subtotal, deliveryCharges, total, clearCart } = useCartStore();
  const [editingInstructions, setEditingInstructions] = useState<string | null>(null);
  const [instructionsText, setInstructionsText] = useState("");

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-[#FAF8F0]">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <svg
              className="w-32 h-32 mx-auto text-[#7B1818]/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-cinzel)] text-3xl font-bold text-[#7B1818] mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-[#7B1818]/60 mb-8 font-[family-name:var(--font-cormorant)] text-lg">
            Add some delicious items from our royal menu!
          </p>
          <Link
            href="/#menu"
            className="inline-block bg-[#7B1818] hover:bg-[#5A1010] text-[#FAF8F0] px-8 py-3 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleEditInstructions = (menuItemId: string, weight: string, currentInstructions?: string) => {
    setEditingInstructions(`${menuItemId}-${weight}`);
    setInstructionsText(currentInstructions || "");
  };

  const handleSaveInstructions = (menuItemId: string, weight: string) => {
    updateInstructions(menuItemId, weight, instructionsText);
    setEditingInstructions(null);
    setInstructionsText("");
  };

  const calculateItemTotal = (pricePerUnit: number, quantity: number, discount?: any) => {
    let price = pricePerUnit;
    if (discount?.isActive) {
      if (discount.type === "percentage") {
        price = price - (price * discount.value) / 100;
      } else {
        price = price - discount.value;
      }
    }
    return price * quantity;
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FAF8F0]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-cinzel)] text-4xl font-bold text-[#7B1818]">
            Your Cart ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemKey = `${item.menuItem.id}-${item.selectedWeight.weight}`;
              const itemTotal = calculateItemTotal(
                item.selectedWeight.price,
                item.quantity,
                item.menuItem.discount
              );

              return (
                <div
                  key={itemKey}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
                      {item.menuItem.image ? (
                        <Image
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#7B1818]/10 flex items-center justify-center">
                          <span className="text-[#D4AF37] text-4xl">&#9830;</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-[family-name:var(--font-cinzel)] text-xl font-semibold text-[#7B1818]">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cormorant)]">
                            {item.menuItem.category} • {item.selectedWeight.weight}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.menuItem.id, item.selectedWeight.weight)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        {item.menuItem.discount?.isActive ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[#7B1818]/40 line-through font-[family-name:var(--font-cormorant)]">
                              Rs. {item.selectedWeight.price}
                            </span>
                            <span className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#D4AF37]">
                              Rs.{" "}
                              {item.menuItem.discount.type === "percentage"
                                ? item.selectedWeight.price - (item.selectedWeight.price * item.menuItem.discount.value) / 100
                                : item.selectedWeight.price - item.menuItem.discount.value}
                            </span>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-[family-name:var(--font-cinzel)]">
                              {item.menuItem.discount.value}
                              {item.menuItem.discount.type === "percentage" ? "%" : " Rs"} OFF
                            </span>
                          </div>
                        ) : (
                          <span className="font-[family-name:var(--font-cinzel)] text-lg font-bold text-[#D4AF37]">
                            Rs. {item.selectedWeight.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cinzel)]">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.selectedWeight.weight, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#7B1818] text-[#FAF8F0] rounded hover:bg-[#5A1010] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-[family-name:var(--font-cinzel)] font-semibold text-[#7B1818]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.selectedWeight.weight, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#7B1818] text-[#FAF8F0] rounded hover:bg-[#5A1010] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="mb-2">
                        {editingInstructions === itemKey ? (
                          <div>
                            <textarea
                              value={instructionsText}
                              onChange={(e) => setInstructionsText(e.target.value)}
                              placeholder="e.g., Extra raita, mild spicy, no onions"
                              className="w-full px-3 py-2 border border-[#7B1818]/30 rounded text-sm focus:outline-none focus:border-[#D4AF37]"
                              rows={2}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleSaveInstructions(item.menuItem.id, item.selectedWeight.weight)}
                                className="px-4 py-1 bg-[#7B1818] text-[#FAF8F0] rounded text-sm font-[family-name:var(--font-cinzel)] hover:bg-[#5A1010] transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingInstructions(null)}
                                className="px-4 py-1 border border-[#7B1818]/30 text-[#7B1818] rounded text-sm font-[family-name:var(--font-cinzel)] hover:bg-[#7B1818]/5 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {item.specialInstructions ? (
                              <div className="bg-[#D4AF37]/10 px-3 py-2 rounded">
                                <p className="text-sm text-[#7B1818] font-[family-name:var(--font-cormorant)]">
                                  <span className="font-semibold">Note:</span> {item.specialInstructions}
                                </p>
                              </div>
                            ) : null}
                            <button
                              onClick={() => handleEditInstructions(item.menuItem.id, item.selectedWeight.weight, item.specialInstructions)}
                              className="text-sm text-[#D4AF37] hover:text-[#7B1818] font-[family-name:var(--font-cinzel)] mt-2 transition-colors"
                            >
                              {item.specialInstructions ? "Edit" : "+ Add"} Special Instructions
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-[#7B1818]/10">
                        <span className="text-sm text-[#7B1818]/60 font-[family-name:var(--font-cinzel)]">Item Total:</span>
                        <span className="font-[family-name:var(--font-cinzel)] text-xl font-bold text-[#7B1818]">
                          Rs. {itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#7B1818] mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
                  <span className="text-[#7B1818]/60">Subtotal:</span>
                  <span className="text-[#7B1818]">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between font-[family-name:var(--font-cormorant)] text-lg">
                  <span className="text-[#7B1818]/60">Delivery:</span>
                  <span className="text-[#7B1818]">
                    {deliveryCharges === 0 ? "Calculated at checkout" : `Rs. ${deliveryCharges}`}
                  </span>
                </div>
                <div className="border-t border-[#7B1818]/20 pt-3">
                  <div className="flex justify-between font-[family-name:var(--font-cinzel)] text-2xl font-bold">
                    <span className="text-[#7B1818]">Total:</span>
                    <span className="text-[#D4AF37]">Rs. {total}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-[#7B1818] hover:bg-[#5A1010] text-[#FAF8F0] text-center py-4 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors mb-3"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/#menu"
                className="block w-full border-2 border-[#7B1818] text-[#7B1818] hover:bg-[#7B1818]/5 text-center py-3 rounded font-[family-name:var(--font-cinzel)] tracking-wider transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
