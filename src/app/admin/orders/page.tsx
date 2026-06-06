"use client";
import { useState, useEffect } from "react";

type Order = {
  id: string;
  orderType: 'Online' | 'Dine In';
  customerName?: string;
  customerPhone?: string;
  fullAddress?: string;
  tableNumber?: string;
  items: any[];
  subtotal?: number;
  deliveryCharge?: number;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  paymentScreenshot?: string;
  senderName?: string;
  deliveryArea?: any;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const onlineOrders = JSON.parse(localStorage.getItem('darbar_orders') || '[]');
    const dineInOrders = JSON.parse(localStorage.getItem('dineInOrders') || '[]');

    const combined = [
   ...onlineOrders.map((o: any) => ({
        id: o.id,
        orderType: 'Online' as const,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        fullAddress: o.fullAddress,
        items: o.items || [],
        subtotal: o.subtotal || 0,
        deliveryCharge: o.deliveryCharge || 0,
        total: o.total || 0,
        status: (o.status || 'pending').toLowerCase(),
        createdAt: o.createdAt,
        paymentMethod: o.paymentMethod,
        paymentScreenshot: o.paymentScreenshot,
        senderName: o.senderName,
        deliveryArea: o.deliveryArea
      })),
   ...dineInOrders.map((o: any) => ({
        id: o.id.toString(),
        orderType: 'Dine In' as const,
        tableNumber: o.tableNumber || '0',
        items: (o.items || []).map((item: any) => ({
          menuItem: { name: item.name || 'Item' },
          selectedWeight: { weight: item.weight || 'Regular', price: item.price || 0 },
          quantity: item.qty || item.quantity || 1
        })),
        total: o.total || 0,
        status: (o.status || 'pending').toLowerCase(),
        createdAt: new Date(`${o.date || new Date().toLocaleDateString()} ${o.time || new Date().toLocaleTimeString()}`).toISOString(),
        paymentMethod: 'Cash'
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setOrders(combined);
  };

  const updateStatus = (id: string, status: string, orderType: 'Online' | 'Dine In') => {
    if (orderType === 'Online') {
      const orders = JSON.parse(localStorage.getItem('darbar_orders') || '[]');
      const updated = orders.map((o: any) =>
        o.id === id? {...o, status: status.charAt(0).toUpperCase() + status.slice(1) } : o
      );
      localStorage.setItem('darbar_orders', JSON.stringify(updated));
    } else {
      const dineInOrders = JSON.parse(localStorage.getItem('dineInOrders') || '[]');
      const updated = dineInOrders.map((o: any) =>
        o.id.toString() === id? {
       ...o,
          status: status.charAt(0).toUpperCase() + status.slice(1)
        } : o
      );
      localStorage.setItem('dineInOrders', JSON.stringify(updated));
    }
    loadOrders();
  };

  const deleteOrder = (id: string, orderType: 'Online' | 'Dine In') => {
    if (!confirm('Order delete karna hai?')) return;
    if (orderType === 'Online') {
      const orders = JSON.parse(localStorage.getItem('darbar_orders') || '[]');
      const updated = orders.filter((o: any) => o.id!== id);
      localStorage.setItem('darbar_orders', JSON.stringify(updated));
    } else {
      const dineInOrders = JSON.parse(localStorage.getItem('dineInOrders') || '[]');
      const updated = dineInOrders.filter((o: any) => o.id.toString()!== id);
      localStorage.setItem('dineInOrders', JSON.stringify(updated));
    }
    loadOrders();
  };

  const filteredOrders = orders.filter(o => {
    const statusMatch = filter === "all" || o.status === filter;
    const typeMatch = typeFilter === "all" || o.orderType === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'preparing': return 'from-blue-500 to-cyan-500';
      case 'ready': return 'from-purple-500 to-pink-500';
      case 'delivered':
      case 'completed': return 'from-green-500 to-emerald-500';
      case 'cancelled': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const dineInCount = orders.filter(o => o.orderType === 'Dine In').length;
  const onlineCount = orders.filter(o => o.orderType === 'Online').length;
  const dineInOrders = filteredOrders.filter(o => o.orderType === 'Dine In');
  const onlineOrders = filteredOrders.filter(o => o.orderType === 'Online');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A1A1A] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C430] mb-8">
          Orders Management
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦' },
            { label: 'Pending', value: pendingCount, icon: '⏳' },
            { label: 'Dine In', value: dineInCount, icon: '🪑' },
            { label: 'Online', value: onlineCount, icon: '🛵' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-4xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1A1A]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 mb-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-[#D4AF37] text-xs mb-3 font-bold uppercase">Order Type</p>
              <div className="flex gap-2">
                {['all', 'Online', 'Dine In'].map(f => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
                      typeFilter === f
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-black'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {f === 'all'? 'All' : f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#D4AF37] text-xs mb-3 font-bold uppercase">Status</p>
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm ${
                      filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                        : 'bg-white/5 text-gray-300 border border-white/10'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(typeFilter === 'all' || typeFilter === 'Dine In') && dineInOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
              <span>🪑</span> Dine-In Orders ({dineInOrders.length})
            </h2>
            <div className="space-y-4">
              {dineInOrders.map((order) => (
                <OrderCard
                  key={`dine-${order.id}`}
                  order={order}
                  getStatusColor={getStatusColor}
                  updateStatus={updateStatus}
                  deleteOrder={deleteOrder}
                  setSelectedImage={setSelectedImage}
                />
              ))}
            </div>
          </div>
        )}

        {(typeFilter === 'all' || typeFilter === 'Online') && onlineOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>🛵</span> Online Delivery Orders ({onlineOrders.length})
            </h2>
            <div className="space-y-4">
              {onlineOrders.map((order) => (
                <OrderCard
                  key={`online-${order.id}`}
                  order={order}
                  getStatusColor={getStatusColor}
                  updateStatus={updateStatus}
                  deleteOrder={deleteOrder}
                  setSelectedImage={setSelectedImage}
                />
              ))}
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <div className="bg-[#1A1A1A]/60 backdrop-blur-xl p-16 rounded-2xl text-center border border-white/10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-xl font-bold">Koi order nahi hai</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full">
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white text-3xl hover:text-[#D4AF37]">✕</button>
            <img src={selectedImage} alt="Payment Screenshot" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, getStatusColor, updateStatus, deleteOrder, setSelectedImage }: any) {
  return (
    <div className={`relative bg-[#1A1A1A]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 ${
      order.orderType === 'Dine In'? 'border-l-4 border-l-[#D4AF37]' : 'border-l-4 border-l-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-2xl font-black text-[#D4AF37]">#{order.id.slice(0, 8)}</h3>
            {Date.now() - new Date(order.createdAt).getTime() < 120000 && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold animate-pulse">
                🔥 NEW
              </span>
            )}
            <span className={`text-xs px-4 py-1.5 rounded-full font-bold ${
              order.orderType === 'Dine In'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4C430] text-black'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
            }`}>
              {order.orderType === 'Dine In'? `🪑 TABLE ${order.tableNumber}` : '🛵 ONLINE DELIVERY'}
            </span>
            <span className={`text-xs px-4 py-1.5 rounded-full font-bold bg-gradient-to-r ${getStatusColor(order.status)} text-white`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-400 text-sm">🕒 {new Date(order.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">Total Amount</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C430]">
            Rs. {order.total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5 p-4 bg-black/30 rounded-xl border border-white/5">
        <div>
          <p className="text-xs text-gray-500 mb-1 uppercase">
            {order.orderType === 'Dine In'? 'Table Info' : 'Customer Details'}
          </p>
          {order.orderType === 'Dine In'? (
            <p className="font-bold text-xl text-[#D4AF37]">Table {order.tableNumber}</p>
          ) : (
            <>
              <p className="font-bold text-white text-lg">👤 {order.customerName}</p>
              <p className="text-gray-300 text-sm">📞 {order.customerPhone}</p>
              {order.fullAddress && <p className="text-gray-400 text-sm mt-1">📍 {order.fullAddress}</p>}
              {order.deliveryArea && (
                <p className="text-gray-500 text-xs mt-1">
                  {order.deliveryArea.area}, {order.deliveryArea.village}, {order.deliveryArea.city} ({order.deliveryArea.km} KM)
                </p>
              )}
            </>
          )}
        </div>
        {order.orderType === 'Online' && (
          <div>
            <p className="text-xs text-gray-500 mb-1 uppercase">Payment Info</p>
            <p className="font-bold text-white">💳 {order.paymentMethod?.toUpperCase()}</p>
            {order.senderName && <p className="text-gray-300 text-sm">👤 Sender: {order.senderName}</p>}
            {order.deliveryCharge > 0 && (
              <p className="text-[#D4AF37] text-sm mt-1 font-bold">Delivery: Rs. {order.deliveryCharge}</p>
            )}
            {order.paymentScreenshot && (
              <button
                onClick={() => setSelectedImage(order.paymentScreenshot)}
                className="mt-2 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
              >
                📷 View Screenshot
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-5">
        <p className="font-bold mb-3 text-[#D4AF37] flex items-center gap-2">
          <span>🛒</span> Order Items ({order.items.length})
        </p>
        <div className="space-y-2">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="flex-1">
                <p className="font-bold text-white">{item.menuItem?.name || item.name}</p>
                <p className="text-xs text-gray-400">{item.selectedWeight?.weight || item.weight} × {item.quantity || item.qty}</p>
              </div>
              <p className="font-black text-[#D4AF37] text-lg">
                Rs. {((item.selectedWeight?.price || item.price) * (item.quantity || item.qty)).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {order.subtotal > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal}</span>
            </div>
            {order.deliveryCharge > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>Delivery:</span>
                <span>Rs. {order.deliveryCharge}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {order.status === 'pending' && (
          <>
            <button onClick={() => updateStatus(order.id, 'preparing', order.orderType)}
              className="flex-1 min-w-[150px] bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-3 rounded-xl font-bold">
              ✅ Accept & Prepare
            </button>
            <button onClick={() => updateStatus(order.id, 'cancelled', order.orderType)}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-5 py-3 rounded-xl font-bold">
              Cancel
            </button>
          </>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => updateStatus(order.id, 'ready', order.orderType)}
            className="flex-1 min-w-[150px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-3 rounded-xl font-bold">
            📦 Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button onClick={() => updateStatus(order.id, 'completed', order.orderType)}
            className="flex-1 min-w-[150px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-3 rounded-xl font-bold">
            ✓ Complete Order
          </button>
        )}
        <button onClick={() => deleteOrder(order.id, order.orderType)}
          className="bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-3 rounded-xl font-bold border border-white/10">
          ✕ Delete
        </button>
      </div>
    </div>
  );
}