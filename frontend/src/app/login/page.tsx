"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldAlert, Lock, Mail, GitMerge } from "lucide-react";
import Cookies from "js-cookie";
import { api } from "../../lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const handleOAuthLogin = (provider: "google" | "github") => {
        window.location.href = `${API_BASE_URL}/auth/${provider}`;
    };

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

                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleOAuthLogin("google")}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white border border-[#1A1A1A]/15 hover:bg-gray-50 transition-colors font-mono text-xs font-bold uppercase tracking-wider text-[#1A1A1A] shadow-sm"
                            type="button"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuar com Google
                        </button>

                        <button
                            onClick={() => handleOAuthLogin("github")}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-[#24292e] text-white border border-transparent hover:bg-[#1b1f23] transition-colors font-mono text-xs font-bold uppercase tracking-wider shadow-sm"
                            type="button"
                        >
                            <GitMerge className="w-5 h-5" />
                            Continuar com GitHub
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-[#1A1A1A]/10"></div>
                        <span className="font-mono text-[10px] uppercase font-bold text-[#1A1A1A]/40 tracking-widest">
                            Ou use seu email
                        </span>
                        <div className="flex-1 h-px bg-[#1A1A1A]/10"></div>
                    </div>

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