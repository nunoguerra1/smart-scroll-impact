"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Smartphone, Clock, BookOpen, TreePine, Globe } from "lucide-react";
import { api } from "../../lib/api";

interface CommunityStats {
    totalUsers: number;
    totalMicroLearningsAvailable: number;
    totalTreesPlanted: number;
    totalReelsAvoided: number;
    totalFocusHoursSaved: number;
}

export default function GlobalImpact() {
    const [stats, setStats] = useState<CommunityStats>({
        totalUsers: 0,
        totalMicroLearningsAvailable: 0,
        totalTreesPlanted: 0,
        totalReelsAvoided: 0,
        totalFocusHoursSaved: 0
    });
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const response = await api.get("/analytics/global");
                if (response.data?.communityStats) {
                    setStats(response.data.communityStats);
                }
            } catch (error) {
                console.error("Erro ao buscar status globais:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
    };

    return (
        <section className="relative w-full min-h-screen bg-[#0A0A0A] py-32 px-4 md:px-8 overflow-hidden selection:bg-[#6A1A28] selection:text-[#EBE6DF]">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#6A1A28]/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#1A1A1A] pb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6A1A28]/50 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-6 bg-[#0A0A0A]">
                            <Globe className="w-4 h-4" /> A Resistência
                        </div>
                        <h2 className="text-[12vw] md:text-[7vw] font-black tracking-tighter uppercase leading-[0.85] text-[#EBE6DF]">
                            Impacto <br /> Coletivo.
                        </h2>
                    </div>
                    <p className="text-lg font-medium text-[#EBE6DF]/50 max-w-md uppercase tracking-widest text-xs font-mono md:text-right leading-relaxed">
                        Não estamos sozinhos. <br />
                        Veja o que acontece quando uma comunidade decide recuperar o controle de sua própria atenção.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
                >
                    <motion.div variants={itemVariants} className="md:col-span-8 bg-[#121212] border border-[#2A2A2A] hover:border-[#6A1A28]/50 transition-colors duration-500 rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[300px] group relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                            <Smartphone className="w-96 h-96 text-[#EBE6DF]" />
                        </div>
                        <div className="relative z-10 flex justify-between items-start mb-12">
                            <span className="font-mono text-sm text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Conteúdo Tóxico Evitado</span>
                            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#6A1A28]">
                                <Smartphone className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[15vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                {loading ? "..." : stats.totalReelsAvoided}
                            </div>
                            <p className="text-xl text-[#EBE6DF]/50 mt-2 font-playfair italic">vídeos curtos ignorados pela comunidade.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4 bg-[#6A1A28] border border-[#6A1A28] rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[300px] group text-[#EBE6DF]">
                        <div className="flex justify-between items-start mb-12">
                            <span className="font-mono text-sm uppercase tracking-widest font-bold text-[#EBE6DF]/70">Mentes Despertas</span>
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[12vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none">
                                {loading ? "-" : stats.totalUsers}
                            </div>
                            <p className="text-lg text-[#EBE6DF]/80 mt-2 font-medium">membros ativos no movimento.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4 bg-[#121212] border border-[#2A2A2A] hover:border-[#EBE6DF]/30 transition-colors duration-500 rounded-3xl p-8 flex flex-col justify-between min-h-[250px]">
                        <div className="flex justify-between items-start mb-8">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Tempo Recuperado</span>
                            <Clock className="w-5 h-5 text-[#EBE6DF]/60" />
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                {loading ? "-" : stats.totalFocusHoursSaved}<span className="text-3xl text-[#EBE6DF]/40">H</span>
                            </div>
                            <p className="text-sm text-[#EBE6DF]/50 mt-3">Horas de foco absoluto salvas do algoritmo.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4 bg-[#121212] border border-[#2A2A2A] hover:border-[#EBE6DF]/30 transition-colors duration-500 rounded-3xl p-8 flex flex-col justify-between min-h-[250px]">
                        <div className="flex justify-between items-start mb-8">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Acervo de Conhecimento</span>
                            <BookOpen className="w-5 h-5 text-[#EBE6DF]/60" />
                        </div>
                        <div>
                            <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                {loading ? "-" : stats.totalMicroLearningsAvailable}
                            </div>
                            <p className="text-sm text-[#EBE6DF]/50 mt-3">Pílulas de sabedoria prontas para leitura.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4 bg-[#0A0A0A] border border-emerald-900/30 hover:border-emerald-500/50 transition-colors duration-500 rounded-3xl p-8 flex flex-col justify-between min-h-[250px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <span className="font-mono text-xs text-emerald-500/60 uppercase tracking-widest font-bold">Impacto Real</span>
                            <TreePine className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-emerald-500">
                                {loading ? "-" : stats.totalTreesPlanted}
                            </div>
                            <p className="text-sm text-[#EBE6DF]/50 mt-3">Árvores plantadas pela nossa comunidade.</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}