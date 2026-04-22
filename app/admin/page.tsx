"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [config, setConfig] = useState({
    coupleNames: "",
    weddingDate: "",
    heroText: "",
    galleryImages: [] as string[]
  });

  // Fetch initial config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error("Failed to load config", err));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...config.galleryImages];
    newImages[index] = value;
    setConfig({ ...config, galleryImages: newImages });
  };

  const addImage = () => {
    setConfig({ ...config, galleryImages: [...config.galleryImages, ""] });
  };

  const removeImage = (index: number) => {
    const newImages = config.galleryImages.filter((_, i) => i !== index);
    setConfig({ ...config, galleryImages: newImages });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md border border-stone-200 w-full max-w-sm text-center">
          <h2 className="font-serif text-2xl text-stone-800 mb-6">Login to Admin</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-stone-300 rounded mb-4 focus:outline-none focus:border-primary"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-rose-600 transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-stone-200">
      <h2 className="font-serif text-2xl text-stone-800 mb-6 border-b pb-4">Website Settings</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Couple Names</label>
          <input 
            type="text" 
            value={config.coupleNames}
            onChange={(e) => setConfig({...config, coupleNames: e.target.value})}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
            placeholder="e.g. Vincent & Sister"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Hero Text (Quotation)</label>
          <input 
            type="text" 
            value={config.heroText}
            onChange={(e) => setConfig({...config, heroText: e.target.value})}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
            placeholder="e.g. We decided on forever"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Wedding Date (Countdown Target)</label>
          <input 
            type="datetime-local" 
            value={config.weddingDate ? new Date(config.weddingDate).toISOString().slice(0,16) : ""}
            onChange={(e) => setConfig({...config, weddingDate: new Date(e.target.value).toISOString()})}
            className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Gallery Images (URLs)</label>
          {config.galleryImages.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary text-sm"
                placeholder="https://..."
              />
              <button type="button" onClick={() => removeImage(index)} className="px-3 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addImage} className="mt-2 text-sm text-primary hover:underline font-semibold">
            + Add Image URL
          </button>
        </div>

        <div className="pt-6 border-t border-stone-200">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
