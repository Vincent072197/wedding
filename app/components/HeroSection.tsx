"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"
          alt="Romantic couple"
          fill
          className="object-cover opacity-70"
          priority
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-50/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-primary font-sans tracking-[0.2em] uppercase text-sm mb-6"
        >
          We are getting married
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-serif text-6xl md:text-8xl text-foreground mb-4"
        >
          Vincent &amp; Sister
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-serif text-xl md:text-2xl italic text-foreground/80 mt-4"
        >
          Save the Date
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 border-t border-b border-primary/30 py-4 px-8"
        >
          <p className="font-sans tracking-widest text-lg">DECEMBER 31, 2026</p>
        </motion.div>
      </div>
    </section>
  );
}
