"use client";

import { motion } from "framer-motion";
import { MoveRight, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setStatus("loading");

        try {
            const response = await fetch("/api/v1/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Falha ao se inscrever na waitlist");
            }

            setStatus("success");
            toast.success("Inscrição confirmada! Fique de olho no seu e-mail.", {
                style: {
                    background: '#121212',
                    color: '#EBE6DF',
                    border: '1px solid #2A2A2A',
                },
                iconTheme: {
                    primary: '#6A1A28',
                    secondary: '#EBE6DF',
                },
            });

            setEmail("");

            setTimeout(() => setStatus("idle"), 3000);

        } catch (error) {
            setStatus("idle");
            toast.error("Ocorreu um erro ao tentar se inscrever. Tente novamente.", {
                style: {
                    background: '#121212',
                    color: '#EBE6DF',
                    border: '1px solid #2A2A2A',
                }
            });
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

                <div className="w-full max-w-xl mb-24">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col md:flex-row gap-3 relative"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu melhor e-mail..."
                            required
                            disabled={status === "loading"}
                            className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-full py-4 px-6 text-[#EBE6DF] placeholder:text-[#EBE6DF]/30 focus:outline-none focus:border-[#6A1A28] font-mono text-sm disabled:opacity-50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="px-8 py-4 bg-[#EBE6DF] text-[#0A0A0A] font-bold uppercase tracking-widest text-xs rounded-full hover:bg-[#6A1A28] hover:text-[#EBE6DF] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
                        >
                            {status === "loading" ? (
                                <>
                                    <span>Enviando</span>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </>
                            ) : status === "success" ? (
                                <span>Inscrito!</span>
                            ) : (
                                <>
                                    <span>Entrar na Lista</span>
                                    <MoveRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

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