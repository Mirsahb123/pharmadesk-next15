"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { mockMenuItems } from "@/lib/mockData";
import type { MenuItem } from "@/types";
import Link from "next/link";

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategory, setMenuCategory] = useState("Breakfast");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "", category: "Breakfast", description: "", image: "", temp: "hot" as "hot" | "cold",
    weight1: "", price1: "", weight2: "", price2: "", weight3: "", price3: "",
    discountValue: "", discountType: "percentage" as "percentage" | "fixed"
  });

  const menuCategories = ["Breakfast", "Biryani & Rice", "Curries/Gravy", "Tandoori & BBQ", "Snacks & Burgers", "Drinks & Desserts"];

  useEffect(() => {
    setMounted(true);
    const storedMenu = localStorage.getItem('darbar_menuItems');
    if (storedMenu) setMenuItems(JSON.parse(storedMenu));
    else {
      setMenuItems(mockMenuItems);
      localStorage.setItem('darbar_menuItems', JSON.stringify(mockMenuItems));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit && editingItem) setEditingItem({...editingItem, image: reader.result as string});
        else setNewMenuItem({...newMenuItem, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = () => {
    if (!newMenuItem.name ||!newMenuItem.description ||!newMenuItem.image ||!newMenuItem.price1) {
      return alert('Name, Description, Image aur kam az kam 1 Price zaroori hai');
    }
    const weightOptions = [];
    if (newMenuItem.weight1 && newMenuItem.price1) weightOptions.push({ weight: newMenuItem.weight1, price: parseInt(newMenuItem.price1) });
    if (newMenuItem.weight2 && newMenuItem.price2) weightOptions.push({ weight: newMenuItem.weight2, price: parseInt(newMenuItem.price2) });
    if (newMenuItem.weight3 && newMenuItem.price3) weightOptions.push({ weight: newMenuItem.weight3, price: parseInt(newMenuItem.price3) });

    const newItem: MenuItem = {
      id: `item-${Date.now()}`, name: newMenuItem.name, category: newMenuItem.category, description: newMenuItem.description,
      image: newMenuItem.image, temp: newMenuItem.temp, weightOptions, isAvailable: true, ratings: [], averageRating: 0,
      createdAt: new Date(), updatedAt: new Date(),
      discount: newMenuItem.discountValue? { type: newMenuItem.discountType, value: parseInt(newMenuItem.discountValue), isActive: true } : undefined
    };

    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    localStorage.setItem('darbar_menuItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('menuUpdated'));
    setShowAddMenu(false);
    setNewMenuItem({ name: "", category: "Breakfast", description: "", image: "", temp: "hot", weight1: "", price1: "", weight2: "", price2: "", weight3: "", price3: "", discountValue: "", discountType: "percentage" });
  };

  const handleEditMenuItem = () => {
    if (!editingItem) return;
    const updated = menuItems.map(item => item.id === editingItem.id? {...editingItem, updatedAt: new Date()} : item);
    setMenuItems(updated);
    localStorage.setItem('darbar_menuItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('menuUpdated'));
    setShowEditMenu(false);
    setEditingItem(null);
  };

  const handleDeleteMenuItem = (id: string) => {
    if (!confirm('Delete this item?')) return;
    const updated = menuItems.filter(item => item.id!== id);
    setMenuItems(updated);
    localStorage.setItem('darbar_menuItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  const handleToggleAvailability = (id: string) => {
    const updated = menuItems.map(item => item.id === id? {...item, isAvailable:!item.isAvailable, updatedAt: new Date()} : item);
    setMenuItems(updated);
    localStorage.setItem('darbar_menuItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  const handleToggleDiscount = (id: string) => {
    const updated = menuItems.map(item => {
      if (item.id === id && item.discount) return {...item, discount: {...item.discount, isActive:!item.discount.isActive}, updatedAt: new Date()};
      return item;
    });
    setMenuItems(updated);
    localStorage.setItem('darbar_menuItems', JSON.stringify(updated));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem({...item, weightOptions: item.weightOptions || []});
    setShowEditMenu(true);
  };

  const updateEditWeightPrice = (index: number, field: 'weight' | 'price', value: string) => {
    if (!editingItem) return;
    const newWeightOptions = [...(editingItem.weightOptions || [])];
    if (!newWeightOptions[index]) newWeightOptions[index] = { weight: '', price: 0 };
    if (field === 'weight') newWeightOptions[index].weight = value;
    else newWeightOptions[index].price = parseInt(value) || 0;
    setEditingItem({...editingItem, weightOptions: newWeightOptions});
  };

  const AddModal = () => (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto'}}>
      <div className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-3xl my-8 border-2 border-[#D4AF37]/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#D4AF37]">Add New Menu Item</h3>
          <button onClick={() => setShowAddMenu(false)} className="text-gray-400 hover:text-white text-3xl">✕</button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Item Name *</label>
            <input type="text" placeholder="e.g. Chicken Karahi" value={newMenuItem.name} onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Category *</label>
              <select value={newMenuItem.category} onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none">
                {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Temperature</label>
              <select value={newMenuItem.temp} onChange={(e) => setNewMenuItem({...newMenuItem, temp: e.target.value as any})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none">
                <option value="hot">Hot</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Description *</label>
            <textarea placeholder="Item ki detail likho..." value={newMenuItem.description} onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Image Upload *</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none" />
            {newMenuItem.image && <img src={newMenuItem.image} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Price Options</label>
            <div className="space-y-3 bg-[#0F0F0F] p-4 rounded border border-[#D4AF37]/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Weight/Size/Plate *</label>
                  <input type="text" placeholder="e.g. Half Plate, 500gm" value={newMenuItem.weight1} onChange={(e) => setNewMenuItem({...newMenuItem, weight1: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price (Rs) *</label>
                  <input type="number" placeholder="e.g. 800" value={newMenuItem.price1} onChange={(e) => setNewMenuItem({...newMenuItem, price1: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Weight/Size/Plate (Optional)</label>
                  <input type="text" placeholder="e.g. Full Plate, 1kg" value={newMenuItem.weight2} onChange={(e) => setNewMenuItem({...newMenuItem, weight2: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price (Rs) (Optional)</label>
                  <input type="number" placeholder="e.g. 1500" value={newMenuItem.price2} onChange={(e) => setNewMenuItem({...newMenuItem, price2: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Weight/Size/Plate (Optional)</label>
                  <input type="text" placeholder="e.g. Family Pack" value={newMenuItem.weight3} onChange={(e) => setNewMenuItem({...newMenuItem, weight3: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Price (Rs) (Optional)</label>
                  <input type="number" placeholder="e.g. 2800" value={newMenuItem.price3} onChange={(e) => setNewMenuItem({...newMenuItem, price3: e.target.value})} className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Discount (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Discount Value" value={newMenuItem.discountValue} onChange={(e) => setNewMenuItem({...newMenuItem, discountValue: e.target.value})} className="bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none" />
              <select value={newMenuItem.discountType} onChange={(e) => setNewMenuItem({...newMenuItem, discountType: e.target.value as any})} className="bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none">
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed Rs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowAddMenu(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded font-bold">Cancel</button>
          <button onClick={handleAddMenuItem} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded font-bold">Add Item</button>
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflowY: 'auto'}}>
      <div className="bg-[#1A1A1A] p-6 rounded-lg w-full max-w-3xl my-8 border-2 border-[#D4AF37]/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[#D4AF37]">Edit Menu Item</h3>
          <button onClick={() => {setShowEditMenu(false); setEditingItem(null);}} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Item Name *</label>
              <input type="text" value={editingItem?.name || ''} onChange={(e) => setEditingItem({...editingItem!, name: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Category *</label>
              <select value={editingItem?.category || 'Breakfast'} onChange={(e) => setEditingItem({...editingItem!, category: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30">
                {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Description *</label>
            <textarea value={editingItem?.description || ''} onChange={(e) => setEditingItem({...editingItem!, description: e.target.value})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30" />
            {editingItem?.image && <img src={editingItem.image} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Temperature</label>
            <select value={editingItem?.temp || 'hot'} onChange={(e) => setEditingItem({...editingItem!, temp: e.target.value as any})} className="w-full bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30">
              <option value="hot">Hot</option>
              <option value="cold">Cold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Price Options</label>
            <div className="space-y-3 bg-[#0F0F0F] p-4 rounded border border-[#D4AF37]/20">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Weight/Size/Plate {idx === 0? '*' : '(Optional)'}</label>
                    <input
                      type="text"
                      placeholder={idx === 0? "e.g. Half Plate" : "Optional"}
                      value={editingItem?.weightOptions?.[idx]?.weight || ''}
                      onChange={(e) => updateEditWeightPrice(idx, 'weight', e.target.value)}
                      className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Price (Rs) {idx === 0? '*' : '(Optional)'}</label>
                    <input
                      type="number"
                      placeholder={idx === 0? "e.g. 800" : "Optional"}
                      value={editingItem?.weightOptions?.[idx]?.price || ''}
                      onChange={(e) => updateEditWeightPrice(idx, 'price', e.target.value)}
                      className="w-full bg-[#1A1A1A] text-white p-2 rounded border border-[#D4AF37]/30"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2">Discount (Optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Discount Value"
                value={editingItem?.discount?.value || ''}
                onChange={(e) => setEditingItem({...editingItem!, discount: {...(editingItem?.discount || {type: 'percentage', isActive: true}), value: parseInt(e.target.value) || 0}})}
                className="bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30"
              />
              <select
                value={editingItem?.discount?.type || 'percentage'}
                onChange={(e) => setEditingItem({...editingItem!, discount: {...(editingItem?.discount || {value: 0, isActive: true}), type: e.target.value as any}})}
                className="bg-[#0F0F0F] text-white p-3 rounded border border-[#D4AF37]/30"
              >
                <option value="percentage">Percentage %</option>
                <option value="fixed">Fixed Rs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={() => {setShowEditMenu(false); setEditingItem(null);}} className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded font-bold">Cancel</button>
          <button onClick={handleEditMenuItem} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded font-bold">Update Item</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37]">🍽️ Menu Management</h1>
            <Link href="/admin" className="text-[#D4AF37] hover:text-[#F4C430] text-sm">← Back to Admin Panel</Link>
          </div>
          <button onClick={() => setShowAddMenu(true)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold">+ Add New Item</button>
        </div>

        <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 mb-6 border border-[#D4AF37]/20">
          <div className="flex flex-wrap gap-2">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => setMenuCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  menuCategory === category
 ? "bg-[#D4AF37] text-black"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.filter(item => item.category === menuCategory).map(item => (
            <div key={item.id} className="bg-[#1A1A1A] p-4 rounded-lg border border-[#D4AF37]/20">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>

              <div className="space-y-1 mb-3">
                {item.weightOptions?.map((wp, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-[#0F0F0F] p-2 rounded">
                    <span className="text-gray-300">{wp.weight}</span>
                    <span className="text-[#D4AF37] font-bold">Rs. {wp.price}</span>
                  </div>
                ))}
              </div>

              {item.discount?.isActive && (
                <div className="bg-red-600 text-white text-xs px-2 py-1 rounded mb-2 inline-block">
                  {item.discount.value}{item.discount.type === "percentage"? "%" : " Rs"} OFF
                </div>
              )}

              <p className={`text-sm mb-3 font-bold ${item.isAvailable? 'text-green-400' : 'text-red-400'}`}>
                {item.isAvailable? '✅ Available' : '❌ Hidden'}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openEditModal(item)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-bold">Edit</button>
                <button onClick={() => handleDeleteMenuItem(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-bold">Delete</button>
                <button onClick={() => handleToggleAvailability(item.id)} className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-bold">
                  {item.isAvailable? 'Hide' : 'Show'}
                </button>
                <button onClick={() => handleToggleDiscount(item.id)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-bold" disabled={!item.discount}>
                  {item.discount?.isActive? 'Remove Off' : 'Apply Off'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {menuItems.filter(item => item.category === menuCategory).length === 0 && (
          <p className="text-gray-400 text-center py-12 bg-[#1A1A1A] rounded-lg">No items in {menuCategory}. Click + Add New Item to add.</p>
        )}
      </div>

      {mounted && showAddMenu && createPortal(<AddModal />, document.body)}
      {mounted && showEditMenu && createPortal(<EditModal />, document.body)}
    </div>
  );
}