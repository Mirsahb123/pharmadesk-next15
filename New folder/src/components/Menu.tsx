"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { mockMenuItems } from "@/lib/mockData";
import type { MenuItem, WeightOption } from "@/types";

// Main menu categories
const mainCategories = [
  "Breakfast",
  "Biryani & Rice",
  "Curries/Gravy",
  "Tandoori & BBQ",
  "Snacks & Burgers",
  "Drinks & Desserts",
];

// Component for cycling through multiple images with directional animations
const CyclingImages = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('left');

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through directions: left, right, top, bottom
      const directions = ['left', 'right', 'top', 'bottom'];
      const nextDirection = directions[Math.floor(Math.random() * directions.length)];
      setDirection(nextDirection);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Get animation classes based on direction
  const getAnimationClass = (idx: number, isActive: boolean) => {
    if (!isActive) return 'opacity-0 scale-75';

    switch (direction) {
      case 'left':
        return 'animate-slide-in-left';
      case 'right':
        return 'animate-slide-in-right';
      case 'top':
        return 'animate-slide-in-top';
      case 'bottom':
        return 'animate-slide-in-bottom';
      default:
        return '';
    }
  };

  return (
    <>
      {images.map((img, idx) => (
        <div
          key={img}
          className={`absolute inset-0 transition-all duration-700 ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${getAnimationClass(idx, idx === currentIndex)}`}
        >
          <Image
            src={img}
            alt="Drink"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </>
  );
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const { addItem } = useCartStore();

  // Get current items based on category
  const getCurrentItems = () => {
    return mockMenuItems.filter((item) => item.category === activeCategory);
  };

  const handleWeightChange = (itemId: string, weightIndex: number) => {
    setSelectedWeights((prev) => ({ ...prev, [itemId]: weightIndex }));
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleAddToCart = (item: MenuItem) => {
    const weightIndex = selectedWeights[item.id] || 0;
    const quantity = quantities[item.id] || 1;
    const selectedWeight = item.weightOptions[weightIndex];

    addItem({
      menuItem: item,
      selectedWeight,
      quantity,
    });

    // Show success feedback
    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Dark Marble Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)`
        }} />
      </div>

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#D4AF37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            Royal Menu
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl animate-pulse">&#9830;</span>
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </div>
        </div>

        {/* Main Category Filter Nav */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 mb-8 shadow-2xl border border-[#D4AF37]/20">
          <div className="flex flex-wrap justify-center gap-2">
            {mainCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 font-[family-name:var(--font-cinzel)] text-sm tracking-wider transition-all duration-300 rounded-lg ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-semibold shadow-lg shadow-[#D4AF37]/50"
                    : "text-gray-300 hover:bg-white/10 border border-transparent hover:border-[#D4AF37]/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#D4AF37] tracking-wide">
            {activeCategory}
          </h3>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getCurrentItems().map((item, index) => (
            <div
              key={item.name}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)] transition-all duration-500 border border-gray-800/50 hover:border-[#D4AF37]/50"
            >
              {/* Premium Gold Glow Effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-[-2px] bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-[#D4AF37] blur-md -z-10" />
              </div>

              {/* Image */}
              <div className="relative h-72 bg-black/40 overflow-hidden">
                {item.images ? (
                  <>
                    <CyclingImages images={item.images} />
                    {/* Ice Crystals for Cold Items with multiple images */}
                    {item.temp === 'cold' && (
                      <>
                        {/* Animated Ice Crystals - Multiple Layers */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {/* Snowflake Layer 1 */}
                          <div className="absolute top-0 left-[5%] w-3 h-3 text-cyan-300 animate-ice-crystal-1 opacity-70">❄</div>
                          <div className="absolute top-0 left-[15%] w-2.5 h-2.5 text-blue-200 animate-ice-crystal-2 opacity-60">❄</div>
                          <div className="absolute top-0 left-[25%] w-3 h-3 text-cyan-200 animate-ice-crystal-3 opacity-80">❄</div>
                          <div className="absolute top-0 left-[35%] w-2.5 h-2.5 text-blue-300 animate-ice-crystal-1 opacity-65" style={{animationDelay: '0.5s'}}>❄</div>
                          <div className="absolute top-0 left-[45%] w-3 h-3 text-cyan-400 animate-ice-crystal-2 opacity-75" style={{animationDelay: '1s'}}>❄</div>
                          <div className="absolute top-0 left-[55%] w-2.5 h-2.5 text-blue-200 animate-ice-crystal-3 opacity-70" style={{animationDelay: '1.5s'}}>❄</div>
                          <div className="absolute top-0 left-[65%] w-3 h-3 text-cyan-300 animate-ice-crystal-1 opacity-80" style={{animationDelay: '2s'}}>❄</div>
                          <div className="absolute top-0 left-[75%] w-2.5 h-2.5 text-blue-300 animate-ice-crystal-2 opacity-60" style={{animationDelay: '2.5s'}}>❄</div>
                          <div className="absolute top-0 left-[85%] w-3 h-3 text-cyan-200 animate-ice-crystal-3 opacity-75" style={{animationDelay: '3s'}}>❄</div>
                          <div className="absolute top-0 left-[95%] w-2.5 h-2.5 text-blue-400 animate-ice-crystal-1 opacity-65" style={{animationDelay: '3.5s'}}>❄</div>

                          {/* Snowflake Layer 2 - Different Speeds */}
                          <div className="absolute top-0 left-[10%] w-2 h-2 text-cyan-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '0.3s'}}>❄</div>
                          <div className="absolute top-0 left-[20%] w-2 h-2 text-blue-300 animate-ice-crystal-3 opacity-55" style={{animationDelay: '0.8s'}}>❄</div>
                          <div className="absolute top-0 left-[30%] w-2 h-2 text-cyan-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '1.3s'}}>❄</div>
                          <div className="absolute top-0 left-[40%] w-2 h-2 text-blue-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '1.8s'}}>❄</div>
                          <div className="absolute top-0 left-[50%] w-2 h-2 text-cyan-400 animate-ice-crystal-3 opacity-55" style={{animationDelay: '2.3s'}}>❄</div>
                          <div className="absolute top-0 left-[60%] w-2 h-2 text-blue-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '2.8s'}}>❄</div>
                          <div className="absolute top-0 left-[70%] w-2 h-2 text-cyan-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '3.3s'}}>❄</div>
                          <div className="absolute top-0 left-[80%] w-2 h-2 text-blue-400 animate-ice-crystal-3 opacity-55" style={{animationDelay: '3.8s'}}>❄</div>
                          <div className="absolute top-0 left-[90%] w-2 h-2 text-cyan-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '4.3s'}}>❄</div>
                        </div>
                        {/* Ice Icon */}
                        <div className="absolute top-3 right-3 w-10 h-10 animate-pulse">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                            <path d="M12 2L12 22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19" stroke="#00CED1" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M2 12L22 12M2 12L5 9M2 12L5 15M22 12L19 9M22 12L19 15" stroke="#00CED1" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M5.64 5.64L18.36 18.36M5.64 5.64L7.76 8.64M18.36 18.36L16.24 15.36" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18.36 5.64L5.64 18.36M18.36 5.64L16.24 8.64M5.64 18.36L7.76 15.36" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="12" r="2.5" fill="#E0FFFF" opacity="0.8"/>
                          </svg>
                        </div>
                      </>
                    )}
                  </>
                ) : item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Fire Sparks for Hot Items */}
                    {item.temp === 'hot' && (
                      <>
                        {/* Animated Fire Sparks - Multiple Layers */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {/* Fire Spark Layer 1 */}
                          <div className="absolute bottom-0 left-[10%] w-1 h-1 bg-yellow-400 rounded-full animate-fire-spark-1 shadow-lg shadow-yellow-500/50" />
                          <div className="absolute bottom-0 left-[20%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-fire-spark-2 shadow-lg shadow-orange-500/50" />
                          <div className="absolute bottom-0 left-[30%] w-1 h-1 bg-red-500 rounded-full animate-fire-spark-3 shadow-lg shadow-red-500/50" />
                          <div className="absolute bottom-0 left-[40%] w-1.5 h-1.5 bg-yellow-500 rounded-full animate-fire-spark-4 shadow-lg shadow-yellow-500/50" />
                          <div className="absolute bottom-0 left-[50%] w-1 h-1 bg-orange-400 rounded-full animate-fire-spark-5 shadow-lg shadow-orange-400/50" />
                          <div className="absolute bottom-0 left-[60%] w-1.5 h-1.5 bg-red-400 rounded-full animate-fire-spark-6 shadow-lg shadow-red-400/50" />
                          <div className="absolute bottom-0 left-[70%] w-1 h-1 bg-yellow-500 rounded-full animate-fire-spark-1 shadow-lg shadow-yellow-500/50" style={{animationDelay: '0.3s'}} />
                          <div className="absolute bottom-0 left-[80%] w-1.5 h-1.5 bg-orange-500 rounded-full animate-fire-spark-2 shadow-lg shadow-orange-500/50" style={{animationDelay: '0.5s'}} />
                          <div className="absolute bottom-0 left-[90%] w-1 h-1 bg-red-500 rounded-full animate-fire-spark-3 shadow-lg shadow-red-500/50" style={{animationDelay: '0.7s'}} />

                          {/* Fire Spark Layer 2 - Different Positions */}
                          <div className="absolute bottom-0 left-[15%] w-1 h-1 bg-yellow-300 rounded-full animate-fire-spark-4 shadow-md shadow-yellow-300/50" style={{animationDelay: '0.2s'}} />
                          <div className="absolute bottom-0 left-[35%] w-1.5 h-1.5 bg-orange-400 rounded-full animate-fire-spark-5 shadow-md shadow-orange-400/50" style={{animationDelay: '0.4s'}} />
                          <div className="absolute bottom-0 left-[55%] w-1 h-1 bg-red-400 rounded-full animate-fire-spark-6 shadow-md shadow-red-400/50" style={{animationDelay: '0.6s'}} />
                          <div className="absolute bottom-0 left-[75%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-fire-spark-1 shadow-md shadow-yellow-400/50" style={{animationDelay: '0.8s'}} />
                          <div className="absolute bottom-0 left-[95%] w-1 h-1 bg-orange-500 rounded-full animate-fire-spark-2 shadow-md shadow-orange-500/50" style={{animationDelay: '1s'}} />
                        </div>
                        {/* Fire Icon */}
                        <div className="absolute top-3 right-3 w-10 h-10 animate-pulse">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                            <path d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z" fill="#FF4500" opacity="0.95"/>
                            <path d="M12 14C12 14 10 16 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16 12 14 12 14Z" fill="#FFD700" opacity="0.95"/>
                            <path d="M12 6C12 6 10 8 10 10C10 11.1 10.9 12 12 12C13.1 12 14 11.1 14 10C14 8 12 6 12 6Z" fill="#FFA500" opacity="0.9"/>
                          </svg>
                        </div>
                      </>
                    )}
                    {/* Ice Crystals for Cold Items */}
                    {item.temp === 'cold' && (
                      <>
                        {/* Animated Ice Crystals - Multiple Layers */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {/* Snowflake Layer 1 */}
                          <div className="absolute top-0 left-[5%] w-3 h-3 text-cyan-300 animate-ice-crystal-1 opacity-70">❄</div>
                          <div className="absolute top-0 left-[15%] w-2.5 h-2.5 text-blue-200 animate-ice-crystal-2 opacity-60">❄</div>
                          <div className="absolute top-0 left-[25%] w-3 h-3 text-cyan-200 animate-ice-crystal-3 opacity-80">❄</div>
                          <div className="absolute top-0 left-[35%] w-2.5 h-2.5 text-blue-300 animate-ice-crystal-1 opacity-65" style={{animationDelay: '0.5s'}}>❄</div>
                          <div className="absolute top-0 left-[45%] w-3 h-3 text-cyan-400 animate-ice-crystal-2 opacity-75" style={{animationDelay: '1s'}}>❄</div>
                          <div className="absolute top-0 left-[55%] w-2.5 h-2.5 text-blue-200 animate-ice-crystal-3 opacity-70" style={{animationDelay: '1.5s'}}>❄</div>
                          <div className="absolute top-0 left-[65%] w-3 h-3 text-cyan-300 animate-ice-crystal-1 opacity-80" style={{animationDelay: '2s'}}>❄</div>
                          <div className="absolute top-0 left-[75%] w-2.5 h-2.5 text-blue-300 animate-ice-crystal-2 opacity-60" style={{animationDelay: '2.5s'}}>❄</div>
                          <div className="absolute top-0 left-[85%] w-3 h-3 text-cyan-200 animate-ice-crystal-3 opacity-75" style={{animationDelay: '3s'}}>❄</div>
                          <div className="absolute top-0 left-[95%] w-2.5 h-2.5 text-blue-400 animate-ice-crystal-1 opacity-65" style={{animationDelay: '3.5s'}}>❄</div>

                          {/* Snowflake Layer 2 - Different Speeds */}
                          <div className="absolute top-0 left-[10%] w-2 h-2 text-cyan-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '0.3s'}}>❄</div>
                          <div className="absolute top-0 left-[20%] w-2 h-2 text-blue-300 animate-ice-crystal-3 opacity-55" style={{animationDelay: '0.8s'}}>❄</div>
                          <div className="absolute top-0 left-[30%] w-2 h-2 text-cyan-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '1.3s'}}>❄</div>
                          <div className="absolute top-0 left-[40%] w-2 h-2 text-blue-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '1.8s'}}>❄</div>
                          <div className="absolute top-0 left-[50%] w-2 h-2 text-cyan-400 animate-ice-crystal-3 opacity-55" style={{animationDelay: '2.3s'}}>❄</div>
                          <div className="absolute top-0 left-[60%] w-2 h-2 text-blue-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '2.8s'}}>❄</div>
                          <div className="absolute top-0 left-[70%] w-2 h-2 text-cyan-200 animate-ice-crystal-2 opacity-50" style={{animationDelay: '3.3s'}}>❄</div>
                          <div className="absolute top-0 left-[80%] w-2 h-2 text-blue-400 animate-ice-crystal-3 opacity-55" style={{animationDelay: '3.8s'}}>❄</div>
                          <div className="absolute top-0 left-[90%] w-2 h-2 text-cyan-300 animate-ice-crystal-1 opacity-60" style={{animationDelay: '4.3s'}}>❄</div>
                        </div>
                        {/* Ice Icon */}
                        <div className="absolute top-3 right-3 w-10 h-10 animate-pulse">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                            <path d="M12 2L12 22M12 2L9 5M12 2L15 5M12 22L9 19M12 22L15 19" stroke="#00CED1" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M2 12L22 12M2 12L5 9M2 12L5 15M22 12L19 9M22 12L19 15" stroke="#00CED1" strokeWidth="2.5" strokeLinecap="round"/>
                            <path d="M5.64 5.64L18.36 18.36M5.64 5.64L7.76 8.64M18.36 18.36L16.24 15.36" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18.36 5.64L5.64 18.36M18.36 5.64L16.24 8.64M5.64 18.36L7.76 15.36" stroke="#87CEEB" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="12" cy="12" r="2.5" fill="#E0FFFF" opacity="0.8"/>
                          </svg>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#7B1818] to-[#5A1010]">
                    <div className="text-center">
                      <span className="text-[#D4AF37] text-5xl">&#9830;</span>
                      <p className="text-[#FAF8F0]/60 text-sm mt-2 font-[family-name:var(--font-cormorant)]">
                        Image Coming Soon
                      </p>
                    </div>
                  </div>
                )}
                {/* Image Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#7B1818]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-5 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm relative z-20">
                {/* Title & Rating */}
                <div className="mb-3">
                  <h4 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold transition-colors duration-300 relative ${
                    item.temp === 'hot'
                      ? 'text-orange-400 group-hover:text-orange-300 drop-shadow-[0_0_8px_rgba(255,69,0,0.6)]'
                      : item.temp === 'cold'
                      ? 'text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(0,206,209,0.6)]'
                      : 'text-gray-100 group-hover:text-[#D4AF37]'
                  }`}>
                    {item.name}
                    {/* Fire sparks on title for hot items */}
                    {item.temp === 'hot' && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <span className="absolute -top-1 left-[10%] text-xs animate-fire-spark-1 opacity-70">🔥</span>
                        <span className="absolute -top-2 left-[50%] text-[10px] animate-fire-spark-2 opacity-60">🔥</span>
                        <span className="absolute -top-1 right-[10%] text-xs animate-fire-spark-3 opacity-80">🔥</span>
                      </div>
                    )}
                    {/* Snowflakes on title for cold items */}
                    {item.temp === 'cold' && (
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <span className="absolute -top-1 left-[15%] text-xs text-cyan-300 animate-ice-crystal-1 opacity-70">❄️</span>
                        <span className="absolute -top-2 left-[50%] text-[10px] text-blue-200 animate-ice-crystal-2 opacity-60">❄️</span>
                        <span className="absolute -top-1 right-[15%] text-xs text-cyan-200 animate-ice-crystal-3 opacity-80">❄️</span>
                      </div>
                    )}
                  </h4>
                  {item.averageRating > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex text-[#D4AF37]">
                        {"⭐".repeat(Math.round(item.averageRating))}
                      </div>
                      <span className="text-sm text-gray-400 font-[family-name:var(--font-cormorant)]">
                        ({item.averageRating})
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className={`font-[family-name:var(--font-cormorant)] text-base leading-relaxed mb-4 ${
                  item.temp === 'hot'
                    ? 'text-orange-200/80'
                    : item.temp === 'cold'
                    ? 'text-cyan-200/80'
                    : 'text-gray-300'
                }`}>
                  {item.description}
                </p>

                {/* Weight Selector */}
                <div className="mb-3">
                  <label className="block text-sm font-[family-name:var(--font-cinzel)] text-gray-400 mb-2">
                    Select Size:
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {item.weightOptions.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWeightChange(item.id, idx)}
                        className={`px-4 py-2 rounded-lg border font-[family-name:var(--font-cinzel)] text-sm transition-all duration-300 ${
                          (selectedWeights[item.id] || 0) === idx
                            ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black shadow-lg shadow-[#D4AF37]/50'
                            : 'border-gray-600 text-gray-300 hover:border-[#D4AF37] hover:bg-white/5'
                        }`}
                      >
                        {option.weight}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price with Discount */}
                <div className="mb-4">
                  {item.discount?.isActive ? (
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 line-through font-[family-name:var(--font-cormorant)] text-lg">
                        Rs. {item.weightOptions[selectedWeights[item.id] || 0].price}
                      </span>
                      <span className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                        Rs.{" "}
                        {item.discount.type === "percentage"
                          ? Math.round(item.weightOptions[selectedWeights[item.id] || 0].price * (1 - item.discount.value / 100))
                          : item.weightOptions[selectedWeights[item.id] || 0].price - item.discount.value}
                      </span>
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-full font-[family-name:var(--font-cinzel)] shadow-lg">
                        {item.discount.value}
                        {item.discount.type === "percentage" ? "%" : " Rs"} OFF
                      </span>
                    </div>
                  ) : (
                    <span className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                      Rs. {item.weightOptions[selectedWeights[item.id] || 0].price}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-[family-name:var(--font-cinzel)] text-gray-400">
                    Qty:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition-all"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-[family-name:var(--font-cinzel)] font-semibold text-gray-100">
                      {quantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[#D4AF37] hover:text-black text-gray-300 rounded-lg border border-gray-700 hover:border-[#D4AF37] transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)] tracking-wider transition-all duration-300 ${
                    addedToCart === item.id
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/50'
                      : item.isAvailable
                      ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50'
                      : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700'
                  }`}
                >
                  {addedToCart === item.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </span>
                  ) : item.isAvailable ? (
                    'Add to Cart'
                  ) : (
                    'Out of Stock'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order CTA */}
        <div className="text-center mt-16">
          <a
            href="https://wa.me/923001234567?text=Hello!%20I%20would%20like%20to%20place%20an%20order%20from%20Darbar%20Restaurant."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-sm font-[family-name:var(--font-cinzel)] text-lg tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Menu;
