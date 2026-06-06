"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Banner } from "@/types";

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload");

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    const stored = localStorage.getItem('darbar_banners');
    if (stored) {
      setBanners(JSON.parse(stored));
    }
  };

  const saveBanners = (updatedBanners: Banner[]) => {
    localStorage.setItem('darbar_banners', JSON.stringify(updatedBanners));
    setBanners(updatedBanners);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setImageUrl(base64String); // Base64 ko hi imageUrl me save kar denge
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title ||!description ||!imageUrl) {
      alert("Title, Description aur Image zaroori hain");
      return;
    }

    if (editingId) {
      // Edit existing banner
      const updated = banners.map(b =>
        b.id === editingId
         ? {...b, title, description, imageUrl, link, priority }
          : b
      );
      saveBanners(updated);
      alert("Banner Updated Successfully!");
    } else {
      // Add new banner
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        title,
        description,
        imageUrl,
        link: link || undefined,
        isActive: true,
        priority,
        createdAt: new Date(),
      };
      const updated = [...banners, newBanner];
      saveBanners(updated);
      alert("Banner Added Successfully!");
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setLink("");
    setPriority(1);
    setEditingId(null);
    setUploadMode("upload");
  };

  const editBanner = (banner: Banner) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setDescription(banner.description);
    setImageUrl(banner.imageUrl);
    setImagePreview(banner.imageUrl);
    setLink(banner.link || "");
    setPriority(banner.priority);
    setUploadMode("url");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBanner = (id: string) => {
    const updated = banners.map(b =>
      b.id === id? {...b, isActive:!b.isActive } : b
    );
    saveBanners(updated);
  };

  const deleteBanner = (id: string) => {
    if (confirm("Delete this banner?")) {
      const updated = banners.filter(b => b.id!== id);
      saveBanners(updated);
      alert("Banner Deleted!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-[#7B1818] hover:underline mb-2 block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold text-[#7B1818] mb-8 font-[family-name:var(--font-cinzel)]">
          Announcements / Banners
        </h1>

        {/* Add/Edit Banner Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#7B1818]">
            {editingId? "Edit Banner" : "Create New Banner"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Banner Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Weekend Party Deal"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={priority}
                onChange={e => setPriority(Number(e.target.value))}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="e.g., Enjoy 20% off on all BBQ items this weekend!"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
                rows={3}
              />
            </div>

            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Banner Image *
              </label>

              {/* Upload Mode Tabs */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUploadMode("upload")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    uploadMode === "upload"
                     ? 'bg-[#7B1818] text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  📁 Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    uploadMode === "url"
                     ? 'bg-[#7B1818] text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>

              {uploadMode === "upload"? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#7B1818] file:text-white file:font-semibold hover:file:bg-[#5A1010] file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1200x600px (JPG, PNG, WEBP)
                  </p>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
                />
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setImageUrl("");
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., /menu or /offers"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-[#7B1818] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-[#7B1818] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#5A1010] transition-colors"
            >
              {editingId? "Update Banner" : "Create Banner"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Banners List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#7B1818]">
            All Banners ({banners.length})
          </h2>

          {banners.length === 0? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📢</div>
              <p className="text-gray-500 text-lg">No banners yet. Create one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners
               .sort((a, b) => a.priority - b.priority)
               .map(banner => (
                  <div
                    key={banner.id}
                    className={`border-2 rounded-xl overflow-hidden ${
                      banner.isActive? 'border-green-300' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-[#7B1818]">
                          {banner.title}
                        </h3>
                        <span className="bg-[#7B1818] text-white px-2 py-1 rounded text-xs">
                          Priority {banner.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{banner.description}</p>
                      {banner.link && (
                        <p className="text-xs text-blue-600 mb-3">🔗 {banner.link}</p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => editBanner(banner)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleBanner(banner.id)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${
                            banner.isActive
                             ? 'bg-orange-600 text-white hover:bg-orange-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {banner.isActive? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => deleteBanner(banner.id)}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
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

export default BannersPage;