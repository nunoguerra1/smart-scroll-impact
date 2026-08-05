"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "../../lib/api";
import {
    Flame,
    Clock,
    Trophy,
    ArrowUpRight,
    LogOut,
    Bookmark,
    Sparkles,
    Compass,
    AlertCircle,
    RefreshCw,
    TreePine,
    Smartphone,
    BookOpen,
    Footprints,
    Activity
} from "lucide-react";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    streakCount: number;
    pointsBalance: number;
    treesPlantedCount: number;
}

interface ImpactMetrics {
    focusMinutes: number;
    reelsSaved: number;
    bookmarksCount: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [user, setUser] = useState<UserProfile | null>(null);
    const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/analytics/dashboard");
            const data = response.data;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    name: data.user.name || "Membro",
                    email: data.user.email || "",
                    streakCount: data.user.streakCount ?? 0,
                    pointsBalance: data.user.pointsBalance ?? 0,
                    treesPlantedCount: data.user.treesPlantedCount ?? 0,
                });
            }

            if (data.impactMetrics) {
                setMetrics({
                    focusMinutes: data.impactMetrics.focusMinutes ?? 0,
                    reelsSaved: data.impactMetrics.reelsSaved ?? 0,
                    bookmarksCount: data.impactMetrics.bookmarksCount ?? 0,
                });
            }
        } catch (err: any) {
            console.error("Dashboard Fetch Error:", err);
            if (err.response?.status === 401) {
                router.push("/login");
                return;
            }
            setError(
                err.response?.data?.message ||
                err.message ||
                "Erro ao sincronizar dados com o servidor."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (e) {
            console.error("Erro no logout", e);
        } finally {
            Cookies.remove("smart_scroll_token", { path: "/" });
            Cookies.remove("token", { path: "/" });
            Cookies.remove("access_token", { path: "/" });
            localStorage.removeItem("smart_scroll_token");
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            router.push("/login");
        }
    };

    const reelsSaved = metrics?.reelsSaved ?? 0;
    const focusMinutes = metrics?.focusMinutes ?? 0;

    const recoveredMinutes = reelsSaved * 1;

    const hoursFocused = Math.floor(focusMinutes / 60);
    const minsFocused = focusMinutes % 60;

    const pagesReadEquiv = Math.floor(recoveredMinutes / 2);
    const kmWalkedEquiv = (recoveredMinutes / 12).toFixed(1);
    const medidationsEquiv = Math.floor(recoveredMinutes / 10);

    if (error) {
        return (
            <main className="min-h-screen bg-[#0A0A0A] text-[#EBE6DF] pt-32 p-6 flex items-center justify-center font-sans">
                <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 max-w-md text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-[#6A1A28] mx-auto" />
                    <h2 className="text-2xl font-black uppercase">Falha na Conexão</h2>
                    <p className="text-sm text-[#EBE6DF]/60">{error}</p>
                    <button
                        onClick={fetchDashboardData}
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
            <div className="max-w-7xl mx-auto space-y-10">

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#1A1A1A] gap-4">
                    <div>
                        <span className="font-mono text-xs text-[#6A1A28] font-bold uppercase tracking-widest block mb-1">
                            // Painel de Impacto
                        </span>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Visão Geral</h1>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                            href="/feed"
                            prefetch={false}
                            className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#EBE6DF] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#6A1A28] hover:text-[#EBE6DF] transition-colors flex items-center justify-center gap-2"
                        >
                            <Compass className="w-4 h-4" />
                            <span>Explorar Feed</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-full border border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#EBE6DF]/60 hover:text-[#EBE6DF] transition-colors"
                            title="Sair da Conta"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 w-32 bg-[#1A1A1A] rounded-full" />
                                <div className="h-10 w-3/4 bg-[#1A1A1A] rounded-xl" />
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6A1A28]/50 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-4 bg-[#0A0A0A]/40">
                                    <Sparkles className="w-3.5 h-3.5" /> Foco Ativo
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
                                    Olá, {user?.name?.split(" ")[0] || "Membro"}.
                                </h2>
                                <p className="mt-3 text-[#EBE6DF]/60 max-w-lg text-sm md:text-base">
                                    Bem-vindo de volta ao seu refúgio digital. Aqui estão os frutos da sua resistência contra o algoritmo.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-xs text-[#6A1A28] font-bold tracking-widest uppercase">
                                Ofensiva
                            </span>
                            <Flame className="w-5 h-5 fill-[#6A1A28] text-[#6A1A28]" />
                        </div>
                        {loading ? (
                            <div className="my-6 animate-pulse h-14 w-24 bg-[#1A1A1A] rounded-xl" />
                        ) : (
                            <div className="my-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter text-[#EBE6DF]">
                                        {user?.streakCount ?? 0}
                                    </span>
                                    <span className="text-xl font-bold uppercase text-[#EBE6DF]/60">dias</span>
                                </div>
                            </div>
                        )}
                        <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((user?.streakCount ?? 0) / 7) * 100, 100)}%` }}
                                className="bg-[#6A1A28] h-full"
                            />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between hover:border-[#6A1A28]/50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[10px] sm:text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Pontos XP</span>
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBE6DF]/60" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                            {user?.pointsBalance ?? 0}
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between hover:border-[#6A1A28]/50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[10px] sm:text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Biblioteca</span>
                            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBE6DF]/60" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                            {metrics?.bookmarksCount ?? 0} <span className="text-xs sm:text-sm font-medium text-[#EBE6DF]/40">Cards</span>
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between hover:border-[#6A1A28]/50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[10px] sm:text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Reels Evitados</span>
                            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBE6DF]/60" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                            {metrics?.reelsSaved ?? 0}
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[10px] sm:text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Árvores Salvas</span>
                            <TreePine className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500/80" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-emerald-500">
                            {user?.treesPlantedCount ?? 0}
                        </div>
                    </div>
                </section>

                <section className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 md:p-8">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1A1A1A] pb-6">
                        <div>
                            <span className="font-mono text-xs text-[#EBE6DF]/40 font-bold uppercase tracking-widest block mb-1">
                                Análise de Impacto
                            </span>
                            <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">
                                O que esse tempo significa?
                            </h3>
                            <p className="text-sm text-[#EBE6DF]/50 mt-1 max-w-xl">
                                Com {reelsSaved} conteúdos superficiais evitados, você recuperou cerca de <strong className="text-[#EBE6DF]">{recoveredMinutes} minutos</strong> de vida. Veja o que você poderia fazer com esse tempo:
                            </p>
                        </div>
                        <div className="text-left sm:text-right">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest block">Tempo de Foco App</span>
                            <span className="text-2xl font-black flex items-center sm:justify-end gap-2 text-[#6A1A28]">
                                <Clock className="w-5 h-5" />
                                {hoursFocused > 0 ? `${hoursFocused}h ` : ""}{minsFocused}m
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                        <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A]">
                            <BookOpen className="w-6 h-6 text-[#EBE6DF]/60 mb-2" />
                            <span className="text-3xl font-black">{pagesReadEquiv} <span className="text-sm font-medium text-[#EBE6DF]/40 uppercase">Páginas</span></span>
                            <span className="text-xs text-[#EBE6DF]/50">De um livro novo lidas.</span>
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A]">
                            <Footprints className="w-6 h-6 text-[#EBE6DF]/60 mb-2" />
                            <span className="text-3xl font-black">{kmWalkedEquiv} <span className="text-sm font-medium text-[#EBE6DF]/40 uppercase">KMs</span></span>
                            <span className="text-xs text-[#EBE6DF]/50">Caminhados ao ar livre.</span>
                        </div>

                        <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A]">
                            <Activity className="w-6 h-6 text-[#EBE6DF]/60 mb-2" />
                            <span className="text-3xl font-black">{medidationsEquiv} <span className="text-sm font-medium text-[#EBE6DF]/40 uppercase">Sessões</span></span>
                            <span className="text-xs text-[#EBE6DF]/50">De meditação concluídas.</span>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <Link
                        href="/feed"
                        prefetch={false}
                        className="group bg-[#121212] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 transition-all flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <span className="font-mono text-xs text-[#6A1A28] font-bold tracking-widest uppercase block mb-1">
                                Retornar
                            </span>
                            <h3 className="text-xl font-black uppercase tracking-tight">Continuar Lendo</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#6A1A28] transition-all">
                            <ArrowUpRight className="w-4 h-4 text-[#EBE6DF]" />
                        </div>
                    </Link>

                    <Link
                        href="/bookmarks"
                        prefetch={false}
                        className="group bg-[#121212] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 transition-all flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <span className="font-mono text-xs text-[#EBE6DF]/40 font-bold tracking-widest uppercase block mb-1">
                                Acervo
                            </span>
                            <h3 className="text-xl font-black uppercase tracking-tight">Ver Biblioteca</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center group-hover:scale-110 transition-all">
                            <Bookmark className="w-4 h-4 text-[#EBE6DF]" />
                        </div>
                    </Link>
                </section>

            </div>
        </main>
    );
}