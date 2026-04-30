"use client";

import { useState, useEffect } from "react";

type Rsvp = {
  id: number;
  name: string;
  phone: string;
  attending: "yes" | "no";
  adult_count: number;
  child_count: number;
  meal_preference: string | null;
  note: string | null;
  table_number: number | null;
  submitted_at: string;
};

const MEAL_LABEL: Record<string, string> = {
  regular: "一般",
  vegetarian: "素食",
  vegan: "全素",
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
      <p className="text-sm text-stone-500 mb-1">{label}</p>
      <p className={`text-3xl font-serif font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminRsvpPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((data) => { setRsvps(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const attending = rsvps.filter((r) => r.attending === "yes");
  const declining = rsvps.filter((r) => r.attending === "no");
  const totalAdults = attending.reduce((sum, r) => sum + (r.adult_count ?? 0), 0);
  const totalChildren = attending.reduce((sum, r) => sum + (r.child_count ?? 0), 0);

  const exportCSV = () => {
    const header = ["姓名", "電話", "出席", "大人", "小孩", "餐點", "留言", "桌號", "填寫時間"];
    const rows = rsvps.map((r) => [
      r.name,
      r.phone,
      r.attending === "yes" ? "出席" : "不出席",
      r.adult_count,
      r.child_count,
      MEAL_LABEL[r.meal_preference ?? ""] ?? r.meal_preference ?? "",
      r.note ?? "",
      r.table_number ?? "",
      new Date(r.submitted_at).toLocaleString("zh-TW"),
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl text-stone-800">出席管理</h1>
          <button
            onClick={exportCSV}
            disabled={rsvps.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-40"
          >
            匯出 CSV
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="總回覆人數" value={rsvps.length} color="text-stone-800" />
          <StatCard label="確認出席" value={attending.length} color="text-emerald-600" />
          <StatCard label="婉拒出席" value={declining.length} color="text-red-500" />
          <StatCard label="出席人數（大人＋小孩）" value={totalAdults + totalChildren} color="text-primary" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-center text-stone-400 py-16">載入中...</p>
          ) : rsvps.length === 0 ? (
            <p className="text-center text-stone-400 py-16">尚無出席回覆</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {["姓名", "電話", "出席", "大人", "小孩", "餐點", "留言", "填寫時間"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-stone-800 whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{r.phone}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.attending === "yes"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {r.attending === "yes" ? "出席" : "不出席"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-stone-700">{r.attending === "yes" ? r.adult_count : "—"}</td>
                      <td className="px-4 py-3 text-center text-stone-700">{r.attending === "yes" ? r.child_count : "—"}</td>
                      <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                        {r.attending === "yes" ? (MEAL_LABEL[r.meal_preference ?? ""] ?? "—") : "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-500 max-w-xs truncate">{r.note ?? "—"}</td>
                      <td className="px-4 py-3 text-stone-400 whitespace-nowrap text-xs">
                        {new Date(r.submitted_at).toLocaleString("zh-TW", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary footer */}
        {attending.length > 0 && (
          <p className="text-sm text-stone-400 mt-4 text-right">
            出席賓客共 {totalAdults} 位大人、{totalChildren} 位小孩，合計 {totalAdults + totalChildren} 人
          </p>
        )}
      </div>
    </div>
  );
}
