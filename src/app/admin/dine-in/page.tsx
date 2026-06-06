"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type DineInOrder = {
  id: number;
  tableNumber: string;
  orderType: string;
  items: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  time: string;
  date: string;
};

export default function DineInAdminPage() {
  const [orders, setOrders] = useState<DineInOrder[]>([]);

  useEffect(() => {
    loadOrders();
    // Har 2 second me auto refresh - order turant dikhega
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const dineInOrders = JSON.parse(localStorage.getItem('dineInOrders') || '[]');
    setOrders(dineInOrders.reverse()); // Latest order pehle
  };

  const updateStatus = (orderId: number, newStatus: string) => {
    const updated = orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem('dineInOrders', JSON.stringify(updated.reverse()));
  };

  const deleteOrder = (orderId: number) => {
    if (!confirm('Order delete karna hai?')) return;
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('dineInOrders', JSON.stringify(updated.reverse()));
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const preparingOrders = orders.filter(o => o.status === 'Preparing').length;
  const readyOrders = orders.filter(o => o.status === 'Ready').length;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D4AF37]">🪑 Dine-In Orders Admin</h1>
          <Link href="/admin" className="text-[#D4AF37] hover:text-[#F4C430]">← Main Admin</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-yellow-500/20">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{pendingOrders}</p>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-blue-500/20">
            <p className="text-gray-400 text-sm">Preparing</p>
            <p className="text-3xl font-bold text-blue-400">{preparingOrders}</p>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-purple-500/20">
            <p className="text-gray-400 text-sm">Ready</p>
            <p className="text-3xl font-bold text-purple-400">{readyOrders}</p>
          </div>
          <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#D4AF37]/20">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{orders.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0? (
            <div className="bg-[#1A1A1A] p-8 rounded-lg text-center border border-[#D4AF37]/20">
              <p className="text-gray-400 text-lg">Koi Dine-In order nahi hai</p>
              <p className="text-gray-500 text-sm mt-2">Customer order karega to yahan show hoga</p>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="bg-[#1A1A1A] p-6 rounded-lg border border-[#D4AF37]/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[#D4AF37] font-bold text-xl">Order #{order.id}</p>
                    <span className={`text-xs px-3 py-1 rounded font-bold ${
                      order.status === 'Pending'? 'bg-yellow-600' : 
                      order.status === 'Preparing'? 'bg-blue-600' : 
                      order.status === 'Ready'? 'bg-purple-600' : 
                      'bg-green-600'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-xs px-3 py-1 rounded bg-[#D4AF37] text-black font-bold">
                      🪑 TABLE {order.tableNumber}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{order.date} - {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#D4AF37]">Rs. {order.total.toFixed(0)}</p>
                </div>
              </div>

              <div className="bg-[#0F0F0F] p-4 rounded mb-4">
                <p className="text-[#D4AF37] font-bold text-sm mb-3">🛒 ORDER ITEMS:</p>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-300 mb-2 pb-2 border-b border-gray-800 last:border-0">
                    <span>{item.name} ({item.weight}) x {item.qty}</span>
                    <span className="text-[#D4AF37] font-bold">Rs. {item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                <div className="bg-[#0F0F0F] p-2 rounded text-center">
                  <p className="text-gray-400">Subtotal</p>
                  <p className="text-white font-bold">Rs. {order.subtotal.toFixed(0)}</p>
                </div>
                <div className="bg-[#0F0F0F] p-2 rounded text-center">
                  <p className="text-gray-400">GST 13%</p>
                  <p className="text-white font-bold">Rs. {order.tax.toFixed(0)}</p>
                </div>
                <div className="bg-[#0F0F0F] p-2 rounded text-center">
                  <p className="text-gray-400">Total</p>
                  <p className="text-[#D4AF37] font-bold">Rs. {order.total.toFixed(0)}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {order.status === 'Pending' && (
                  <button onClick={() => updateStatus(order.id, 'Preparing')} className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold">
                    ✅ Accept & Prepare
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button onClick={() => updateStatus(order.id, 'Ready')} className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-bold">
                    📦 Mark Ready
                  </button>
                )}
                {order.status === 'Ready' && (
                  <button onClick={() => updateStatus(order.id, 'Completed')} className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold">
                    ✓ Complete Order
                  </button>
                )}
                <button onClick={() => deleteOrder(order.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold">
                  ✕ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}