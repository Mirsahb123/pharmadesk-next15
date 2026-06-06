"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MenuItem } from "@/types";

type CartItem = {
  id: string;
  menuItem: MenuItem;
  selectedWeight: { weight: string; price: number };
  quantity: number;
};

type DeliveryArea = { id: string; city: string; village: string; area: string; subArea?: string; km: number };

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [kmRate, setKmRate] = useState(30);
  const [minCharge, setMinCharge] = useState(100);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [senderName, setSenderName] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");

  const restaurantAccounts = {
    jazzcash: { name: "Darbar Foods", number: "03001234567" },
    easypaisa: { name: "Darbar Foods", number: "03111234567" },
    bank: { name: "Darbar Foods", bank: "HBL", account: "12345678901234", iban: "PK36HABB0012345678901234" }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('darbar_cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
    
    const storedAreas = localStorage.getItem('darbar_delivery_areas');
    if (storedAreas) setDeliveryAreas(JSON.parse(storedAreas));
    
    setKmRate(parseInt(localStorage.getItem('darbar_km_rate') || '30'));
    setMinCharge(parseInt(localStorage.getItem('darbar_min_charge') || '100'));
  }, []);

  const updateQty = (id: string, change: number) => {
    const updated = cartItems.map(item => 
      item.id === id? {...item, quantity: Math.max(1, item.quantity + change)} : item
    );
    setCartItems(updated);
    localStorage.setItem('darbar_cart', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id!== id);
    setCartItems(updated);
    localStorage.setItem('darbar_cart', JSON.stringify(updated));
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied: ' + text);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.selectedWeight.price * item.quantity), 0);
  
  const cities = [...new Set(deliveryAreas.map(a => a.city))];
  const villages = [...new Set(deliveryAreas.filter(a => a.city === selectedCity).map(a => a.village))];
  const areas = [...new Set(deliveryAreas.filter(a => a.city === selectedCity && a.village === selectedVillage).map(a => a.area))];
  const subAreas = deliveryAreas.filter(a => a.city === selectedCity && a.village === selectedVillage && a.area === selectedArea).map(a => a.subArea).filter(Boolean);
  
  const selectedAreaData = deliveryAreas.find(a => 
    a.city === selectedCity && 
    a.village === selectedVillage && 
    a.area === selectedArea && 
    (a.subArea || "") === selectedSubArea
  );

  const deliveryCharge = selectedAreaData? Math.max(minCharge, selectedAreaData.km * kmRate) : 0;
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = () => {
    if (!customerName ||!customerPhone ||!selectedAreaData ||!fullAddress) {
      return alert('Please fill all delivery details');
    }
    if (!paymentMethod) return alert('Please select payment method');
    if (!senderName) return alert('Please enter sender account name');
    if (!paymentScreenshot) return alert('Please upload payment screenshot');
    
    const order = {
      id: Date.now().toString(),
      customerName,
      customerPhone,
      items: cartItems,
      subtotal,
      deliveryCharge,
      total,
      deliveryArea: selectedAreaData,
      fullAddress,
      paymentMethod,
      senderName,
      paymentScreenshot,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('darbar_orders') || '[]');
    orders.push(order);
    localStorage.setItem('darbar_orders', JSON.stringify(orders));
    localStorage.removeItem('darbar_cart');
    alert('Order Placed! Order ID: ' + order.id);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#D4AF37]">🛒 Checkout</h1>
          <Link href="/" className="text-[#D4AF37]">← Back</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">Your Items</h2>
            {cartItems.length === 0? (
              <div className="bg-[#1A1A1A] p-8 rounded-lg text-center">
                <p className="text-gray-400">Cart is empty</p>
                <Link href="/#menu" className="text-[#D4AF37] mt-4 inline-block">Order Now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-[#1A1A1A] p-4 rounded-lg flex gap-4">
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{item.menuItem.name}</h3>
                      <p className="text-gray-400 text-sm">{item.selectedWeight.weight} - Rs. {item.selectedWeight.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(item.id, -1)} className="bg-[#0F0F0F] px-3 py-1 rounded">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="bg-[#0F0F0F] px-3 py-1 rounded">+</button>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 ml-auto text-sm">Remove</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#D4AF37] font-bold">Rs. {item.selectedWeight.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-4">📍 Delivery Details</h2>
            <input type="text" placeholder="Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30" />
            <input type="text" placeholder="Phone *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30" />
            
            <select value={selectedCity} onChange={(e) => {setSelectedCity(e.target.value); setSelectedVillage(""); setSelectedArea(""); setSelectedSubArea("");}} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30">
              <option value="">Select City *</option>
              {cities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>

            {selectedCity && (
              <select value={selectedVillage} onChange={(e) => {setSelectedVillage(e.target.value); setSelectedArea(""); setSelectedSubArea("");}} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30">
                <option value="">Select Village/Town *</option>
                {villages.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            )}

            {selectedVillage && (
              <select value={selectedArea} onChange={(e) => {setSelectedArea(e.target.value); setSelectedSubArea("");}} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30">
                <option value="">Select Area *</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}

            {selectedArea && subAreas.length > 0 && (
              <select value={selectedSubArea} onChange={(e) => setSelectedSubArea(e.target.value)} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30">
                <option value="">Select Sub-Area</option>
                {subAreas.map(sa => <option key={sa} value={sa}>{sa}</option>)}
              </select>
            )}

            <textarea placeholder="Full Address *" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30 h-20" />

            {selectedAreaData && (
              <div className="bg-green-900/20 border border-green-500/30 p-3 rounded text-sm">
                <p className="text-green-400">Distance: {selectedAreaData.km} KM</p>
                <p className="text-green-400">Delivery: Rs. {deliveryCharge}</p>
              </div>
            )}
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-lg">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-4">💳 Payment Method</h2>
            
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 bg-[#0F0F0F] p-3 rounded cursor-pointer border border-[#D4AF37]/30">
                <input type="radio" name="payment" value="jazzcash" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>JazzCash</span>
              </label>
              <label className="flex items-center gap-3 bg-[#0F0F0F] p-3 rounded cursor-pointer border border-[#D4AF37]/30">
                <input type="radio" name="payment" value="easypaisa" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>EasyPaisa</span>
              </label>
              <label className="flex items-center gap-3 bg-[#0F0F0F] p-3 rounded cursor-pointer border border-[#D4AF37]/30">
                <input type="radio" name="payment" value="bank" onChange={(e) => setPaymentMethod(e.target.value)} />
                <span>Bank Transfer</span>
              </label>
            </div>

            {paymentMethod && (
              <div className="bg-[#0F0F0F] p-4 rounded-lg mb-4 border border-[#D4AF37]/30">
                <h3 className="text-[#D4AF37] font-bold mb-3">Send Payment To:</h3>
                {paymentMethod === 'jazzcash' && (
                  <div>
                    <p className="text-sm text-gray-400">Account Name:</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold">{restaurantAccounts.jazzcash.name}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.jazzcash.name)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-400">JazzCash Number:</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{restaurantAccounts.jazzcash.number}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.jazzcash.number)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                  </div>
                )}
                {paymentMethod === 'easypaisa' && (
                  <div>
                    <p className="text-sm text-gray-400">Account Name:</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold">{restaurantAccounts.easypaisa.name}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.easypaisa.name)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-400">EasyPaisa Number:</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold">{restaurantAccounts.easypaisa.number}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.easypaisa.number)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                  </div>
                )}
                {paymentMethod === 'bank' && (
                  <div>
                    <p className="text-sm text-gray-400">Bank:</p>
                    <p className="font-bold mb-2">{restaurantAccounts.bank.bank}</p>
                    <p className="text-sm text-gray-400">Account Title:</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold">{restaurantAccounts.bank.name}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.bank.name)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-400">Account Number:</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold">{restaurantAccounts.bank.account}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.bank.account)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-400">IBAN:</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs">{restaurantAccounts.bank.iban}</p>
                      <button onClick={() => copyToClipboard(restaurantAccounts.bank.iban)} className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded">Copy</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input 
              type="text" 
              placeholder="Sender Account Name *" 
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-[#0F0F0F] p-3 rounded mb-3 border border-[#D4AF37]/30" 
            />

            <div className="mb-3">
              <label className="text-sm text-gray-400 mb-2 block">Upload Payment Screenshot *</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="w-full bg-[#0F0F0F] p-3 rounded border border-[#D4AF37]/30 text-sm" 
              />
              {paymentScreenshot && <img src={paymentScreenshot} alt="Payment" className="mt-3 w-full h-40 object-cover rounded" />}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1A1A1A] p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-bold text-[#D4AF37] mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery:</span>
                <span className="text-[#D4AF37]">Rs. {deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-[#D4AF37]/20">
                <span>Total:</span>
                <span className="text-[#D4AF37]">Rs. {total}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-4 rounded-lg font-bold"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}