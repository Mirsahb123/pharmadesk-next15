"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CartItem } from "@/types";

type Order = { 
  id: string; 
  customerName: string; 
  customerPhone: string; 
  items: CartItem[]; 
  subtotal: number; 
  deliveryCharge: number; 
  total: number; 
  status: string; 
  createdAt: string;
  fullAddress: string;
};

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!phone) return alert('Apna WhatsApp Number likhen');
    
    // Number ko saaf karo: +92, 03, spaces sab hata do
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) return alert('Sahi WhatsApp Number likhen');

    setLoading(true);
    const allOrders: Order[] = JSON.parse(localStorage.getItem('darbar_orders') || '[]');
    
    // Is number ke saare orders nikalo
    const customerOrders = allOrders.filter(order => {
      const orderPhone = order.customerPhone.replace(/[^0-9]/g, '');
      return orderPhone === cleanPhone || orderPhone.endsWith(cleanPhone.slice(-10));
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setOrders(customerOrders);
    setSearched(true);
    setLoading(false);
  };

  const handleReorder = (order: Order) => {
    // Purane order ke items cart me daal do
    localStorage.setItem('darbar_cart', JSON.stringify(order.items));
    alert('Items cart me add ho gaye! Checkout page pe ja rahe hain...');
    router.push('/checkout');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-600';
      case 'preparing': return 'bg-blue-600';
      case 'ready': return 'bg-purple-600';
      case 'completed': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D4AF37]">📋 My Orders</h1>
          <Link href="/" className="text-[#D4AF37] hover:text-[#F4C430]">← Back to Menu</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {!searched ? (
          <div className="bg-[#1A1A1A] p-8 rounded-lg border border-[#D4AF37]/20 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Apne Orders Dekhen</h2>
            <p className="text-gray-400 mb-6">Wo WhatsApp Number likhen jo aap ne checkout me diya tha</p>
            <div className="max-w-md mx-auto">
              <input 
                type="tel" 
                placeholder="03XX XXXXXXX" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0F0F0F] text-white p-4 rounded-lg mb-4 border border-[#D4AF37]/30 text-center text-lg"
              />
              <button 
                onClick={handleSearch} 
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#0F0F0F] py-4 rounded-lg font-bold text-lg hover:bg-[#F4C430] disabled:opacity-50"
              >
                {loading ? 'Dhoond rahe hain...' : 'Mere Orders Dikhao'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-400">Results for:</p>
                <p className="text-xl font-bold text-white">{phone}</p>
              </div>
              <button 
                onClick={() => {setSearched(false); setOrders([]); setPhone('')}} 
                className="text-[#D4AF37] hover:text-[#F4C430]"
              >
                Change Number
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#1A1A1A] p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-xl text-gray-400">Is number pe koi order nahi mila</p>
                <Link href="/" className="inline-block mt-4 bg-[#D4AF37] text-[#0F0F0F] px-6 py-3 rounded-lg font-bold">
                  Order Karo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">Total Orders: <span className="text-[#D4AF37] font-bold">{orders.length}</span></p>
                {orders.map(order => (
                  <div key={order.id} className="bg-[#1A1A1A] p-5 rounded-lg border border-[#D4AF37]/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-[#D4AF37] font-bold text-lg">Order #{order.id}</p>
                          <span className={`text-xs px-3 py-1 rounded text-white ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-gray-400 mt-1">📍 {order.fullAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-[#D4AF37]">Rs. {order.total}</p>
                        <p className="text-xs text-gray-400">{order.items.length} items</p>
                      </div>
                    </div>

                    <div className="bg-[#0F0F0F] p-3 rounded mb-4">
                      <p className="text-sm font-bold text-[#D4AF37] mb-2">Items:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{item.menuItem.name} ({item.selectedWeight.weight}) x {item.quantity}</span>
                          <span>Rs. {item.selectedWeight.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleReorder(order)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
                    >
                      🔄 Reorder - Ye Dobara Mangwana Hai
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}