"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

export default function Footer() {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="relative w-full bg-[#0A0A0A] pt-28 pb-10 px-4 md:px-8 border-t border-[#1A1A1A] text-[#EBE6DF]">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 w-full"
                >
                    <h2 className="text-[11vw] md:text-[7vw] font-black tracking-tighter uppercase leading-[0.85] mb-6">
                        Mude o <span className="text-[#6A1A28]">Scroll.</span>
                    </h2>
                    <p className="text-[#EBE6DF]/60 text-base md:text-lg max-w-xl mx-auto font-medium">
                        Garanta seu acesso antecipado ao ImpactScroll e substitua a dopamina barata por repertório de verdade.
                    </p>
                </motion.div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("Inscrição confirmada no ImpactScroll!");
                    }}
                    className="w-full max-w-xl flex flex-col md:flex-row gap-3 mb-24"
                >
                    <input
                        type="email"
                        placeholder="Seu melhor e-mail..."
                        required
                        className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-full py-4 px-6 text-[#EBE6DF] placeholder:text-[#EBE6DF]/30 focus:outline-none focus:border-[#6A1A28] font-mono text-sm"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#EBE6DF] text-[#0A0A0A] font-bold uppercase tracking-widest text-xs rounded-full hover:bg-[#6A1A28] hover:text-[#EBE6DF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Entrar na Lista</span>
                        <MoveRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1A1A1A] text-[#EBE6DF]/40 text-xs font-mono uppercase tracking-widest gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#6A1A28] inline-block animate-ping" />
                        <span>IMPACTSCROLL © 2026</span>
                    </div>

                    <div className="flex gap-6">
                        <button onClick={() => scrollTo("hero")} className="hover:text-[#EBE6DF] transition-colors cursor-pointer">
                            Início
                        </button>
                        <button onClick={() => scrollTo("manifesto")} className="hover:text-[#EBE6DF] transition-colors cursor-pointer">
                            Manifesto
                        </button>
                        <button onClick={() => scrollTo("lab")} className="hover:text-[#EBE6DF] transition-colors cursor-pointer">
                            The Lab
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}