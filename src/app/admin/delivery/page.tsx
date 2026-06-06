"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DeliverySettings {
  baseFee: number;
  perKmRate: number;
  freeDeliveryAbove: number;
  maxDistance: number;
}

const DeliveryPage = () => {
  const [settings, setSettings] = useState<DeliverySettings>({
    baseFee: 100,
    perKmRate: 20,
    freeDeliveryAbove: 2000,
    maxDistance: 15,
  });

  useEffect(() => {
    const stored = localStorage.getItem('darbar_delivery_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('darbar_delivery_settings', JSON.stringify(settings));
    alert("Delivery Settings Saved! Petrol mehnga ho to yahan se change kar dena.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-[#7B1818] hover:underline mb-2 block">← Back to Dashboard</Link>
        <h1 className="text-4xl font-bold text-[#7B1818] mb-8 font-[family-name:var(--font-cinzel)]">
          Delivery Settings
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Delivery Fee (Rs.)
            </label>
            <input
              type="number"
              value={settings.baseFee}
              onChange={e => setSettings({...settings, baseFee: Number(e.target.value)})}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum delivery charge</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Per KM Rate (Rs.)
            </label>
            <input
              type="number"
              value={settings.perKmRate}
              onChange={e => setSettings({...settings, perKmRate: Number(e.target.value)})}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Petrol mehnga ho to yahan badha do</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Free Delivery Above (Rs.)
            </label>
            <input
              type="number"
              value={settings.freeDeliveryAbove}
              onChange={e => setSettings({...settings, freeDeliveryAbove: Number(e.target.value)})}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Is amount se upar order pe delivery free</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Delivery Distance (KM)
            </label>
            <input
              type="number"
              value={settings.maxDistance}
              onChange={e => setSettings({...settings, maxDistance: Number(e.target.value)})}
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Is distance se door order nahi lenge</p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">Formula:</h3>
            <p className="text-sm text-yellow-700">
              Total Delivery Fee = Base Fee + (Distance × Per KM Rate)
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Example: 5 KM = {settings.baseFee} + (5 × {settings.perKmRate}) = Rs. {settings.baseFee + (5 * settings.perKmRate)}
            </p>
          </div>

          <button
            onClick={saveSettings}
            className="w-full bg-[#7B1818] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#5A1010]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;