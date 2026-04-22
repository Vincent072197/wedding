"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import Image from "next/image";

type Comment = {
  id: number;
  author: string;
  text: string;
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
];

export default function IGPostBoard() {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1204);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: "family_friend", text: "Congratulations! So happy for you two! ❤️" },
    { id: 2, author: "bestie_99", text: "Can't wait for the big day! 🎉" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: "guest_visitor", // Mock username
      text: newComment.trim(),
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <section id="guestbook" className="py-20 bg-stone-50 flex justify-center px-4">
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
            VS
          </div>
          <span className="font-sans font-semibold text-sm">vincent_and_sister</span>
        </div>

        {/* Carousel (輪播圖) */}
        <div className="overflow-hidden relative bg-stone-100" ref={emblaRef}>
          <div className="flex">
            {placeholderImages.map((src, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative aspect-square" key={index}>
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
              <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
                <Heart className={`w-6 h-6 ${liked ? "fill-primary text-primary" : "text-stone-800"}`} />
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
          
          <div className="font-semibold text-sm mb-2">{likesCount.toLocaleString()} likes</div>
          
          <div className="text-sm mb-3">
            <span className="font-semibold mr-2">vincent_and_sister</span>
            We can't wait to share our special day with all of you! Leave us a blessing below. ✨
          </div>

          {/* Comments Section (留言區) */}
          <div className="space-y-1 mb-4 max-h-32 overflow-y-auto custom-scrollbar">
            {comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-semibold mr-2">{c.author}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handlePostComment} className="flex items-center px-4 py-3 border-t border-stone-100">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <button 
            type="submit" 
            disabled={!newComment.trim()}
            className="text-primary font-semibold text-sm disabled:opacity-50 transition-opacity ml-2"
          >
            Post
          </button>
        </form>
      </motion.div>
    </section>
  );
}
