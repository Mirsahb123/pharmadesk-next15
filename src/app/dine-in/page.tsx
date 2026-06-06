"use client";

import { useState } from "react";
import Image from "next/image";
import { mockMenuItems } from "@/lib/mockData";
import type { MenuItem } from "@/types";

const mainCategories = [
  "Breakfast",
  "Biryani & Rice",
  "Curries/Gravy",
  "Tandoori & BBQ",
  "Snacks & Burgers",
  "Drinks & Desserts",
];

const DineInPage = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const tables = [1,2,3,4,5,6,7,8,9,10,11,12];

  const getCurrentItems = () => {
    return mockMenuItems.filter((item) => item.category === activeCategory);
  };

  const handleWeightChange = (itemId: string, weightIndex: number) => {
    setSelectedWeights((prev) => ({...prev, [itemId]: weightIndex }));
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const newQty = Math.max(1, current + delta);
      return {...prev, [itemId]: newQty };
    });
  };

  const addToCart = (item: MenuItem) => {
    const weightIndex = selectedWeights[item.id] || 0;
    const quantity = quantities[item.id] || 1;
    const selectedWeight = item.weightOptions[weightIndex];

    const cartItem = {
      id: `${item.id}-${weightIndex}`,
      menuItem: item,
      name: item.name,
      price: selectedWeight.price,
      weight: selectedWeight.weight,
      qty: quantity,
      image: item.image || item.images?.[0],
    };

    const existing = cart.find(c => c.id === cartItem.id);
    if (existing) {
      setCart(cart.map(c => c.id === cartItem.id? {...c, qty: c.qty + quantity} : c));
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id!== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty === 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(c => c.id === id? {...c, qty} : c));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = total * 0.13;
  const grandTotal = total + tax;

  const placeOrder = () => {
    if (!selectedTable) {
      alert("Table number select karo pehle");
      return;
    }
    if (cart.length === 0) {
      alert("Cart empty hai");
      return;
    }

    const order = {
      id: Date.now(),
      tableNumber: selectedTable,
      orderType: "Dine In",
      items: cart,
      subtotal: total,
      tax: tax,
      total: grandTotal,
      status: "Pending",
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('dineInOrders') || '[]');
    const updated = [...existingOrders, order];
    localStorage.setItem('dineInOrders', JSON.stringify(updated));

    console.log('✅ Order Saved:', order);
    console.log('✅ All Orders in localStorage:', JSON.parse(localStorage.getItem('dineInOrders')));

    setLastOrder(order);
    setOrderPlaced(true);
    setCart([]);
    alert('Order placed successfully! Check admin panel.');
  };

  const newOrder = () => {
    setOrderPlaced(false);
    setSelectedTable("");
    setLastOrder(null);
  };

  if (orderPlaced && lastOrder) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 px-4">
        <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-xl border border-[#D4AF37]/30">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">Order Placed!</h2>
            <p className="text-gray-400">Order #{lastOrder.id}</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <div className="flex justify-between mb-4 pb-4 border-b border-[#D4AF37]/20">
              <span className="text-gray-400">Table Number:</span>
              <span className="text-[#D4AF37] text-xl font-bold">Table {lastOrder.tableNumber}</span>
            </div>

            <h3 className="text-white font-bold mb-3">Items:</h3>
            {lastOrder.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-gray-300 mb-2">
                <span>{item.name} ({item.weight}) x{item.qty}</span>
                <span>Rs {item.price * item.qty}</span>
              </div>
            ))}

            <div className="border-t border-[#D4AF37]/20 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>Rs {lastOrder.subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST 13%:</span>
                <span>Rs {lastOrder.tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[#D4AF37] text-2xl font-bold">
                <span>Total Bill:</span>
                <span>Rs {lastOrder.total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-bold"
            >
              Print Bill
            </button>
            <button
              onClick={newOrder}
              className="flex-1 bg-[#D4AF37] text-black py-3 rounded-lg font-bold"
            >
              New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="dine-in" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)`
        }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-cinzel)] text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#D4AF37] mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            Dine In Order
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-2xl animate-pulse">&#9830;</span>
            <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8 shadow-2xl border border-[#D4AF37]/20">
          <label className="text-[#D4AF37] text-lg mb-3 block font-[family-name:var(--font-cinzel)] font-bold">Select Table Number:</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {tables.map(num => (
              <button
                key={num}
                onClick={() => setSelectedTable(num.toString())}
                className={`p-4 rounded-lg font-bold transition-all ${
                  selectedTable === num.toString()
                  ? "bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-semibold shadow-lg shadow-[#D4AF37]/50"
                    : "bg-slate-800 text-white hover:bg-slate-700 border border-transparent hover:border-[#D4AF37]/30"
                }`}
              >
                Table {num}
              </button>
            ))}
          </div>
        </div>

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

        <div className="text-center mb-8">
          <h3 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#D4AF37] tracking-wide">
            {activeCategory}
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {getCurrentItems().map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(212,175,55,0.3)] transition-all duration-500 border border-gray-800/50 hover:border-[#D4AF37]/50"
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-[-2px] bg-gradient-to-r from-[#D4AF37] via-yellow-500 to-[#D4AF37] blur-md -z-10" />
                  </div>

                  <div className="relative h-72 bg-black/40 overflow-hidden">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7B1818]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm relative z-20">
                    <div className="mb-3">
                      <h4 className={`font-[family-name:var(--font-cinzel)] text-xl font-semibold transition-colors duration-300 relative ${
                        item.temp === 'hot'
                       ? 'text-orange-400 group-hover:text-orange-300 drop-shadow-[0_0_8px_rgba(255,69,0,0.6)]'
                          : item.temp === 'cold'
                       ? 'text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(0,206,209,0.6)]'
                          : 'text-gray-100 group-hover:text-[#D4AF37]'
                      }`}>
                        {item.name}
                      </h4>
                    </div>

                    <p className={`font-[family-name:var(--font-cormorant)] text-base leading-relaxed mb-4 ${
                      item.temp === 'hot'
                     ? 'text-orange-200/80'
                        : item.temp === 'cold'
                     ? 'text-cyan-200/80'
                        : 'text-gray-300'
                    }`}>
                      {item.description}
                    </p>

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

                    <div className="mb-4">
                      <span className="font-[family-name:var(--font-cinzel)] text-2xl font-bold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                        Rs. {item.weightOptions[selectedWeights[item.id] || 0].price}
                      </span>
                    </div>

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

                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      className={`w-full py-3 rounded-lg font-[family-name:var(--font-cinzel)] tracking-wider transition-all duration-300 ${
                        item.isAvailable
                       ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50'
                          : 'bg-gray-800/50 text-gray-600 cursor-not-allowed border border-gray-700'
                      }`}
                    >
                      {item.isAvailable? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-[#D4AF37]/20 h-fit sticky top-24 shadow-2xl">
            <h2 className="font-[family-name:var(--font-cinzel)] text-2xl text-[#D4AF37] mb-4 font-bold">Current Bill</h2>
            {selectedTable && (
              <div className="mb-4 bg-[#D4AF37]/20 p-3 rounded-lg text-center border border-[#D4AF37]/30">
                <span className="text-[#D4AF37] font-bold">Table {selectedTable}</span>
              </div>
            )}

            {cart.length === 0? (
              <p className="text-gray-400 text-center py-8">No items added</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-800 p-3 rounded border border-gray-700">
                      <div className="flex justify-between text-white mb-2">
                        <span className="font-bold text-sm">{item.name}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-xs hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{item.weight}</div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="bg-slate-700 w-7 h-7 rounded text-white hover:bg-[#D4AF37] hover:text-black"
                          >
                            -
                          </button>
                          <span className="text-white w-8 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="bg-slate-700 w-7 h-7 rounded text-white hover:bg-[#D4AF37] hover:text-black"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[#D4AF37] font-bold">Rs {item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#D4AF37]/30 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>Rs {total.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>GST 13%:</span>
                    <span>Rs {tax.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-[#D4AF37] text-2xl font-bold">
                    <span>Total:</span>
                    <span>Rs {grandTotal.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!selectedTable}
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black w-full py-4 rounded-lg font-bold mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg shadow-[#D4AF37]/30"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DineInPage;