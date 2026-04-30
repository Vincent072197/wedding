"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Comment = {
  id: number;
  guest_name: string;
  message: string;
};

export default function IGPostBoard() {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [config, setConfig] = useState({
    coupleNames: "",
    galleryImages: [],
    igCaption: "",
  });

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.home?.coupleNames) {
          setConfig({
            coupleNames: data.home.coupleNames,
            galleryImages: data.gallery?.galleryImages || config.galleryImages,
            igCaption: data.gallery?.igCaption || config.igCaption,
          });
        }
      })
      .catch(console.error);

    fetch("/api/guestbook")
      .then((resp) => resp.json())
      .then((data) => setComments(data))
      .catch(console.error);

    const channel = supabaseBrowser
      .channel("guestbook")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guestbook_posts",
          filter: "is_approved=eq.true",
        },
        (payload) => {
          const newPost = payload.new as Comment;
          setComments((prev) => [...prev, newPost]);
        },
      )
      .subscribe();
    // 離開頁面時取消訂閱
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  const handleText = config.coupleNames
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/&/g, "and");
  const initials = config.coupleNames
    .split(" & ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName,
        message: newComment.trim(),
      }),
    });
    const newPost = await res.json();
    setNewComment("");
    setGuestName("");
  };

  return (
    <section
      id="guestbook"
      className="py-10 md:py-20 bg-stone-50 flex justify-center px-4 w-full overflow-x-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xl"
      >
        {/* Post Header */}
        <div className="flex items-center p-4 border-b border-stone-100">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-serif mr-3">
            {initials}
          </div>
          <span className="font-sans font-semibold text-sm">{handleText}</span>
        </div>

        {/* Carousel (輪播圖) */}
        <div className="overflow-hidden relative bg-stone-100" ref={emblaRef}>
          <div className="flex">
            {config.galleryImages.map((src, index) => (
              <div
                className="flex-[0_0_100%] min-w-0 relative aspect-square"
                key={index}
              >
                <Image
                  src={src}
                  alt={`Wedding photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 pb-2">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                className="hover:opacity-70 transition-opacity"
              >
                <Heart
                  className={`w-6 h-6 ${liked ? "fill-primary text-primary" : "text-stone-800"}`}
                />
              </button>
              <button className="hover:opacity-70 transition-opacity">
                <MessageCircle className="w-6 h-6 text-stone-800" />
              </button>
              <button className="hover:opacity-70 transition-opacity">
                <Send className="w-6 h-6 text-stone-800" />
              </button>
            </div>
            <button className="hover:opacity-70 transition-opacity">
              <Bookmark className="w-6 h-6 text-stone-800" />
            </button>
          </div>

          <div className="font-semibold text-sm mb-2">
            {likesCount.toLocaleString()} 個讚
          </div>

          <div className="text-sm mb-3 pb-3 border-b border-stone-100">
            <span className="font-semibold mr-2">{handleText}</span>
            {config.igCaption}
          </div>

          {/* Comments Section (留言區) */}
          {comments.length > 0 && (
            <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2">
              賓客祝福
            </p>
          )}
          <div className="space-y-1.5 mb-4 max-h-32 overflow-y-auto custom-scrollbar">
            {comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-semibold mr-2">{c.guest_name}</span>
                <span className="text-stone-600">{c.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input Form */}
        <form
          onSubmit={handlePostComment}
          className="px-4 py-3 border-t border-stone-100"
        >
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="您的姓名..."
            className="w-full outline-none text-sm bg-transparent border-b border-stone-200 pb-1 mb-2"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="留下祝福..."
              className="flex-1 outline-none text-sm bg-transparent"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="text-primary font-semibold text-sm disabled:opacity-50 transition-opacity shrink-0"
            >
              發送
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
