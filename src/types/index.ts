"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockMenuItems } from "@/lib/mockData";
import type { MenuItem, Banner } from "@/types";

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "Breakfast",
    "Biryani & Rice",
    "Curries/Gravy",
    "Tandoori & BBQ",
    "Snacks & Burgers",
    "Drinks & Desserts"
  ];

  useEffect(() => {
    loadBanners();
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const loadBanners = () => {
    const stored = localStorage.getItem('darbar_banners');
    if (stored) {
      const allBanners: Banner[] = JSON.parse(stored);
      setBanners(allBanners.filter(b => b.isActive).sort((a, b) => a.priority - b.priority));
    }
  };

  const loadMenuItems = () => {
    let allItems = [...mockMenuItems];
    const stored = localStorage.getItem('darbar_menu');
    if (stored) {
      const adminItems = JSON.parse(stored);
      const newItems = adminItems.filter(
        (adminItem: MenuItem) =>!mockMenuItems.find(item => item.id === adminItem.id)
      );
      allItems = [...allItems,...newItems];
    }
    setMenuItems(allItems.filter(item => item.isAvailable));
  };

  const filteredItems = selectedCategory === "all"
   ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F0]">
      {/* Banner Slider */}
      {banners.length > 0 && (
        <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 md:p-12 text-white max-w-3xl">
                  <h2 className="text-3xl md:text-6xl font-bold mb-3 font-[family-name:var(--font-cinzel)] drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-2xl mb-6 drop-shadow-md">{banner.description}</p>
                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="bg-[#D4AF37] text-[#7B1818] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#C4A030] inline-block shadow-xl"
                    >
                      Order Now →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === currentSlide? 'bg-white w-10' : 'bg-white/50 w-3'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B1818] to-[#5A1010] text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-cinzel)]">
            Darbar Restaurant
          </h1>
          <p className="text-yellow-300 mt-2">Royal Mughlai Cuisine</p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                 ? 'bg-[#7B1818] text-white shadow-lg scale-105'
                  : 'bg-white text-[#7B1818] border-2 border-[#7B1818] hover:bg-[#7B1818] hover:text-white'
              }`}
            >
              {cat === "all"? "All Items" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredItems.length === 0? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-xl">No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#7B1818] mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  <div className="space-y-2 mb-4">
                    {item.weightOptions.map((opt, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{opt.weight}</span>
                        <span className="text-2xl font-bold text-[#7B1818]">Rs. {opt.price}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-[#7B1818] text-white py-3 rounded-lg font-bold hover:bg-[#5A1010] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}