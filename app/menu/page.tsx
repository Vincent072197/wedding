"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

type MenuItem = {
  nameCn: string;
  nameEn: string;
};

type MenuCategory = {
  categoryName: string;
  items: MenuItem[];
};

type MenuConfig = {
  menuTitle: string;
  menuSubtitle: string;
  menuFooterText: string;
  menuCategories: MenuCategory[];
};

const defaultMenuConfig: MenuConfig = {
  menuTitle: "婚宴菜單",
  menuSubtitle: "共赴幸福盛宴",
  menuFooterText: "祝各位用餐愉快",
  menuCategories: [],
};

export default function MenuPage() {
  const [config, setConfig] = useState<MenuConfig>(defaultMenuConfig);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.menu) {
          setConfig({ ...defaultMenuConfig, ...data.menu });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-rose-50/30">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 px-4 flex justify-center">
        <div className="max-w-2xl w-full bg-white p-8 md:p-16 shadow-lg border border-rose-100 rounded-sm">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-primary mb-2">
              {config.menuTitle}
            </h1>
            <p className="font-sans text-sm tracking-widest text-stone-500 uppercase">
              {config.menuSubtitle}
            </p>
            <div className="w-16 h-px bg-primary/30 mx-auto mt-6" />
          </div>

          <div className="space-y-12">
            {config.menuCategories.map((category, catIndex) => (
              <section key={catIndex} className="text-center">
                <h2 className="font-serif text-2xl text-stone-800 mb-6 italic">
                  {category.categoryName}
                </h2>
                <div className="space-y-4 font-sans text-stone-600">
                  {category.items.map((item, itemIndex) => (
                    <p key={itemIndex}>
                      <span className="font-semibold block text-stone-800">
                        {item.nameCn}
                      </span>
                      {item.nameEn}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="w-16 h-px bg-primary/30 mx-auto mb-6" />
            <p className="font-serif italic text-primary">
              {config.menuFooterText}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
