"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

type Result = {
  name: string;
  attending: "yes" | "no";
  table_number: number | null;
};

type Status = "idle" | "loading" | "found" | "not_found" | "error";

export default function TableLookupPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<Result | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/rsvp/lookup?phone=${encodeURIComponent(phone.trim())}`);
      if (res.status === 404) { setStatus("not_found"); return; }
      if (!res.ok) { setStatus("error"); return; }
      const data = await res.json();
      setResult(data);
      setStatus("found");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-16">
        {/* Card */}
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-2">Wedding</p>
            <h1 className="font-serif text-3xl text-stone-800 mb-2">桌號查詢</h1>
            <p className="text-sm text-stone-500">輸入您填寫 RSVP 時使用的手機號碼</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLookup} className="space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setStatus("idle"); }}
              placeholder="0912-345-678"
              className="w-full px-4 py-3 text-center text-lg border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white tracking-widest"
            />
            <button
              type="submit"
              disabled={!phone.trim() || status === "loading"}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "查詢中..." : "查詢座位"}
            </button>
          </form>

          {/* Result */}
          {status === "found" && result && (
            <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-xs tracking-widest text-stone-400 uppercase mb-1">歡迎</p>
              <p className="font-serif text-2xl text-stone-800 mb-5">{result.name}</p>

              {result.attending === "no" ? (
                <p className="text-stone-400 text-sm">您的出席狀態為「不出席」，期待下次相聚。</p>
              ) : result.table_number ? (
                <>
                  <p className="text-xs text-stone-400 mb-1">您的座位在</p>
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-primary/30 bg-primary/5 mx-auto">
                    <span className="font-serif text-4xl font-semibold text-primary">
                      {result.table_number}
                    </span>
                  </div>
                  <p className="text-sm text-stone-400 mt-3">桌</p>
                </>
              ) : (
                <p className="text-stone-400 text-sm">桌號尚未安排，當天現場將為您指引座位。</p>
              )}
            </div>
          )}

          {status === "not_found" && (
            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-700 font-semibold mb-1">查無紀錄</p>
              <p className="text-xs text-amber-600">請確認手機號碼與填寫 RSVP 時一致</p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4 text-center">
              <p className="text-sm text-red-600">發生錯誤，請稍後再試</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
