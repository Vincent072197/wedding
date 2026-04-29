"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

type LocationConfig = {
  locationTitle: string;
  locationDescription: string;
  venueName: string;
  venueAddress: string;
  parkingInfo: string;
  shuttleInfo: string;
  mapEmbedUrl: string;
};

const defaultLocationConfig: LocationConfig = {
  locationTitle: "婚宴地點與交通",
  locationDescription: "非常期待與您共度這特別的一天！以下是婚宴場地及交通相關資訊。",
  venueName: "",
  venueAddress: "",
  parkingInfo: "",
  shuttleInfo: "",
  mapEmbedUrl: "",
};

export default function LocationPage() {
  const [config, setConfig] = useState<LocationConfig>(defaultLocationConfig);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.location) {
          setConfig({ ...defaultLocationConfig, ...data.location });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-x-hidden bg-stone-50">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-stone-800 mb-4">
            {config.locationTitle}
          </h1>
          <p className="font-sans text-stone-500 max-w-xl mx-auto">
            {config.locationDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-primary mb-2">
                婚宴會館
              </h2>
              <p className="font-sans font-semibold text-stone-800">
                {config.venueName}
              </p>
              <p className="font-sans text-stone-600 mt-1">
                {config.venueAddress}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl text-primary mb-2">
                停車資訊
              </h2>
              <p className="font-sans text-stone-600">{config.parkingInfo}</p>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-primary mb-2">
                接駁車
              </h2>
              <p className="font-sans text-stone-600">{config.shuttleInfo}</p>
            </div>
          </div>

          {/* Map Area */}
          <div className="bg-stone-200 w-full h-[400px] md:h-auto min-h-[400px] rounded-sm flex items-center justify-center border border-stone-300 relative overflow-hidden">
            {config.mapEmbedUrl ? (
              <iframe
                src={config.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Wedding venue map"
                className="absolute inset-0"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30" />
                <div className="relative z-10 bg-white/90 backdrop-blur px-6 py-4 rounded shadow-lg text-center">
                  <span className="font-sans font-semibold text-stone-800 block mb-1">
                    Google 地圖
                  </span>
                  <span className="text-sm text-stone-500">
                    請在後台設定地圖網址
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
