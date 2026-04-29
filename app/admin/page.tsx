"use client";

import { useState, useEffect } from "react";

// ─── Type Definitions ───────────────────────────────────────────────────────

type MenuItem = { nameCn: string; nameEn: string };
type MenuCategory = { categoryName: string; items: MenuItem[] };

type SiteConfig = {
  home: {
    coupleNames: string;
    heroText: string;
    weddingDate: string;
  };
  gallery: {
    galleryImages: string[];
    igCaption: string;
  };
  menu: {
    menuTitle: string;
    menuSubtitle: string;
    menuFooterText: string;
    menuCategories: MenuCategory[];
  };
  location: {
    locationTitle: string;
    locationDescription: string;
    venueName: string;
    venueAddress: string;
    parkingInfo: string;
    shuttleInfo: string;
    mapEmbedUrl: string;
  };
};

const defaultConfig: SiteConfig = {
  home: { coupleNames: "", heroText: "", weddingDate: "" },
  gallery: { galleryImages: [], igCaption: "" },
  menu: {
    menuTitle: "",
    menuSubtitle: "",
    menuFooterText: "",
    menuCategories: [],
  },
  location: {
    locationTitle: "",
    locationDescription: "",
    venueName: "",
    venueAddress: "",
    parkingInfo: "",
    shuttleInfo: "",
    mapEmbedUrl: "",
  },
};

// ─── Tab Definitions ────────────────────────────────────────────────────────

const TABS = ["Home", "Gallery", "Menu", "Location"] as const;
type TabName = (typeof TABS)[number];

// ─── Reusable UI Components ─────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-stone-700 mb-2">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y"
    />
  );
}

// ─── Toast Notification ─────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-xl text-white font-semibold text-sm transition-all animate-slide-in ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────────────

export default function AdminPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("Home");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  // Fetch initial config
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        // Merge fetched data with defaults to ensure all fields exist
        setConfig({
          home: { ...defaultConfig.home, ...data.home },
          gallery: { ...defaultConfig.gallery, ...data.gallery },
          menu: { ...defaultConfig.menu, ...data.menu },
          location: { ...defaultConfig.location, ...data.location },
        });
      })
      .catch((err) => console.error("Failed to load config", err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setToast({ message: "Settings saved successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to save settings.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Error saving settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ─── Helper Updaters ────────────────────────────────────────────────────

  const updateHome = (field: keyof SiteConfig["home"], value: string) => {
    setConfig((prev) => ({ ...prev, home: { ...prev.home, [field]: value } }));
  };

  const updateGallery = (
    field: keyof SiteConfig["gallery"],
    value: string | string[],
  ) => {
    setConfig((prev) => ({
      ...prev,
      gallery: { ...prev.gallery, [field]: value },
    }));
  };

  const updateMenu = (
    field: keyof Omit<SiteConfig["menu"], "menuCategories">,
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      menu: { ...prev.menu, [field]: value },
    }));
  };

  const updateLocation = (
    field: keyof SiteConfig["location"],
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  // ─── Gallery Image Helpers ──────────────────────────────────────────────

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...config.gallery.galleryImages];
    newImages[index] = value;
    updateGallery("galleryImages", newImages);
  };

  const addImage = () => {
    updateGallery("galleryImages", [...config.gallery.galleryImages, ""]);
  };

  const removeImage = (index: number) => {
    const newImages = config.gallery.galleryImages.filter(
      (_, i) => i !== index,
    );
    updateGallery("galleryImages", newImages);
  };

  // ─── Menu Category / Item Helpers ───────────────────────────────────────

  const addCategory = () => {
    setConfig((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        menuCategories: [
          ...prev.menu.menuCategories,
          { categoryName: "", items: [{ nameCn: "", nameEn: "" }] },
        ],
      },
    }));
  };

  const removeCategory = (catIndex: number) => {
    setConfig((prev) => ({
      ...prev,
      menu: {
        ...prev.menu,
        menuCategories: prev.menu.menuCategories.filter(
          (_, i) => i !== catIndex,
        ),
      },
    }));
  };

  const updateCategoryName = (catIndex: number, value: string) => {
    setConfig((prev) => {
      const cats = [...prev.menu.menuCategories];
      cats[catIndex] = { ...cats[catIndex], categoryName: value };
      return { ...prev, menu: { ...prev.menu, menuCategories: cats } };
    });
  };

  const addMenuItem = (catIndex: number) => {
    setConfig((prev) => {
      const cats = [...prev.menu.menuCategories];
      cats[catIndex] = {
        ...cats[catIndex],
        items: [...cats[catIndex].items, { nameCn: "", nameEn: "" }],
      };
      return { ...prev, menu: { ...prev.menu, menuCategories: cats } };
    });
  };

  const removeMenuItem = (catIndex: number, itemIndex: number) => {
    setConfig((prev) => {
      const cats = [...prev.menu.menuCategories];
      cats[catIndex] = {
        ...cats[catIndex],
        items: cats[catIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...prev, menu: { ...prev.menu, menuCategories: cats } };
    });
  };

  const updateMenuItem = (
    catIndex: number,
    itemIndex: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    setConfig((prev) => {
      const cats = [...prev.menu.menuCategories];
      const items = [...cats[catIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      cats[catIndex] = { ...cats[catIndex], items };
      return { ...prev, menu: { ...prev.menu, menuCategories: cats } };
    });
  };

  // ─── Tab Content Renderers ──────────────────────────────────────────────

  const renderHomeTab = () => (
    <div className="space-y-5">
      <div>
        <FieldLabel>Couple Names (新人名稱)</FieldLabel>
        <TextInput
          value={config.home.coupleNames}
          onChange={(v) => updateHome("coupleNames", v)}
          placeholder="e.g. Vincent & Sister"
        />
      </div>
      <div>
        <FieldLabel>Hero Text / Quotation (首頁標語)</FieldLabel>
        <TextInput
          value={config.home.heroText}
          onChange={(v) => updateHome("heroText", v)}
          placeholder="e.g. We decided on forever"
        />
      </div>
      <div>
        <FieldLabel>Wedding Date — Countdown Target (婚禮日期)</FieldLabel>
        <input
          type="datetime-local"
          value={
            config.home.weddingDate
              ? new Date(config.home.weddingDate).toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) =>
            updateHome("weddingDate", new Date(e.target.value).toISOString())
          }
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-5">
      <div>
        <FieldLabel>IG Post Caption (貼文文字)</FieldLabel>
        <TextArea
          value={config.gallery.igCaption}
          onChange={(v) => updateGallery("igCaption", v)}
          placeholder="e.g. We can't wait to share our special day..."
        />
      </div>
      <div>
        <FieldLabel>Gallery Images — URLs (照片網址)</FieldLabel>
        {config.gallery.galleryImages?.map((url, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="px-3 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="mt-2 text-sm text-primary hover:underline font-semibold"
        >
          + Add Image URL
        </button>
      </div>
    </div>
  );

  const renderMenuTab = () => (
    <div className="space-y-5">
      <div>
        <FieldLabel>Menu Page Title (菜單標題)</FieldLabel>
        <TextInput
          value={config.menu.menuTitle}
          onChange={(v) => updateMenu("menuTitle", v)}
          placeholder="e.g. Wedding Menu"
        />
      </div>
      <div>
        <FieldLabel>Subtitle (副標題)</FieldLabel>
        <TextInput
          value={config.menu.menuSubtitle}
          onChange={(v) => updateMenu("menuSubtitle", v)}
          placeholder="e.g. A Feast to Celebrate"
        />
      </div>
      <div>
        <FieldLabel>Footer Text (底部文字)</FieldLabel>
        <TextInput
          value={config.menu.menuFooterText}
          onChange={(v) => updateMenu("menuFooterText", v)}
          placeholder="e.g. Bon Appétit"
        />
      </div>

      {/* Category Sections */}
      <div className="pt-4 border-t border-stone-200">
        <FieldLabel>Menu Categories (菜單分類)</FieldLabel>
        <div className="space-y-6">
          {config.menu.menuCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              className="bg-stone-50 p-5 rounded-lg border border-stone-200"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="text"
                  value={category.categoryName}
                  onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                  placeholder="Category name (e.g. Appetizers)"
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(catIndex)}
                  className="px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                >
                  Remove Category
                </button>
              </div>

              {/* Menu Items */}
              <div className="space-y-3 ml-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.nameCn}
                      onChange={(e) =>
                        updateMenuItem(
                          catIndex,
                          itemIndex,
                          "nameCn",
                          e.target.value,
                        )
                      }
                      placeholder="中文名稱"
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                    />
                    <input
                      type="text"
                      value={item.nameEn}
                      onChange={(e) =>
                        updateMenuItem(
                          catIndex,
                          itemIndex,
                          "nameEn",
                          e.target.value,
                        )
                      }
                      placeholder="English Name"
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeMenuItem(catIndex, itemIndex)}
                      className="px-2 py-2 text-stone-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addMenuItem(catIndex)}
                  className="text-sm text-primary hover:underline font-semibold"
                >
                  + Add Dish
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCategory}
          className="mt-4 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-semibold border border-stone-300"
        >
          + Add Category
        </button>
      </div>
    </div>
  );

  const renderLocationTab = () => (
    <div className="space-y-5">
      <div>
        <FieldLabel>Page Title (頁面標題)</FieldLabel>
        <TextInput
          value={config.location.locationTitle}
          onChange={(v) => updateLocation("locationTitle", v)}
          placeholder="e.g. Location & Transport"
        />
      </div>
      <div>
        <FieldLabel>Page Description (頁面描述)</FieldLabel>
        <TextArea
          value={config.location.locationDescription}
          onChange={(v) => updateLocation("locationDescription", v)}
          placeholder="A brief description about venue & transport..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Venue Name (場地名稱)</FieldLabel>
          <TextInput
            value={config.location.venueName}
            onChange={(v) => updateLocation("venueName", v)}
            placeholder="e.g. The Grand Ballroom Hotel"
          />
        </div>
        <div>
          <FieldLabel>Venue Address (場地地址)</FieldLabel>
          <TextInput
            value={config.location.venueAddress}
            onChange={(v) => updateLocation("venueAddress", v)}
            placeholder="e.g. 123 Wedding Blvd..."
          />
        </div>
      </div>
      <div>
        <FieldLabel>Parking Info (停車資訊)</FieldLabel>
        <TextArea
          value={config.location.parkingInfo}
          onChange={(v) => updateLocation("parkingInfo", v)}
          placeholder="Details about parking..."
        />
      </div>
      <div>
        <FieldLabel>Shuttle Bus Info (接駁車資訊)</FieldLabel>
        <TextArea
          value={config.location.shuttleInfo}
          onChange={(v) => updateLocation("shuttleInfo", v)}
          placeholder="Details about shuttle service..."
        />
      </div>
      <div>
        <FieldLabel>Google Maps Embed URL (地圖嵌入網址)</FieldLabel>
        <TextInput
          value={config.location.mapEmbedUrl}
          onChange={(v) => updateLocation("mapEmbedUrl", v)}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <p className="text-xs text-stone-400 mt-1">
          Paste the full iframe src URL from Google Maps → Share → Embed a map.
        </p>
      </div>
    </div>
  );

  const tabContent: Record<TabName, () => React.ReactNode> = {
    Home: renderHomeTab,
    Gallery: renderGalleryTab,
    Menu: renderMenuTab,
    Location: renderLocationTab,
  };

  // ─── Main Admin Layout ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl text-stone-800">Admin Panel</h1>
          <span className="text-xs text-stone-400 font-sans">
            Wedding Website CMS
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-t-xl border border-b-0 border-stone-200 p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSave}
          className="bg-white p-6 md:p-8 rounded-b-xl border border-stone-200 shadow-sm"
        >
          {tabContent[activeTab]()}

          {/* Save Button */}
          <div className="pt-8 mt-8 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
