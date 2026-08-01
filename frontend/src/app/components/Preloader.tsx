"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const customEase = [0.76, 0, 0.24, 1];

    useEffect(() => {
        let count = 0;
        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 20) + 5;
            if (count >= 100) {
                setCounter(100);
                setTimeout(() => setLoading(false), 500);
                clearInterval(interval);
            } else {
                setCounter(count);
            }
        }, 40);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="preloader"
                    exit={{ height: 0, transition: { duration: 1.2, ease: customEase } }}
                    className="fixed top-0 left-0 w-full h-screen z-[100] bg-[#6A1A28] flex flex-col items-center justify-center overflow-hidden"
                >
                    <motion.div exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }} className="relative flex flex-col items-center">
                        <div className="text-[#EBE6DF] text-[18vw] md:text-[12vw] font-black tracking-tighter leading-none">{counter}%</div>
                        <div className="uppercase tracking-[0.4em] text-xs font-semibold text-[#EBE6DF]/70 mt-2">Iniciando a desconexão</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}