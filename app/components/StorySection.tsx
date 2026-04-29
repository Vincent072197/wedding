"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState({
    coupleNames: "宣 & 璇",
    heroText: "We decided on forever",
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

  const initials = config.coupleNames
    .split(" & ")
    .map((n) => n[0])
    .join(" & ")
    .toUpperCase();

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // DOORS ANIMATION (0 - 0.4)
  const leftDoorX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-100%"], {
    clamp: true,
  });
  const rightDoorX = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"], {
    clamp: true,
  });
  const doorShadowOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0], {
    clamp: true,
  });

  // EMBLEM ANIMATION
  const emblemOpacity = useTransform(scrollYProgress, [0.05, 0.15], [1, 0], {
    clamp: true,
  });
  const emblemVisibility = useTransform(
    scrollYProgress,
    [0.15, 0.16],
    ["flex", "none"],
    { clamp: true },
  );
  const emblemScale = useTransform(scrollYProgress, [0.0, 0.15], [1, 1.2], {
    clamp: true,
  });

  // couple illustration REVEAL (0.3 - 0.7)
  const contentOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.5, 1.0],
    [0, 1, 1],
  );
  const contentScale = useTransform(scrollYProgress, [0.15, 0.5], [0.3, 1], {
    clamp: true,
  });
  const contentY = useTransform(scrollYProgress, [0.5, 1.0], [0, -80], {
    clamp: true,
  });

  // COUNTDOWN ANIMATION (0.7 - 1.0)
  const countdownOpacity = useTransform(scrollYProgress, [0.7, 1.0], [0, 1], {
    clamp: true,
  });
  const countdownY = useTransform(scrollYProgress, [0.7, 1.0], [100, 80], {
    clamp: true,
  });

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#fffafa]"
    >
      {/* Sticky Frame */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {/* BEHIND THE DOORS (The Reveal Content) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-10"
          style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
        >
          {/* Placeholder for Couple Illustration */}
          <div className="w-48 h-48 md:w-84 md:h-84 bg-transparent rounded-full flex items-center justify-center mb-8 relative overflow-hidden">
            <Image
              src="/image1.png"
              className="object-cover"
              alt="Couple Illustration"
              fill
              priority
            />
          </div>

          <div className="text-center px-4">
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
            {/* 教堂感鑲板設計 */}
            <div className="absolute inset-y-10 left-10 right-4 border-2 border-stone-200 rounded-t-full opacity-40"></div>
            <div className="absolute top-20 left-16 right-10 bottom-20 border border-stone-200 rounded-t-full opacity-30 shadow-inner"></div>

            {/* 金色裝飾線 */}
            <div className="absolute top-1/4 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-amber-200 to-transparent opacity-60"></div>

            {/* 左門把手 (圓形金屬) */}
            <div className="mr-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 shadow-lg border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/30"></div>
            </div>

            <motion.div
              style={{ opacity: doorShadowOpacity }}
              className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-stone-300/40 to-transparent"
            ></motion.div>
          </motion.div>

          {/* Right Door */}
          <motion.div
            className="h-full w-1/2 bg-[#fdfcfb] border-l border-stone-300 flex justify-start items-center relative shadow-[inset_10px_0_30px_rgba(0,0,0,0.05)]"
            style={{ x: rightDoorX }}
          >
            {/* 教堂感鑲板設計 */}
            <div className="absolute inset-y-10 right-10 left-4 border-2 border-stone-200 rounded-t-full opacity-40"></div>
            <div className="absolute top-20 right-16 left-10 bottom-20 border border-stone-200 rounded-t-full opacity-30 shadow-inner"></div>

            {/* 金色裝飾線 */}
            <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-amber-200 to-transparent opacity-60"></div>

            {/* 右門把手 (圓形金屬) */}
            <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-600 shadow-lg border-2 border-white flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border border-white/30"></div>
            </div>

            <motion.div
              style={{ opacity: doorShadowOpacity }}
              className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-300/40 to-transparent"
            ></motion.div>
          </motion.div>
        </motion.div>

        {/* THE EMBLEM (Sits on top of closed doors) */}
        <motion.div
          className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
          style={{
            opacity: emblemOpacity,
            scale: emblemScale,
            display: emblemVisibility,
          }}
        >
          {/* <div className="w-24 h-24 md:w-32 md:h-32 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
            <span className="font-serif text-2xl md:text-4xl italic">
              {initials}
            </span>
          </div> */}
          {/* <p className="mt-8 font-sans tracking-widest text-stone-500 text-xs md:text-sm uppercase bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">
           
          </p> */}
        </motion.div>
      </div>
    </motion.div>
  );
}
