"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CountdownTimer from "./CountdownTimer";

function Flower({
  size = 28,
  color = "#fda4af",
  opacity = 0.8,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ opacity }}>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <ellipse
          key={i}
          cx="14"
          cy="7"
          rx="3.5"
          ry="7"
          fill={color}
          transform={`rotate(${angle} 14 14)`}
        />
      ))}
      <circle cx="14" cy="14" r="5" fill="#fce7f3" />
      <circle cx="14" cy="14" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function Leaf({
  size = 18,
  flip = false,
  opacity = 0.65,
}: {
  size?: number;
  flip?: boolean;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 18 24"
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path d="M9,23 C9,23 1,13 3,5 C5,-1 17,2 17,11 C17,18 9,23 9,23Z" fill="#86efac" />
      <line x1="9" y1="23" x2="12" y2="5" stroke="#4ade80" strokeWidth="0.7" />
    </svg>
  );
}

const PETALS = [
  { left: 5,  delay: 0,   duration: 5.5 },
  { left: 15, delay: 1.8, duration: 4.8 },
  { left: 25, delay: 0.6, duration: 6.0 },
  { left: 38, delay: 2.4, duration: 5.2 },
  { left: 53, delay: 0.2, duration: 4.5 },
  { left: 64, delay: 1.5, duration: 5.8 },
  { left: 75, delay: 3.0, duration: 4.9 },
  { left: 84, delay: 0.9, duration: 6.1 },
  { left: 92, delay: 2.1, duration: 5.3 },
  { left: 46, delay: 3.5, duration: 4.7 },
];

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState({
    coupleNames: "",
    heroText: "",
  });

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.home?.coupleNames) {
          setConfig({
            coupleNames: data.home.coupleNames,
            heroText: data.home.heroText || config.heroText,
          });
        }
      })
      .catch(console.error);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // DOORS ANIMATION (0 - 0.4)
  const leftDoorX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-100%"], { clamp: true });
  const rightDoorX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"], { clamp: true });
  const doorShadowOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0], { clamp: true });

  // EMBLEM ANIMATION
  const emblemOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0], { clamp: true });
  const emblemVisibility = useTransform(scrollYProgress, [0.15, 0.16], ["flex", "none"], { clamp: true });
  const emblemScale = useTransform(scrollYProgress, [0.0, 0.15], [1, 1.2], { clamp: true });

  // CONTENT REVEAL (0.15 - 0.5)
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.5, 1.0], [0, 1, 1]);
  const contentScale = useTransform(scrollYProgress, [0.15, 0.5], [0.3, 1], { clamp: true });
  const contentY = useTransform(scrollYProgress, [0.5, 1.0], [0, -80], { clamp: true });

  // COUNTDOWN ANIMATION (0.7 - 1.0)
  const countdownOpacity = useTransform(scrollYProgress, [0.7, 1.0], [0, 1], { clamp: true });
  const countdownY = useTransform(scrollYProgress, [0.7, 1.0], [100, 80], { clamp: true });

  return (
    <motion.div ref={containerRef} className="relative w-full h-[300vh] bg-[#fffafa]">
      {/* Sticky Frame */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">

        {/* BEHIND THE DOORS (The Reveal Content) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10"
          style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
        >
          {/* === WEDDING BACKGROUND SCENE === */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sky gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-pink-50/70 to-rose-50/30" />

            {/* Soft golden sun haze near horizon */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl" />
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-yellow-50/80 blur-2xl" />

            {/* Wedding aisle path — perspective trapezoid */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: "55%",
                height: "65%",
                background:
                  "linear-gradient(to top, rgba(255,252,248,0.96), rgba(255,252,248,0.5) 55%, transparent)",
                clipPath: "polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)",
              }}
            />

            {/* Arch SVG curve connecting the two garlands */}
            <svg
              className="absolute top-0 left-0 w-full"
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              style={{ height: "38%" }}
            >
              <path d="M3,55 C20,5 80,5 97,55" stroke="#fda4af" strokeWidth="0.5" fill="none" opacity="0.55" />
              <path d="M8,58 C25,12 75,12 92,58" stroke="#fda4af" strokeWidth="0.3" fill="none" opacity="0.35" />
            </svg>

            {/* Left floral garland */}
            <div className="absolute top-4 left-2 flex flex-col items-center gap-1">
              <Flower size={32} color="#fda4af" opacity={0.75} />
              <Leaf size={16} opacity={0.6} />
              <Flower size={24} color="#f9a8d4" opacity={0.65} />
              <Leaf size={14} flip opacity={0.55} />
              <Flower size={28} color="#fecdd3" opacity={0.7} />
              <Leaf size={18} opacity={0.6} />
              <Flower size={20} color="#fda4af" opacity={0.6} />
              <Leaf size={14} flip opacity={0.5} />
              <Flower size={26} color="#f9a8d4" opacity={0.65} />
              <Leaf size={16} opacity={0.55} />
            </div>

            {/* Right floral garland */}
            <div className="absolute top-4 right-2 flex flex-col items-center gap-1">
              <Flower size={32} color="#fda4af" opacity={0.75} />
              <Leaf size={16} flip opacity={0.6} />
              <Flower size={24} color="#f9a8d4" opacity={0.65} />
              <Leaf size={14} opacity={0.55} />
              <Flower size={28} color="#fecdd3" opacity={0.7} />
              <Leaf size={18} flip opacity={0.6} />
              <Flower size={20} color="#fda4af" opacity={0.6} />
              <Leaf size={14} opacity={0.5} />
              <Flower size={26} color="#f9a8d4" opacity={0.65} />
              <Leaf size={16} flip opacity={0.55} />
            </div>

            {/* Falling rose petals */}
            {PETALS.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${p.left}%`,
                  top: 0,
                  animation: `petalFall ${p.duration}s ${p.delay}s linear infinite`,
                }}
              >
                <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
                  <ellipse cx="5" cy="7" rx="4.5" ry="6" fill="#fda4af" opacity="0.7" transform="rotate(-20 5 7)" />
                </svg>
              </div>
            ))}
          </div>

          {/* Couple Illustration */}
          <div className="w-48 h-48 md:w-84 md:h-84 bg-transparent rounded-full flex items-center justify-center mb-8 relative z-10 overflow-hidden">
            <Image
              src="/image1.png"
              className="object-cover"
              alt="Couple Illustration"
              fill
              priority
            />
          </div>

          <div className="relative z-10 text-center px-4">
            <p className="text-primary font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
              {config.heroText}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl text-stone-800 mb-6 drop-shadow-sm">
              {config.coupleNames}
            </h1>
          </div>
        </motion.div>

        {/* COUNTDOWN TIMER */}
        <motion.div
          className="absolute bottom-10 md:bottom-20 w-full z-20 pointer-events-none flex justify-center"
          style={{ opacity: countdownOpacity, y: countdownY }}
        >
          <div className="pointer-events-auto">
            <CountdownTimer />
          </div>
        </motion.div>

        {/* THE DOORS (Foreground) */}
        <motion.div className="absolute inset-0 z-20 pointer-events-none flex">
          {/* Left Door */}
          <motion.div
            className="h-full w-1/2 bg-[#fdfcfb] border-r border-stone-300 flex justify-end items-center relative shadow-[inset_-10px_0_30px_rgba(0,0,0,0.05)]"
            style={{ x: leftDoorX }}
          >
            <div className="absolute inset-y-10 left-10 right-4 border-2 border-stone-200 rounded-t-full opacity-40"></div>
            <div className="absolute top-20 left-16 right-10 bottom-20 border border-stone-200 rounded-t-full opacity-30 shadow-inner"></div>
            <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-amber-200 to-transparent opacity-60"></div>
            <div className="mr-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 shadow-lg border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/30"></div>
            </div>
            <motion.div
              style={{ opacity: doorShadowOpacity }}
              className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-300/40 to-transparent"
            />
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="h-full w-1/2 bg-[#fdfcfb] border-l border-stone-300 flex justify-start items-center relative shadow-[inset_10px_0_30px_rgba(0,0,0,0.05)]"
            style={{ x: rightDoorX }}
          >
            <div className="absolute inset-y-10 right-10 left-4 border-2 border-stone-200 rounded-t-full opacity-40"></div>
            <div className="absolute top-20 right-16 left-10 bottom-20 border border-stone-200 rounded-t-full opacity-30 shadow-inner"></div>
            <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-amber-200 to-transparent opacity-60"></div>
            <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 shadow-lg border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/30"></div>
            </div>
            <motion.div
              style={{ opacity: doorShadowOpacity }}
              className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-300/40 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* THE EMBLEM */}
        <motion.div
          className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
          style={{
            opacity: emblemOpacity,
            scale: emblemScale,
            display: emblemVisibility,
          }}
        />
      </div>
    </motion.div>
  );
}
