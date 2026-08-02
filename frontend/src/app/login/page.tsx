"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldAlert, Lock, Mail } from "lucide-react";
import Cookies from "js-cookie";
import { api } from "../../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            const { accessToken } = response.data;

            Cookies.set("smart_scroll_token", accessToken, {
                expires: 7,
                path: "/"
            });
            window.location.href = "/feed";
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Credenciais inválidas. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#EBE6DF] text-[#1A1A1A] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#6A1A28] selection:text-[#EBE6DF]">

            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#6A1A28]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#1A1A1A]/5 blur-[120px] pointer-events-none" />

            <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 my-12">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-6 space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6A1A28]/30 bg-[#6A1A28]/5 backdrop-blur-md text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> PORTAL DE ACESSO
                    </div>

                    <h1 className="text-[12vw] sm:text-[7vw] lg:text-[5vw] font-black tracking-tighter uppercase leading-[0.85] text-[#1A1A1A]">
                        RETOME O <br />
                        <span className="font-playfair italic font-medium text-[#6A1A28] lowercase tracking-normal">
                            controle.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-[#1A1A1A]/70 font-medium max-w-md leading-relaxed">
                        O antídoto para o consumo passivo. Faça login para continuar expandindo seu repertório e contabilizando seu tempo de foco.
                    </p>

                    <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#1A1A1A]/50 tracking-widest uppercase">
                        <span>[ SESSÃO PROTEGIDA ]</span>
                        <span>•</span>
                        <span>[ FOCO ATIVO ]</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:col-span-6 bg-[#EBE6DF]/80 backdrop-blur-xl border border-[#1A1A1A]/15 p-8 sm:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden"
                >
                    <div className="mb-8">
                        <span className="text-xs font-mono font-bold text-[#6A1A28] tracking-widest uppercase block mb-2">
                            IDENTIFICAÇÃO // 01
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#1A1A1A]">
                            Entrar na Plataforma
                        </h2>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 rounded-xl bg-[#6A1A28]/10 border border-[#6A1A28]/30 flex items-center gap-3 text-xs font-mono text-[#6A1A28]"
                            >
                                <ShieldAlert className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold tracking-widest uppercase text-[#1A1A1A]/70 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-[#6A1A28]" /> E-mail de Acesso
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu.email@dominio.com"
                                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-[#1A1A1A]/15 text-[#1A1A1A] placeholder-[#1A1A1A]/30 focus:outline-none focus:border-[#6A1A28] focus:ring-1 focus:ring-[#6A1A28] transition-all duration-300 font-sans text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold tracking-widest uppercase text-[#1A1A1A]/70 flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5 text-[#6A1A28]" /> Senha
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-5 py-4 rounded-2xl bg-white/70 border border-[#1A1A1A]/15 text-[#1A1A1A] placeholder-[#1A1A1A]/30 focus:outline-none focus:border-[#6A1A28] focus:ring-1 focus:ring-[#6A1A28] transition-all duration-300 font-sans text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-5 bg-[#6A1A28] text-[#EBE6DF] overflow-hidden rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#6A1A28]/20"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? "Autenticando..." : "Acessar Plataforma"}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-[#1A1A1A] text-[#EBE6DF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#1A1A1A]/10 text-center">
                        <p className="text-xs font-mono text-[#1A1A1A]/60">
                            Ainda não possui credenciais?{" "}
                            <Link
                                href="/register"
                                className="text-[#6A1A28] font-bold hover:underline underline-offset-4 ml-1 uppercase"
                            >
                                Criar Conta
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}