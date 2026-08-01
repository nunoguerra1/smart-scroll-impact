"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-organic-petroleum/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          Sua mente merece <br />
          <span className="text-organic-impact">mais que 15 segundos.</span>
        </h1>
        <p className="text-lg md:text-xl text-organic-petroleum/70 max-w-2xl mx-auto">
          Transforme o hábito de rolar o feed em conhecimento diário e impacto real na natureza.
        </p>
      </motion.div>

    </main>
  );
}