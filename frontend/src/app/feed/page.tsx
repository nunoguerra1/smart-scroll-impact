"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { motion as motionComponent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Flame,
    Award,
    TreePine,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Clock,
    Zap,
    Hourglass,
    Search,
    Loader2,
    Video,
    Headphones,
    Newspaper,
    Lightbulb,
    ExternalLink,
    Play,
    Bookmark,
    LayoutDashboard,
} from "lucide-react";
import { api } from "../../lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type ContentType = "microlearning" | "video" | "podcast" | "news";

interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    summary: string;
    category: string;
    estimatedReadTime?: number;
    reelsEquivalent?: number;
    mediaUrl?: string;
    embedUrl?: string;
    sourceOrCreator?: string;
    tags?: string[];
}

function FeedContent() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<ContentType>("microlearning");

    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTopic, setSearchTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const [readCompleted, setReadCompleted] = useState<Record<string, boolean>>({});
    const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});
    const [direction, setDirection] = useState<"up" | "down">("down");

    const [pointsToast, setPointsToast] = useState<number | null>(null);
    const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

    const [secondsLeft, setSecondsLeft] = useState<number>(5);
    const cardStartTimeRef = useRef<number>(Date.now());

    const normalizeItem = (item: any, forcedType?: string): ContentItem => {
        let detectedType = forcedType || "microlearning";

        if (item.tags && Array.isArray(item.tags)) {
            if (item.tags.includes("video")) detectedType = "video";
            else if (item.tags.includes("podcast")) detectedType = "podcast";
            else if (item.tags.includes("news") || item.tags.includes("noticias")) detectedType = "news";
            else if (item.tags.includes("microlearning")) detectedType = "microlearning";
        }

        let rawType = item.type === "noticias" ? "news" : item.type;
        const finalType: ContentType = (rawType as ContentType) || (detectedType as ContentType);
        const query = encodeURIComponent(item.searchKeyword || item.title || item.topic || "");

        let embedUrl = item.embedUrl;
        let mediaUrl = item.mediaUrl;

        if (finalType === "video") {
            embedUrl = embedUrl || `https://www.youtube-nocookie.com/embed?listType=search&list=${query}`;
            mediaUrl = mediaUrl || `https://www.youtube.com/results?search_query=${query}`;
        } else if (finalType === "podcast") {
            embedUrl = embedUrl || `https://www.youtube-nocookie.com/embed?listType=search&list=${query}%20podcast`;
            mediaUrl = mediaUrl || `https://open.spotify.com/search/${query}`;
        } else if (finalType === "news") {
            mediaUrl = mediaUrl || `https://news.google.com/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
        }

        return {
            ...item,
            id: item.id || `gen-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type: finalType,
            embedUrl,
            mediaUrl,
        };
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (tokenFromUrl) {
            localStorage.setItem("smart_scroll_token", tokenFromUrl);
            Cookies.set("smart_scroll_token", tokenFromUrl, { expires: 7, path: "/" });
            router.replace("/feed");
        }
    }, [searchParams, router]);

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
    }, [currentIndex, activeTab]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const statsRes = await api.get("/gamification/stats");
            if (statsRes.data) setUserStats(statsRes.data);
        } catch (err) {
            console.error("Erro ao carregar estatísticas:", err);
        }

        try {
            const feedRes = await api.get("/feed?limit=20");
            const rawItems = feedRes.data?.items || (Array.isArray(feedRes.data) ? feedRes.data : []);

            const normalizedItems = rawItems.map((item: any) => normalizeItem(item));
            setItems(normalizedItems);
        } catch (err) {
            console.error("Erro no carregamento do feed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAI = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const cleanTopic = searchTopic.trim();
        if (!cleanTopic || isGenerating) return;

        setIsGenerating(true);

        try {
            const response = await api.post("/gemini/generate", {
                topic: cleanTopic,
                type: activeTab,
                count: 3,
            });

            const newCards = response.data;

            if (Array.isArray(newCards) && newCards.length > 0) {
                const normalizedNewCards = newCards.map((card: any) => normalizeItem(card, activeTab));

                setItems((prevItems) => [...normalizedNewCards, ...prevItems]);
                setCurrentIndex(0);
                setSearchTopic("");
            }
        } catch (err) {
            console.error("Erro ao gerar conteúdo:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleMarkAsRead = async (contentId: string) => {
        if (readCompleted[contentId] || secondsLeft > 0) return;
        const elapsedSeconds = Math.floor((Date.now() - cardStartTimeRef.current) / 1000);

        try {
            const res = await api.post("/gamification/read", {
                contentId: contentId,
                timeSpentSeconds: Math.max(5, elapsedSeconds),
            });

            const earned = res.data?.pointsEarned || 15;
            setReadCompleted((prev) => ({ ...prev, [contentId]: true }));
            setPointsToast(earned);
            setTimeout(() => setPointsToast(null), 3000);

            setUserStats((prev: any) => {
                const newPoints = res.data?.pointsBalance ?? ((prev?.pointsBalance || 0) + earned);
                return {
                    ...prev,
                    pointsBalance: newPoints,
                    streakCount: res.data?.streakCount ?? (prev?.streakCount || 1),
                    treesPlantedCount: res.data?.treesPlantedCount ?? Math.floor(newPoints / 100),
                };
            });
        } catch (err) {
            console.error("Erro ao registrar leitura no servidor:", err);
        }
    };

    const handleToggleBookmark = async (contentId: string) => {
        const isBookmarking = !bookmarkedItems[contentId];

        setBookmarkedItems((prev) => ({
            ...prev,
            [contentId]: isBookmarking,
        }));

        try {
            await api.post(`/bookmarks/toggle/${contentId}`, currentItem);

            if (isBookmarking) {
                setBookmarkToast("Conteúdo salvo na biblioteca!");
                setTimeout(() => setBookmarkToast(null), 3000);
            }
        } catch (error) {
            setBookmarkedItems((prev) => ({
                ...prev,
                [contentId]: !isBookmarking,
            }));
            console.error("Erro ao favoritar item:", error);
        }
    };

    const filteredItems = items.filter((item) => item.type === activeTab);
    const currentItem = filteredItems[currentIndex];

    return (
        <div className="min-h-screen bg-[#EBE6DF] text-[#1A1A1A] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
            <AnimatePresence>
                {pointsToast !== null && (
                    <motionComponent.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#6A1A28] text-[#EBE6DF] px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>+{pointsToast} PONTOS ADQUIRIDOS!</span>
                    </motionComponent.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {bookmarkToast !== null && (
                    <motionComponent.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-emerald-100 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-2"
                    >
                        <Bookmark className="w-4 h-4 fill-current text-emerald-300" />
                        <span>{bookmarkToast}</span>
                    </motionComponent.div>
                )}
            </AnimatePresence>

            <div className="max-w-2xl mx-auto w-full z-20 space-y-4">
                <header className="bg-[#EBE6DF]/80 backdrop-blur-xl border border-[#1A1A1A]/15 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-mono font-bold uppercase">
                            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                            <span>{userStats?.streakCount || 0} D</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#6A1A28]/10 border border-[#6A1A28]/20 text-[#6A1A28] text-xs font-mono font-bold uppercase">
                            <Award className="w-4 h-4" />
                            <span>{userStats?.pointsBalance || 0} PTS</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-800 text-xs font-mono font-bold uppercase">
                            <TreePine className="w-4 h-4 text-emerald-700" />
                            <span>{userStats?.treesPlantedCount || 0} ÁRVO</span>
                        </div>
                    </div>

                    <Link
                        href="/dashboard"
                        prefetch={false}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] text-[#EBE6DF] hover:bg-[#6A1A28] text-xs font-mono font-bold uppercase transition-colors shrink-0 shadow-sm"
                        title="Ir para o Dashboard"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                </header>

                <form onSubmit={handleGenerateAI} className="relative flex items-center">
                    <div className="absolute left-4 text-[#1A1A1A]/40">
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </div>
                    <input
                        type="text"
                        placeholder={`Pesquisar ${activeTab === "microlearning" ? "pílula" : activeTab} com IA...`}
                        value={searchTopic}
                        onChange={(e) => setSearchTopic(e.target.value)}
                        className="w-full bg-white/70 border border-[#1A1A1A]/15 rounded-2xl py-3.5 pl-12 pr-24 font-sans font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#6A1A28]/20 transition-all shadow-sm text-sm"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={!searchTopic.trim() || isGenerating}
                        className="absolute right-2 top-2 bottom-2 bg-[#1A1A1A] text-[#EBE6DF] px-4 rounded-xl text-xs font-mono font-bold uppercase disabled:opacity-50 hover:bg-[#2A2A2A] transition-all"
                    >
                        Gerar
                    </button>
                </form>

                <div className="flex items-center justify-between gap-1 bg-white/40 p-1.5 rounded-2xl border border-[#1A1A1A]/10 text-xs font-mono font-bold">
                    <button
                        onClick={() => {
                            setActiveTab("microlearning");
                            setCurrentIndex(0);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${activeTab === "microlearning"
                            ? "bg-[#6A1A28] text-white shadow-md"
                            : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                            }`}
                    >
                        <Lightbulb className="w-4 h-4" />
                        <span className="hidden sm:inline">PÍLULAS</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("video");
                            setCurrentIndex(0);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${activeTab === "video" ? "bg-[#6A1A28] text-white shadow-md" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                            }`}
                    >
                        <Video className="w-4 h-4" />
                        <span className="hidden sm:inline">VÍDEOS</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("podcast");
                            setCurrentIndex(0);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${activeTab === "podcast" ? "bg-[#6A1A28] text-white shadow-md" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                            }`}
                    >
                        <Headphones className="w-4 h-4" />
                        <span className="hidden sm:inline">PODCASTS</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("news");
                            setCurrentIndex(0);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${activeTab === "news" ? "bg-[#6A1A28] text-white shadow-md" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                            }`}
                    >
                        <Newspaper className="w-4 h-4" />
                        <span className="hidden sm:inline">NOTÍCIAS</span>
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto w-full my-auto py-4 z-10 flex-1 flex flex-col justify-center">
                {currentItem ? (
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motionComponent.article
                                key={currentItem.id}
                                initial={{ opacity: 0, y: direction === "down" ? 40 : -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: direction === "down" ? -40 : 40 }}
                                transition={{ duration: 0.3 }}
                                className="bg-[#EBE6DF] border border-[#1A1A1A]/20 p-6 sm:p-8 rounded-3xl shadow-xl relative flex flex-col justify-between min-h-[440px]"
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full border border-[#1A1A1A]/10 bg-white/50 text-[#1A1A1A]/70 text-[10px] font-mono font-bold uppercase">
                                                {currentItem.category || "Geral"}
                                            </span>

                                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#1A1A1A]/60">
                                                <Clock className="w-3.5 h-3.5 text-[#6A1A28]" />
                                                <span>{currentItem.estimatedReadTime || 2} MIN</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleToggleBookmark(currentItem.id)}
                                            className="p-2 rounded-full bg-white/40 hover:bg-[#6A1A28]/10 transition-colors group"
                                            title="Salvar na Biblioteca"
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 transition-all ${bookmarkedItems[currentItem.id]
                                                    ? "fill-[#6A1A28] text-[#6A1A28]"
                                                    : "text-[#1A1A1A]/40 group-hover:text-[#6A1A28]"
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] leading-tight mb-3">
                                        {currentItem.title}
                                    </h2>

                                    {(currentItem.type === "video" || currentItem.type === "podcast") && currentItem.embedUrl && (
                                        <div className="my-4 aspect-video w-full rounded-2xl overflow-hidden border border-[#1A1A1A]/20 shadow-inner bg-black">
                                            <iframe
                                                src={currentItem.embedUrl}
                                                title={currentItem.title}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}

                                    <p className="text-base sm:text-lg text-[#1A1A1A]/80 font-sans leading-relaxed">
                                        {currentItem.summary}
                                    </p>

                                    {currentItem.mediaUrl && (
                                        <div className="mt-4">
                                            <a
                                                href={currentItem.mediaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#EBE6DF] bg-[#6A1A28] hover:bg-[#802032] transition-all px-4 py-2.5 rounded-xl shadow-sm border border-[#6A1A28]"
                                            >
                                                {currentItem.type === "video" && (
                                                    <>
                                                        <Video className="w-4 h-4 text-amber-300" />
                                                        <span>Abrir Vídeo no YouTube</span>
                                                    </>
                                                )}
                                                {currentItem.type === "podcast" && (
                                                    <>
                                                        <Headphones className="w-4 h-4 text-emerald-300" />
                                                        <span>Ouvir Podcast no Spotify / Fonte</span>
                                                    </>
                                                )}
                                                {currentItem.type === "news" && (
                                                    <>
                                                        <Newspaper className="w-4 h-4 text-sky-300" />
                                                        <span>Ler Notícia Completa na Fonte</span>
                                                    </>
                                                )}
                                                {currentItem.type === "microlearning" && (
                                                    <>
                                                        <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                                                        <span>Acessar Fonte Original</span>
                                                    </>
                                                )}
                                                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-mono text-[#1A1A1A]/60 bg-[#1A1A1A]/5 p-3 rounded-2xl">
                                        <span className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-600" /> IMPACTO ESTIMADO
                                        </span>
                                        <span className="font-bold text-[#6A1A28]">
                                            -{currentItem.reelsEquivalent || 3} REELS EVITADOS
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleMarkAsRead(currentItem.id)}
                                            disabled={readCompleted[currentItem.id] || secondsLeft > 0}
                                            className={`flex-1 py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${readCompleted[currentItem.id]
                                                ? "bg-emerald-800 text-emerald-100"
                                                : secondsLeft > 0
                                                    ? "bg-[#1A1A1A]/20 text-[#1A1A1A]/50 cursor-not-allowed"
                                                    : "bg-[#6A1A28] text-[#EBE6DF] hover:scale-[1.01]"
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
                                                    <span>AGUARDE ({secondsLeft}S)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>CONCLUIR CONTEÚDO</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motionComponent.article>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-[#1A1A1A]/20 rounded-3xl p-8 bg-white/20">
                        {loading ? (
                            <>
                                <Loader2 className="w-10 h-10 text-[#6A1A28] mx-auto mb-3 animate-spin" />
                                <h3 className="text-lg font-black uppercase text-[#1A1A1A] mb-1">
                                    CARREGANDO FEED...
                                </h3>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-10 h-10 text-[#6A1A28] mx-auto mb-3" />
                                <h3 className="text-lg font-black uppercase text-[#1A1A1A] mb-1">
                                    NENHUM ITEM EM {activeTab.toUpperCase()}
                                </h3>
                                <p className="text-xs font-sans text-[#1A1A1A]/70 max-w-sm mx-auto mb-4">
                                    Digite um assunto na busca acima para gerar itens nesta categoria com a IA.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </main>

            <footer className="max-w-2xl mx-auto w-full z-20 flex items-center justify-between gap-4">
                <button
                    onClick={() => {
                        setDirection("up");
                        setCurrentIndex((p) => Math.max(0, p - 1));
                    }}
                    disabled={currentIndex === 0}
                    className="flex-1 py-3.5 rounded-2xl bg-white/60 border border-[#1A1A1A]/15 font-mono text-xs font-bold uppercase text-[#1A1A1A] flex items-center justify-center gap-2 disabled:opacity-30"
                >
                    <ChevronUp className="w-4 h-4" /> ANTERIOR
                </button>

                <span className="font-mono text-xs font-bold text-[#1A1A1A]/50">
                    {filteredItems.length > 0 ? currentIndex + 1 : 0} / {filteredItems.length}
                </span>

                <button
                    onClick={() => {
                        setDirection("down");
                        setCurrentIndex((p) => Math.min(filteredItems.length - 1, p + 1));
                    }}
                    disabled={currentIndex >= filteredItems.length - 1}
                    className="flex-1 py-3.5 rounded-2xl bg-[#1A1A1A] text-[#EBE6DF] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-30"
                >
                    PRÓXIMO <ChevronDown className="w-4 h-4" />
                </button>
            </footer>
        </div>
    );
}

export default function FeedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#EBE6DF] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#6A1A28] animate-spin" />
            </div>
        }>
            <FeedContent />
        </Suspense>
    );
}