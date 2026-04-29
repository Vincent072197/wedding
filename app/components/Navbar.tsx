"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl text-foreground font-semibold"
        >
          軒 &amp; 璇
        </Link>
        <div className="flex gap-4 md:gap-6 text-xs md:text-sm font-sans tracking-widest uppercase text-foreground/80">
          <Link href="/" className="hover:text-primary transition-colors">
            首頁
          </Link>
          <Link
            href="/gallery"
            className="hover:text-primary transition-colors"
          >
            照片展示
          </Link>
          <Link href="/menu" className="hover:text-primary transition-colors">
            婚宴菜單
          </Link>
          <Link
            href="/location"
            className="hover:text-primary transition-colors"
          >
            交通資訊
          </Link>
          <Link href="/rsvp" className="hover:text-primary transition-colors">
            出席確認
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
