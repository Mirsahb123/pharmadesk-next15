"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Rider } from "@/types";

const RidersPage = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [bikeNumber, setBikeNumber] = useState("");

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = () => {
    const stored = localStorage.getItem('darbar_riders');
    if (stored) {
      setRiders(JSON.parse(stored));
    }
  };

  const saveRiders = (updatedRiders: Rider[]) => {
    localStorage.setItem('darbar_riders', JSON.stringify(updatedRiders));
    setRiders(updatedRiders);
  };

  const addRider = () => {
    if (!name || !phone || !cnic || !bikeNumber) {
      alert("Saare fields bharo");
      return;
    }

    const newRider: Rider = {
      id: `rider-${Date.now()}`,
      name,
      phone,
      cnic,
      bikeNumber,
      isActive: true,
      isOnline: false,
      totalDeliveries: 0,
      rating: 5.0,
      cashInHand: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updated = [...riders, newRider];
    saveRiders(updated);
    
    setName("");
    setPhone("");
    setCnic("");
    setBikeNumber("");
    alert("Rider Added Successfully!");
  };

  const toggleRider = (id: string) => {
    const updated = riders.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    saveRiders(updated);
  };

  const deleteRider = (id: string) => {
    if (confirm("Delete this rider?")) {
      const updated = riders.filter(r => r.id !== id);
      saveRiders(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-[#7B1818] hover:underline mb-2 block">← Back to Dashboard</Link>
        <h1 className="text-4xl font-bold text-[#7B1818] mb-8 font-[family-name:var(--font-cinzel)]">
          Rider Management
        </h1>

        {/* Add New Rider */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#7B1818]">Add New Rider</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Rider Name - e.g. Ali Khan"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number - e.g. 03001234567"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
            />
            <input
              type="text"
              placeholder="CNIC - e.g. 35201-1234567-1"
              value={cnic}
              onChange={e => setCnic(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Bike Number - e.g. LEA-1234"
              value={bikeNumber}
              onChange={e => setBikeNumber(e.target.value)}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
            />
          </div>
          <button
            onClick={addRider}
            className="mt-4 bg-[#7B1818] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#5A1010]"
          >
            Add Rider
          </button>
        </div>

        {/* Riders List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#7B1818]">All Riders ({riders.length})</h2>
          {riders.length === 0 ? (
            <p className="text-gray-500">No riders yet. Add one above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riders.map(rider => (
                <div key={rider.id} className="border-2 border-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-[#7B1818]">{rider.name}</h3>
                      <p className="text-sm text-gray-600">📱 {rider.phone}</p>
                      <p className="text-sm text-gray-600">🛵 {rider.bikeNumber}</p>
                      <p className="text-xs text-gray-400">CNIC: {rider.cnic}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rider.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {rider.isActive ? "Active" : "Blocked"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span>📦 {rider.totalDeliveries} Deliveries</span>
                    <span>⭐ {rider.rating}</span>
                    <span>💰 Rs. {rider.cashInHand}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRider(rider.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      {rider.isActive ? "Block" : "Unblock"}
                    </button>
                    <button
                      onClick={() => deleteRider(rider.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RidersPage;