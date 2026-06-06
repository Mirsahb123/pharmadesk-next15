"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Customer } from "@/types";

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const stored = localStorage.getItem('darbar_customers');
    if (stored) {
      setCustomers(JSON.parse(stored));
    }
  };

  const saveCustomers = (updatedCustomers: Customer[]) => {
    localStorage.setItem('darbar_customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
  };

  const toggleBlock = (id: string) => {
    const updated = customers.map(c =>
      c.id === id ? { ...c, isBlocked: !c.isBlocked } : c
    );
    saveCustomers(updated);
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Delete this customer? All data will be lost.")) {
      const updated = customers.filter(c => c.id !== id);
      saveCustomers(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-[#7B1818] hover:underline mb-2 block">← Back to Dashboard</Link>
        <h1 className="text-4xl font-bold text-[#7B1818] mb-8 font-[family-name:var(--font-cinzel)]">
          Customer Management
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#7B1818]">All Customers ({customers.length})</h2>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No customers yet</p>
              <p className="text-gray-400 text-sm mt-2">Customers will appear here when they place orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Area</th>
                    <th className="text-center p-3">Orders</th>
                    <th className="text-center p-3">Total Spent</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{customer.name}</td>
                      <td className="p-3">{customer.phone}</td>
                      <td className="p-3 text-sm text-gray-600">{customer.area}</td>
                      <td className="p-3 text-center">{customer.totalOrders}</td>
                      <td className="p-3 text-center font-semibold">Rs. {customer.totalSpent}</td>
                      <td className="p-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {customer.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => toggleBlock(customer.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700"
                          >
                            {customer.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;