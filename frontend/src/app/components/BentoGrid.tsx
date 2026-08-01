"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper, Lightbulb, Microscope, BookMarked, Brain } from "lucide-react";
import { useState } from "react";

function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    return { mousePosition, handleMouseMove };
}

export default function BentoGrid() {
    const { mousePosition, handleMouseMove } = useMousePosition();

    return (
        <section className="w-full bg-[#0A0A0A] py-32 px-4 md:px-8 text-[#EBE6DF]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-[8vw] md:text-[4vw] font-black uppercase tracking-tighter leading-none mb-4">
                        Curadoria Neural.
                    </h2>
                    <p className="text-[#EBE6DF]/50 text-lg md:text-xl font-medium max-w-2xl">
                        Uma amostra do seu novo feed. Menos ruído, mais substância. O backend processa milhares de fontes e entrega apenas o que expande a sua mente.
                    </p>
                </div>

                <div
                    onMouseMove={handleMouseMove}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="group relative md:col-span-2 overflow-hidden rounded-3xl bg-[#121212] border border-[#2A2A2A] hover:border-[#6A1A28]/50 transition-colors duration-500 p-8 flex flex-col justify-between"
                    >
                        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(106,26,40,0.15), transparent 40%)` }}
                        />

                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-[#6A1A28]/20 text-[#ff4d6d] text-xs font-mono font-bold">
                                <Newspaper className="w-4 h-4" /> ATUALIDADES
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-[#EBE6DF]/30 group-hover:text-[#EBE6DF] transition-colors" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Descoberta em Fusão Nuclear</h3>
                            <p className="text-[#EBE6DF]/60 font-medium">Cientistas ultrapassam a barreira de ignição. Como isso muda a matriz energética global nos próximos 10 anos? Tempo estimado: 45s de leitura.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="group relative md:col-span-1 overflow-hidden rounded-3xl bg-[#121212] border border-[#2A2A2A] hover:border-[#6A1A28]/50 transition-colors duration-500 p-8 flex flex-col justify-between"
                    >
                        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(235,230,223,0.05), transparent 40%)` }}
                        />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-6">
                                <Microscope className="w-5 h-5 text-[#EBE6DF]" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Microplásticos na Chuva</h3>
                            <p className="text-[#EBE6DF]/60 text-sm font-medium">Um estudo revela o ciclo atmosférico dos polímeros.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="group relative md:col-span-1 overflow-hidden rounded-3xl bg-[#121212] border border-[#2A2A2A] hover:border-[#6A1A28]/50 transition-colors duration-500 p-8 flex flex-col justify-between"
                    >
                        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(235,230,223,0.05), transparent 40%)` }}
                        />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-6">
                                <Lightbulb className="w-5 h-5 text-[#EBE6DF]" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-2">O Paradoxo de Epicuro</h3>
                            <p className="text-[#EBE6DF]/60 text-sm font-medium">Por que desejamos o que não precisamos? 30s de reflexão.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                        className="group relative md:col-span-2 overflow-hidden rounded-3xl bg-[#6A1A28] border border-[#6A1A28] p-8 flex flex-col justify-between"
                    >
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-[#0A0A0A]/30 text-[#EBE6DF] text-xs font-mono font-bold">
                                <BookMarked className="w-4 h-4" /> BIBLIOTECA PESSOAL
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">O seu tempo salvo.</h3>
                            <p className="text-[#EBE6DF]/80 font-medium max-w-md">Em vez de 45 minutos rolando o feed, você leu 12 pílulas de conhecimento hoje. Seu cérebro agradece.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Brain className="w-64 h-64" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}