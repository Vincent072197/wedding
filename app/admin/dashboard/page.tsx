"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Rsvp = {
  id: number;
  name: string;
  attending: "yes" | "no";
  adult_count: number;
  child_count: number;
  submitted_at: string;
};

type GuestbookPost = {
  id: number;
  is_approved: boolean;
};

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
      <p className="text-sm text-stone-500 mb-1">{label}</p>
      <p className={`text-3xl font-serif font-semibold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [posts, setPosts] = useState<GuestbookPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/rsvp").then((r) => r.json()),
      fetch("/api/guestbook?all=true").then((r) => r.json()),
    ])
      .then(([rsvpData, guestbookData]) => {
        setRsvps(rsvpData);
        setPosts(guestbookData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const attending = rsvps.filter((r) => r.attending === "yes");
  const declining = rsvps.filter((r) => r.attending === "no");
  const totalGuests = attending.reduce(
    (sum, r) => sum + (r.adult_count ?? 0) + (r.child_count ?? 0),
    0,
  );
  const attendRate =
    rsvps.length > 0
      ? Math.round((attending.length / rsvps.length) * 100)
      : 0;
  const visiblePosts = posts.filter((p) => p.is_approved).length;

  const recent = [...rsvps]
    .sort(
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-3xl text-stone-800 mb-6">儀表板</h1>

        {loading ? (
          <p className="text-stone-400 text-center py-16">載入中...</p>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                label="總回覆數"
                value={rsvps.length}
                color="text-stone-800"
              />
              <StatCard
                label="確認出席"
                value={attending.length}
                sub={rsvps.length > 0 ? `出席率 ${attendRate}%` : undefined}
                color="text-emerald-600"
              />
              <StatCard
                label="婉拒出席"
                value={declining.length}
                color="text-red-500"
              />
              <StatCard
                label="出席人數"
                value={totalGuests}
                sub="大人＋小孩"
                color="text-primary"
              />
              <StatCard
                label="留言板"
                value={visiblePosts}
                sub={`共 ${posts.length} 則`}
                color="text-amber-600"
              />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  href: "/admin/rsvp",
                  label: "出席管理",
                  desc: "查看 RSVP 列表、匯出 CSV",
                },
                {
                  href: "/admin/guestbook",
                  label: "留言管理",
                  desc: "審核、隱藏、刪除留言",
                },
                {
                  href: "/admin",
                  label: "後台設定",
                  desc: "編輯網站內容與主題",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <p className="font-semibold text-stone-800 group-hover:text-primary transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{link.desc}</p>
                </Link>
              ))}
            </div>

            {/* Recent RSVPs */}
            {recent.length > 0 && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="font-semibold text-stone-700 text-sm">
                    最新回覆
                  </h2>
                  <Link
                    href="/admin/rsvp"
                    className="text-xs text-primary hover:underline"
                  >
                    查看全部
                  </Link>
                </div>
                <div className="divide-y divide-stone-100">
                  {recent.map((r) => (
                    <div
                      key={r.id}
                      className="px-5 py-3 flex items-center justify-between"
                    >
                      <span className="font-semibold text-stone-800 text-sm">
                        {r.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            r.attending === "yes"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {r.attending === "yes" ? "出席" : "不出席"}
                        </span>
                        <span className="text-xs text-stone-400">
                          {new Date(r.submitted_at).toLocaleString("zh-TW", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rsvps.length === 0 && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
                <p className="text-stone-400 text-sm">尚無任何 RSVP 回覆</p>
                <p className="text-stone-300 text-xs mt-1">
                  分享婚禮網址給賓客後，這裡會顯示出席統計
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
