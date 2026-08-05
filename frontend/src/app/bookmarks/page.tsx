"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import {
    Bookmark,
    ArrowLeft,
    AlertCircle,
    RefreshCw,
    Trash2,
    BookOpen,
    ExternalLink,
    Tag,
    X,
    Clock,
    Smartphone
} from "lucide-react";

interface Content {
    id: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    estimatedReadingTimeSeconds: number;
    funFact?: string;
    reelsEquivalent?: number;
}

interface BookmarkItem {
    bookmarkId: string;
    savedAt: string;
    content: Content;
}

export default function BookmarksPage() {
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedPill, setSelectedPill] = useState<Content | null>(null);

    const fetchBookmarks = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/bookmarks");
            const data = response.data;
            setBookmarks(data.items || []);
        } catch (err: any) {
            console.error("Erro ao carregar favoritos:", err);
            if (err.response?.status === 401) {
                router.push("/login");
                return;
            }
            setError(
                err.response?.data?.message ||
                "Não foi possível carregar sua biblioteca no momento."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleRemoveBookmark = async (contentId: string) => {
        try {
            setBookmarks((prev) => prev.filter((item) => item.content.id !== contentId));
            await api.post(`/bookmarks/toggle/${contentId}`);

            if (selectedPill?.id === contentId) {
                setSelectedPill(null);
            }
        } catch (err) {
            console.error("Erro ao remover favorito:", err);
            fetchBookmarks();
        }
    };

    if (error) {
        return (
            <main className="min-h-screen bg-[#0A0A0A] text-[#EBE6DF] pt-32 p-6 flex items-center justify-center font-sans">
                <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 max-w-md text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-[#6A1A28] mx-auto" />
                    <h2 className="text-2xl font-black uppercase">Falha ao Carregar</h2>
                    <p className="text-sm text-[#EBE6DF]/60">{error}</p>
                    <button
                        onClick={fetchBookmarks}
                        className="px-6 py-3 bg-[#6A1A28] text-[#EBE6DF] font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" /> Tentar Novamente
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-[#EBE6DF] pt-28 md:pt-36 pb-12 px-4 md:px-8 font-sans selection:bg-[#6A1A28] selection:text-[#EBE6DF]">
            <div className="max-w-4xl mx-auto space-y-8">

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#1A1A1A] gap-4">
                    <div>
                        <span className="font-mono text-xs text-[#6A1A28] font-bold uppercase tracking-widest block mb-1 flex items-center gap-2">
                            <Bookmark className="w-3.5 h-3.5" /> // Sua Biblioteca
                        </span>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Pílulas Salvas</h1>
                    </div>

                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 bg-[#121212] border border-[#2A2A2A] text-[#EBE6DF] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                    </Link>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 h-48 animate-pulse flex flex-col justify-between">
                                <div>
                                    <div className="h-4 w-1/4 bg-[#1A1A1A] rounded mb-4" />
                                    <div className="h-6 w-3/4 bg-[#1A1A1A] rounded mb-2" />
                                    <div className="h-4 w-full bg-[#1A1A1A] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 py-24">
                        <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-2">
                            <BookOpen className="w-8 h-8 text-[#EBE6DF]/20" />
                        </div>
                        <h3 className="text-xl font-black uppercase text-[#EBE6DF]/80">Biblioteca Vazia</h3>
                        <p className="text-[#EBE6DF]/50 max-w-md text-sm">
                            Você ainda não salvou nenhuma pílula de conhecimento. Explore o feed e salve os conteúdos que achar mais interessantes para ler depois.
                        </p>
                        <Link
                            href="/feed"
                            className="mt-4 px-6 py-3 bg-[#EBE6DF] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#6A1A28] hover:text-[#EBE6DF] transition-colors inline-block"
                        >
                            Explorar o Feed
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookmarks.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={item.bookmarkId}
                                className="group bg-[#121212] border border-[#2A2A2A] hover:border-[#6A1A28]/50 rounded-3xl p-6 flex flex-col justify-between transition-all relative overflow-hidden"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="font-mono text-[10px] text-[#6A1A28] font-bold uppercase tracking-widest">
                                            // {item.content.category || "Pílula"}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveBookmark(item.content.id)}
                                            className="text-[#EBE6DF]/30 hover:text-[#6A1A28] transition-colors p-1"
                                            title="Remover dos favoritos"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#EBE6DF] leading-tight mb-2 line-clamp-2">
                                        {item.content.title}
                                    </h3>
                                    <p className="text-sm text-[#EBE6DF]/60 line-clamp-3">
                                        {item.content.summary}
                                    </p>

                                    {item.content.tags && item.content.tags.length > 0 && (
                                        <div className="flex gap-2 mt-4 flex-wrap">
                                            {item.content.tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] rounded-md text-[10px] font-mono text-[#EBE6DF]/50 uppercase">
                                                    <Tag className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-[#1A1A1A] flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-[#EBE6DF]/30 uppercase">
                                        Salvo em {new Date(item.savedAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => setSelectedPill(item.content)}
                                        className="flex items-center gap-1.5 text-[#EBE6DF] hover:text-[#6A1A28] text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Ler <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedPill(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#EBE6DF]/70 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 flex gap-4 text-[10px] font-mono text-[#EBE6DF]/50 uppercase">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-[#6A1A28]" />
                                    {selectedPill.category || "Pílula"}
                                </span>
                                {selectedPill.estimatedReadingTimeSeconds && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[#6A1A28]" />
                                        {Math.ceil(selectedPill.estimatedReadingTimeSeconds / 60)} min de leitura
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-[#EBE6DF] uppercase tracking-tight mb-6">
                                {selectedPill.title}
                            </h2>

                            <div className="prose prose-invert prose-p:text-[#EBE6DF]/80 max-w-none text-base md:text-lg mb-8">
                                <p>{selectedPill.summary}</p>
                            </div>

                            {selectedPill.funFact && (
                                <div className="bg-[#6A1A28]/10 border border-[#6A1A28]/30 rounded-2xl p-5 mb-8">
                                    <h4 className="text-xs font-bold text-[#6A1A28] uppercase tracking-widest mb-2 flex items-center gap-2">
                                        // Curiosidade
                                    </h4>
                                    <p className="text-sm text-[#EBE6DF]/90 italic">
                                        "{selectedPill.funFact}"
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-[#1A1A1A] gap-4">
                                <div className="flex gap-2 flex-wrap">
                                    {selectedPill.tags?.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-[#1A1A1A] rounded-lg text-xs font-mono text-[#EBE6DF]/60 uppercase">
                                            <Tag className="w-3.5 h-3.5" /> {tag}
                                        </span>
                                    ))}
                                </div>

                                {selectedPill.reelsEquivalent && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#EBE6DF] rounded-full text-[#0A0A0A]">
                                        <Smartphone className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wide">
                                            {selectedPill.reelsEquivalent} Reels Evitados
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    );
}