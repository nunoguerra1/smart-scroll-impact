"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Flame,
    Award,
    TreePine,
    Bookmark,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Clock,
    Zap,
    Hourglass,
} from "lucide-react";
import { api } from "../../lib/api";

interface ContentItem {
    id: string;
    title: string;
    summary: string;
    category: string;
    estimatedReadTime: number;
    author?: string;
    reelsEquivalent: number;
}

export default function FeedPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [readCompleted, setReadCompleted] = useState<Record<string, boolean>>({});
    const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
    const [direction, setDirection] = useState<"up" | "down">("down");
    const [pointsToast, setPointsToast] = useState<number | null>(null);

    const [secondsLeft, setSecondsLeft] = useState<number>(5);
    const cardStartTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        setSecondsLeft(5);
        cardStartTimeRef.current = Date.now();

        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const fetchInitialData = async () => {
        try {
            try {
                const feedRes = await api.get("/feed?limit=15");
                if (feedRes.data?.items) {
                    setItems(feedRes.data.items);
                } else if (Array.isArray(feedRes.data)) {
                    setItems(feedRes.data);
                }
            } catch (feedErr) {
                console.error("⚠️ Erro ao carregar pílulas do Feed:", feedErr);
            }

            try {
                const statsRes = await api.get("/gamification/stats");
                if (statsRes.data) {
                    setUserStats(statsRes.data);
                }
            } catch (statsErr) {
                console.warn("⚠️ [Gamification] Erro ao carregar stats.");
                setUserStats({ streakCount: 0, pointsBalance: 0, treesPlantedCount: 0 });
            }

        } catch (err) {
            console.error("Erro geral no carregamento do feed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = useCallback(() => {
        if (currentIndex < items.length - 1) {
            setDirection("down");
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, items.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setDirection("up");
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown" || e.key === "PageDown") handleNext();
            if (e.key === "ArrowUp" || e.key === "PageUp") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    const handleMarkAsRead = async (contentId: string) => {
        if (readCompleted[contentId] || secondsLeft > 0) return;

        const elapsedSeconds = Math.floor((Date.now() - cardStartTimeRef.current) / 1000);
        const timeSpentSeconds = Math.max(5, elapsedSeconds);

        const payload = {
            contentId: String(contentId),
            timeSpentSeconds,
        };

        try {
            const res = await api.post("/gamification/read", payload);
            const earned = res.data?.pointsEarned || 15;

            setReadCompleted((prev) => ({ ...prev, [contentId]: true }));
            setPointsToast(earned);
            setTimeout(() => setPointsToast(null), 3000);

            setUserStats((prev: any) => ({
                ...prev,
                pointsBalance: (prev?.pointsBalance || 0) + earned,
                streakCount: res.data?.streakCount ?? (prev?.streakCount || 1),
                treesPlantedCount: Math.floor(((prev?.pointsBalance || 0) + earned) / 100),
            }));
        } catch (err) {
            console.error("Erro ao registrar leitura:", err);

            const fallbackPoints = 15;
            setReadCompleted((prev) => ({ ...prev, [contentId]: true }));
            setPointsToast(fallbackPoints);
            setTimeout(() => setPointsToast(null), 3000);

            setUserStats((prev: any) => ({
                ...prev,
                pointsBalance: (prev?.pointsBalance || 0) + fallbackPoints,
            }));
        }
    };

    const handleToggleBookmark = async (contentId: string) => {
        try {
            const res = await api.post(`/bookmarks/toggle/${contentId}`);
            setBookmarked((prev) => ({ ...prev, [contentId]: res.data?.bookmarked ?? !prev[contentId] }));
        } catch (err) {
            console.error("Erro ao favoritar pílula:", err);
            setBookmarked((prev) => ({ ...prev, [contentId]: !prev[contentId] }));
        }
    };

    const currentItem = items[currentIndex];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EBE6DF] flex flex-col items-center justify-center p-6 text-[#1A1A1A]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-2 border-[#6A1A28] border-t-transparent rounded-full mb-6"
                />
                <p className="font-mono text-xs uppercase tracking-widest text-[#6A1A28] font-bold">
                    CARREGANDO ACERVO DE CONHECIMENTO...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EBE6DF] text-[#1A1A1A] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-[#6A1A28] selection:text-[#EBE6DF]">

            <AnimatePresence>
                {pointsToast !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#6A1A28] text-[#EBE6DF] px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-[#EBE6DF]/20"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>+{pointsToast} PONTOS ADQUIRIDOS!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="max-w-xl mx-auto w-full bg-[#EBE6DF]/80 backdrop-blur-xl border border-[#1A1A1A]/15 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-mono font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>{userStats?.streakCount || 0} D</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#6A1A28]/10 border border-[#6A1A28]/20 text-[#6A1A28] text-xs font-mono font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>{userStats?.pointsBalance || 0} PTS</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                    <TreePine className="w-4 h-4 text-emerald-700" />
                    <span>{userStats?.treesPlantedCount || 0} ÁRVO</span>
                </div>
            </header>

            <main className="max-w-xl mx-auto w-full my-auto py-6 z-10 flex-1 flex flex-col justify-center">
                {currentItem ? (
                    <div className="relative">

                        <div className="w-full bg-[#1A1A1A]/10 h-1 rounded-full mb-3 overflow-hidden">
                            <motion.div
                                className="bg-[#6A1A28] h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.article
                                key={currentItem.id}
                                initial={{
                                    opacity: 0,
                                    y: direction === "down" ? 60 : -60,
                                    scale: 0.95,
                                }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    y: direction === "down" ? -60 : 60,
                                    scale: 0.95,
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-[#EBE6DF] border border-[#1A1A1A]/20 p-6 sm:p-8 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] relative flex flex-col justify-between min-h-[460px]"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="px-3.5 py-1.5 rounded-full border border-[#6A1A28]/30 bg-[#6A1A28]/5 text-[#6A1A28] text-[10px] font-mono font-bold uppercase tracking-widest">
                                            {currentItem.category}
                                        </span>

                                        <div className="flex items-center gap-1.5 text-xs font-mono text-[#1A1A1A]/60">
                                            <Clock className="w-3.5 h-3.5 text-[#6A1A28]" />
                                            <span>{currentItem.estimatedReadTime} MIN LEITURA</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] leading-[1.1] mb-6">
                                        {currentItem.title}
                                    </h2>

                                    <p className="text-base sm:text-lg text-[#1A1A1A]/80 font-sans leading-relaxed">
                                        {currentItem.summary}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 space-y-4">

                                    <div className="flex items-center justify-between text-xs font-mono text-[#1A1A1A]/60 bg-[#1A1A1A]/5 p-3 rounded-2xl border border-[#1A1A1A]/10">
                                        <span className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-600" /> IMPACTO ESTIMADO
                                        </span>
                                        <span className="font-bold text-[#6A1A28]">
                                            -{currentItem.reelsEquivalent || 3} REELS EVITADOS
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-2">

                                        <button
                                            onClick={() => handleToggleBookmark(currentItem.id)}
                                            className={`p-4 rounded-2xl border transition-all duration-300 ${bookmarked[currentItem.id]
                                                ? "bg-[#6A1A28] text-[#EBE6DF] border-[#6A1A28]"
                                                : "bg-white/50 border-[#1A1A1A]/15 text-[#1A1A1A]/70 hover:bg-white hover:text-[#1A1A1A]"
                                                }`}
                                            title="Salvar na Biblioteca"
                                        >
                                            <Bookmark className="w-5 h-5 fill-current" />
                                        </button>

                                        <button
                                            onClick={() => handleMarkAsRead(currentItem.id)}
                                            disabled={readCompleted[currentItem.id] || secondsLeft > 0}
                                            className={`flex-1 py-4 px-6 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 ${readCompleted[currentItem.id]
                                                ? "bg-emerald-800 text-emerald-100 cursor-default"
                                                : secondsLeft > 0
                                                    ? "bg-[#1A1A1A]/20 text-[#1A1A1A]/50 cursor-not-allowed border border-[#1A1A1A]/10"
                                                    : "bg-[#6A1A28] text-[#EBE6DF] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#6A1A28]/20"
                                                }`}
                                        >
                                            {readCompleted[currentItem.id] ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>CONCLUÍDO (+15 PTS)</span>
                                                </>
                                            ) : secondsLeft > 0 ? (
                                                <>
                                                    <Hourglass className="w-4 h-4 animate-spin text-[#6A1A28]" />
                                                    <span>AGUARDE LEITURA ({secondsLeft}S)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>MARCAR LEITURA</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-[#1A1A1A]/20 rounded-3xl p-8">
                        <Sparkles className="w-10 h-10 text-[#6A1A28] mx-auto mb-4" />
                        <h3 className="text-xl font-black uppercase text-[#1A1A1A] mb-2">
                            FIM DAS PÍLULAS POR HOJE
                        </h3>
                        <p className="text-sm font-sans text-[#1A1A1A]/70 max-w-sm mx-auto">
                            Você consumiu todas as pílulas ativas. Volte mais tarde para expandir ainda mais seu repertório.
                        </p>
                    </div>
                )}
            </main>

            <footer className="max-w-xl mx-auto w-full z-20 flex items-center justify-between gap-4">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="flex-1 py-4 rounded-2xl bg-white/60 border border-[#1A1A1A]/15 font-mono text-xs font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-white transition-all"
                >
                    <ChevronUp className="w-4 h-4" /> ANTERIOR
                </button>

                <span className="font-mono text-xs font-bold text-[#1A1A1A]/40 tracking-widest">
                    {items.length > 0 ? currentIndex + 1 : 0} // {items.length}
                </span>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === items.length - 1 || items.length === 0}
                    className="flex-1 py-4 rounded-2xl bg-[#1A1A1A] text-[#EBE6DF] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-[#2A2A2A] transition-all"
                >
                    PRÓXIMA <ChevronDown className="w-4 h-4" />
                </button>
            </footer>
        </div>
    );
}