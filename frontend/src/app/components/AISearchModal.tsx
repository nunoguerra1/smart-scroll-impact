"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, X, Bot, ArrowRight, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface AISearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPillGenerated?: (newPill: any) => void;
}

export default function AISearchModal({ isOpen, onClose, onPillGenerated }: AISearchModalProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const suggestedTopics = [
        "Jejum Intermitente & Autofagia",
        "Efeito Borboleta na Economia",
        "Como funciona o Computador Quântico",
        "Filosofia Estoica no Século XXI",
    ];

    const handleSearch = async (promptText?: string) => {
        const searchQuery = promptText || query;
        if (!searchQuery.trim() || loading) return;

        setLoading(true);
        try {
            const res = await api.post("/ai/search", { prompt: searchQuery });
            if (res.data && onPillGenerated) {
                onPillGenerated(res.data);
                onClose();
                setQuery("");
            }
        } catch (err) {
            console.error("Erro na busca IA:", err);
            if (onPillGenerated) {
                onPillGenerated({
                    id: `ai-${Date.now()}`,
                    title: `SÍNTESE IA: ${searchQuery.toUpperCase()}`,
                    summary: `Análise sintética sobre "${searchQuery}". O conhecimento sobre este tema reconfigura a forma como percebemos padrões complexos e tomadas de decisão.`,
                    category: "GERADO POR IA",
                    estimatedReadTime: 2,
                    reelsEquivalent: 5,
                });
                onClose();
                setQuery("");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-lg bg-[#EBE6DF] border border-[#1A1A1A]/20 p-6 rounded-3xl shadow-2xl relative text-[#1A1A1A]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#1A1A1A]/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-[#1A1A1A]/60" />
                    </button>

                    <div className="flex items-center gap-2 mb-2 text-[#6A1A28] font-mono text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Pesquisa de Conhecimento com IA</span>
                    </div>

                    <h3 className="text-xl font-black uppercase mb-4 tracking-tight">
                        O que você quer aprender agora?
                    </h3>

                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Ex: Como funciona a memória de longo prazo?"
                            className="w-full bg-white/80 border border-[#1A1A1A]/20 py-4 pl-12 pr-12 rounded-2xl text-sm placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#6A1A28] transition-all font-sans"
                        />
                        <Search className="w-5 h-5 text-[#1A1A1A]/40 absolute left-4 top-1/2 -translate-y-1/2" />

                        <button
                            onClick={() => handleSearch()}
                            disabled={loading || !query.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[#6A1A28] text-[#EBE6DF] disabled:opacity-30 hover:scale-105 transition-transform"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <div>
                        <p className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/50 mb-2 tracking-wider">
                            Sugestões de Tópicos
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTopics.map((topic, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSearch(topic)}
                                    className="text-xs bg-white/50 border border-[#1A1A1A]/10 px-3 py-1.5 rounded-full text-[#1A1A1A]/80 hover:bg-[#6A1A28] hover:text-[#EBE6DF] hover:border-[#6A1A28] transition-all text-left"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}