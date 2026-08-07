"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PlaySquare, ChevronLeft, ChevronRight, Clock, Lightbulb, Brain, Compass, Loader2 } from "lucide-react";

const getCardStyleInfo = (item: any) => {
    const tags = item.tags || [];
    if (tags.includes("video")) {
        return { icon: PlaySquare, color: "from-[#4A3B2C] to-[#1a140f]" };
    }

    switch (item.category) {
        case "Tecnologia":
            return { icon: Lightbulb, color: "from-[#1A2C4A] to-[#0a121f]" };
        case "Saúde & Bem-Estar":
            return { icon: Brain, color: "from-[#2C4A3B] to-[#101d17]" };
        case "Cultura & História":
            return { icon: Sparkles, color: "from-[#6A1A28] to-[#26070d]" };
        default:
            return { icon: Compass, color: "from-[#1A1A1A] to-[#050505]" };
    }
};

export default function BentoGrid() {
    const [cards, setCards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://impact-scroll-backend.onrender.com';

                const response = await fetch(`${API_URL}/api/v1/content/feed`);
                if (!response.ok) throw new Error("Erro na rede");

                const data = await response.json();

                const items = data.items || data || [];
                const shuffledItems = [...items].sort(() => 0.5 - Math.random());

                setCards(shuffledItems.slice(0, 6));
            } catch (error) {
                console.error("Falha ao carregar o feed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeed();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const getCardVariants = (index: number) => {
        const diff = (index - currentIndex + cards.length) % cards.length;

        if (diff === 0) return "center";
        if (diff === 1 || diff === -(cards.length - 1)) return "right";
        if (diff === cards.length - 1 || diff === -1) return "left";
        return "hidden";
    };

    const variants = {
        center: { x: 0, y: 0, scale: 1, zIndex: 30, rotateY: 0, opacity: 1, filter: "brightness(100%) blur(0px)" },
        left: { x: "-65%", y: 0, scale: 0.85, zIndex: 20, rotateY: 15, opacity: 0.4, filter: "brightness(40%) blur(3px)" },
        right: { x: "65%", y: 0, scale: 0.85, zIndex: 20, rotateY: -15, opacity: 0.4, filter: "brightness(40%) blur(3px)" },
        hidden: { x: 0, y: 0, scale: 0.5, zIndex: 10, rotateY: 0, opacity: 0, filter: "brightness(20%) blur(5px)" }
    };

    return (
        <section className="relative w-full py-32 bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden font-sans">

            <div className="text-center mb-16 z-40 px-4">
                <h2 className="text-sm md:text-base font-mono text-[#6A1A28] font-bold tracking-widest uppercase mb-4">
                    Curadoria Neural
                </h2>
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EBE6DF] max-w-2xl mx-auto leading-none">
                    Uma amostra do seu novo feed
                </h3>
            </div>

            <div className="relative w-full max-w-5xl h-[420px] flex items-center justify-center" style={{ perspective: "1500px" }}>

                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center text-[#EBE6DF]/50"
                    >
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#6A1A28]" />
                        <span className="font-mono text-xs tracking-widest uppercase">Sintetizando Conhecimento...</span>
                    </motion.div>
                ) : (
                    <AnimatePresence initial={false}>
                        {cards.map((card, index) => {
                            const position = getCardVariants(index);
                            const { icon: Icon, color } = getCardStyleInfo(card);
                            const readingTime = Math.ceil(card.estimatedReadingTimeSeconds / 60);

                            return (
                                <motion.div
                                    key={card.id || index}
                                    className={`absolute w-[300px] h-[400px] md:w-[340px] md:h-[440px] rounded-[2rem] p-7 flex flex-col justify-between shadow-2xl bg-gradient-to-br ${color} border border-white/10 cursor-pointer overflow-hidden`}
                                    variants={variants}
                                    initial="hidden"
                                    animate={position}
                                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                                    onClick={() => position !== "center" && setCurrentIndex(index)}
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 blur-3xl rounded-full pointer-events-none" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-[#EBE6DF]">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#EBE6DF]/70">
                                                {card.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[#EBE6DF]/70">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-mono font-bold">{readingTime}m</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mb-2">
                                        <h4 className="text-2xl font-black text-[#EBE6DF] leading-[1.1] mb-4 line-clamp-3">
                                            {card.title.replace('▶️ ', '')}
                                        </h4>
                                        <p className="text-sm font-medium text-[#EBE6DF]/60 leading-relaxed line-clamp-3">
                                            {card.summary}
                                        </p>
                                    </div>

                                    <div className="relative z-10 w-full h-1 bg-black/40 rounded-full overflow-hidden mt-4">
                                        <div className="w-1/3 h-full bg-[#EBE6DF]/50 rounded-full" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {!isLoading && cards.length > 0 && (
                <div className="flex items-center gap-8 mt-12 z-40">
                    <button onClick={handlePrev} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#EBE6DF] hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex gap-2.5">
                        {cards.map((_, idx) => (
                            <div key={idx} className={`h-2 rounded-full transition-all duration-500 ease-out ${idx === currentIndex ? "bg-[#6A1A28] w-8" : "bg-white/20 w-2"}`} />
                        ))}
                    </div>

                    <button onClick={handleNext} className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-[#EBE6DF] hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}

        </section>
    );
}