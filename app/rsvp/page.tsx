"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

type RsvpForm = {
  name: string;
  phone: string;
  attending: "yes" | "no" | "";
  adultCount: number;
  childCount: number;
  mealPreference: string;
  note: string;
};

const defaultForm: RsvpForm = {
  name: "",
  phone: "",
  attending: "",
  adultCount: 1,
  childCount: 0,
  mealPreference: "regular",
  note: "",
};

export default function RsvpPage() {
  const [form, setForm] = useState<RsvpForm>(defaultForm);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const update = (field: keyof RsvpForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-rose-50/30">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-serif text-4xl text-stone-800 mb-4">
            Thank You! 🎉
          </h2>
          <p className="font-sans text-stone-500">
            Your RSVP has been received. We can&apos;t wait to celebrate with
            you!
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-rose-50/30">
      <Navbar />
      <main className="flex-1 w-full pt-32 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl text-stone-800 mb-2">RSVP</h1>
            <p className="font-sans text-stone-500 text-sm tracking-wide">
              Please respond by September 1, 2026
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-sm shadow-sm border border-rose-100 space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="09xx-xxx-xxx"
                className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-stone-400 mt-1">
                Used to identify your RSVP — you can update it anytime with the
                same number.
              </p>
            </div>

            {/* Attending */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-3">
                Will you attend? *
              </label>
              <div className="flex gap-4">
                {(["yes", "no"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("attending", option)}
                    className={`flex-1 py-2 rounded border font-semibold text-sm transition-all ${
                      form.attending === option
                        ? "bg-primary text-white border-primary"
                        : "border-stone-300 text-stone-600 hover:border-primary"
                    }`}
                  >
                    {option === "yes"
                      ? "✓ Joyfully Accept"
                      : "✗ Regretfully Decline"}
                  </button>
                ))}
              </div>
            </div>

            {/* Show these only if attending */}
            {form.attending === "yes" && (
              <>
                {/* Guest counts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.adultCount}
                      onChange={(e) =>
                        update("adultCount", parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.childCount}
                      onChange={(e) =>
                        update("childCount", parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Meal preference */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Meal Preference
                  </label>
                  <select
                    value={form.mealPreference}
                    onChange={(e) => update("mealPreference", e.target.value)}
                    className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary"
                  >
                    <option value="regular">Regular</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Message to the Couple
              </label>
              <textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="Leave us a sweet message..."
                rows={3}
                className="w-full px-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-primary resize-y"
              />
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={
                !form.name ||
                !form.phone ||
                !form.attending ||
                status === "loading"
              }
              className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-rose-600 transition-colors               
  disabled:opacity-50"
            >
              {status === "loading" ? "Submitting..." : "Send RSVP"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
