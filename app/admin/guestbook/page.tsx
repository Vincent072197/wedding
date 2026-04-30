"use client";

import { useState, useEffect } from "react";

type Post = {
  id: number;
  guest_name: string;
  message: string;
  likes_count: number;
  is_approved: boolean;
  created_at: string;
};

export default function AdminGuestbookPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/guestbook?all=true")
      .then((res) => res.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleVisibility = async (post: Post) => {
    const updated = !post.is_approved;
    await fetch(`/api/guestbook/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: updated }),
    });
    setPosts((prev) =>
      prev.map((p) => p.id === post.id ? { ...p, is_approved: updated } : p)
    );
  };

  const deletePost = async (id: number) => {
    if (!confirm("確定要刪除這則留言嗎？")) return;
    await fetch(`/api/guestbook/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const visible = posts.filter((p) => p.is_approved).length;
  const hidden = posts.filter((p) => !p.is_approved).length;

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl text-stone-800">留言管理</h1>
          <div className="flex gap-4 text-sm text-stone-500">
            <span>顯示中 <strong className="text-emerald-600">{visible}</strong></span>
            <span>已隱藏 <strong className="text-stone-400">{hidden}</strong></span>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {loading && (
            <p className="text-center text-stone-400 py-16">載入中...</p>
          )}
          {!loading && posts.length === 0 && (
            <p className="text-center text-stone-400 py-16">尚無留言</p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-xl border p-5 shadow-sm transition-opacity ${
                post.is_approved ? "border-stone-200" : "border-stone-100 opacity-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-stone-800 text-sm">{post.guest_name}</span>
                    {!post.is_approved && (
                      <span className="text-xs bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full">已隱藏</span>
                    )}
                    <span className="text-xs text-stone-400 ml-auto">
                      ♥ {post.likes_count} · {new Date(post.created_at).toLocaleString("zh-TW", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  <p className="text-stone-600 text-sm break-words">{post.message}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleVisibility(post)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      post.is_approved
                        ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {post.is_approved ? "隱藏" : "顯示"}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
