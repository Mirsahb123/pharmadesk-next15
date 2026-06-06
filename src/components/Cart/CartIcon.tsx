"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

const CartIcon = () => {
  const { items } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Cart Icon */}
      <Link
        href="/cart"
        className="fixed bottom-6 right-6 z-50 bg-[#D4AF37] hover:bg-[#C5A028] text-[#7B1818] rounded-full p-4 shadow-2xl transform hover:scale-110 transition-all duration-300 group"
      >
        <div className="relative">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>

          {/* Item Count Badge */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#7B1818] text-[#FAF8F0] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {itemCount}
            </span>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-[#7B1818] text-[#FAF8F0] text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-[family-name:var(--font-cinzel)]">
          View Cart ({itemCount} items)
        </div>
      </Link>
    </>
  );
};

export default CartIcon;
