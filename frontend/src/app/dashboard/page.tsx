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
    Brain,
    Trophy,
    ArrowUpRight,
    LogOut,
    Bookmark,
    Zap,
    Sparkles,
    Compass,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    avatarUrl?: string;
}

interface GamificationStats {
    streak: number;
    points: number;
    level: string;
    environmentalImpact: string | number;
}

interface AnalyticsDashboard {
    timeSavedMinutes: number;
    cardsRead: number;
    focusScore?: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<GamificationStats | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [resMe, resStats, resAnalytics] = await Promise.all([
                api.get<UserProfile>("/auth/me"),
                api.get("/gamification/stats"),
                api.get("/analytics/dashboard"),
            ]);

            setProfile(resMe.data);

            const rawStats: any = resStats.data;
            if (rawStats) {
                setStats({
                    streak: rawStats.streakCount ?? rawStats.streak ?? 0,
                    points: rawStats.pointsBalance ?? rawStats.points ?? 0,
                    level: rawStats.level || "Iniciante",
                    environmentalImpact: rawStats.treesPlantedCount > 0
                        ? `${rawStats.treesPlantedCount} Árvores`
                        : `${rawStats.estimatedReelsSaved ?? 0} Reels Evitados`,
                });
            }

            const rawAnalytics: any = resAnalytics.data;
            if (rawAnalytics) {
                setAnalytics({
                    timeSavedMinutes: rawAnalytics.timeSavedMinutes ?? rawAnalytics.estimatedTimeSavedMinutes ?? rawAnalytics.timeSaved ?? 0,
                    cardsRead: rawAnalytics.cardsRead ?? rawAnalytics.cardsReadCount ?? rawAnalytics.totalCards ?? 0,
                    focusScore: rawAnalytics.focusScore ?? 0,
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

            if (typeof window !== "undefined") {
                localStorage.removeItem("smart_scroll_token");
                localStorage.removeItem("token");
                localStorage.removeItem("access_token");
            }

            document.cookie = "smart_scroll_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            router.push("/login");
        }
    };

    const timeSavedMinutes = analytics?.timeSavedMinutes ?? 0;
    const hoursSaved = Math.floor(timeSavedMinutes / 60);
    const minsSaved = timeSavedMinutes % 60;

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
            <div className="max-w-7xl mx-auto space-y-8">

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#1A1A1A] gap-4">
                    <div>
                        <span className="font-mono text-xs text-[#6A1A28] font-bold uppercase tracking-widest block">
                            // Painel de Controle
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
                            <span>Ir ao Feed</span>
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

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="md:col-span-2 bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-6 w-32 bg-[#1A1A1A] rounded-full" />
                                <div className="h-10 w-3/4 bg-[#1A1A1A] rounded-xl" />
                                <div className="h-4 w-1/2 bg-[#1A1A1A] rounded-md" />
                            </div>
                        ) : (
                            <>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6A1A28]/50 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-4 bg-[#0A0A0A]/40">
                                        <Sparkles className="w-3.5 h-3.5" /> Nível: {stats?.level || "Iniciante"}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
                                        Olá, {profile?.name?.split(" ")[0] || "Membro"}.
                                    </h2>
                                    <p className="mt-3 text-[#EBE6DF]/60 max-w-md text-sm md:text-base">
                                        Sua atenção é seu ativo mais valioso. Veja os dados acumulados da sua jornada até agora.
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-6 pt-6 border-t border-[#1A1A1A]">
                                    <div>
                                        <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest block">Status</span>
                                        <span className="text-sm font-bold text-[#EBE6DF] flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Sessão Ativa
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest block">Conta Registrada</span>
                                        <span className="text-sm font-mono text-[#EBE6DF]/80 mt-1 block">{profile?.email || "—"}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-xs text-[#6A1A28] font-bold tracking-widest uppercase">
                                Ofensiva Atual
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-[#6A1A28]/20 text-[#6A1A28] flex items-center justify-center">
                                <Flame className="w-5 h-5 fill-[#6A1A28]" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="my-6 animate-pulse space-y-3">
                                <div className="h-14 w-24 bg-[#1A1A1A] rounded-xl" />
                                <div className="h-4 w-full bg-[#1A1A1A] rounded-md" />
                            </div>
                        ) : (
                            <div className="my-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter text-[#EBE6DF]">
                                        {stats?.streak ?? 0}
                                    </span>
                                    <span className="text-xl font-bold uppercase text-[#EBE6DF]/60">dias</span>
                                </div>
                                <p className="text-xs font-mono text-[#EBE6DF]/40 mt-2 uppercase">
                                    Sequência ininterrupta no app
                                </p>
                            </div>
                        )}

                        <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((stats?.streak ?? 0) / 30) * 100, 100)}%` }}
                                className="bg-[#6A1A28] h-full"
                            />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Tempo Recalculado</span>
                            <Clock className="w-5 h-5 text-[#EBE6DF]/60" />
                        </div>
                        {loading ? (
                            <div className="h-8 w-28 bg-[#1A1A1A] animate-pulse rounded-md" />
                        ) : (
                            <div>
                                <div className="text-3xl font-black uppercase tracking-tight">
                                    {hoursSaved}h {minsSaved}m
                                </div>
                                <p className="text-xs text-[#EBE6DF]/50 mt-1">
                                    Poupado fora do scroll infinito.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Conhecimento</span>
                            <Brain className="w-5 h-5 text-[#EBE6DF]/60" />
                        </div>
                        {loading ? (
                            <div className="h-8 w-28 bg-[#1A1A1A] animate-pulse rounded-md" />
                        ) : (
                            <div>
                                <div className="text-3xl font-black uppercase tracking-tight">
                                    {analytics?.cardsRead ?? 0} <span className="text-sm font-medium text-[#EBE6DF]/40">Pílulas</span>
                                </div>
                                <p className="text-xs text-[#EBE6DF]/50 mt-1">
                                    Cards absorvidos ativamente.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Pontuação XP</span>
                            <Trophy className="w-5 h-5 text-[#EBE6DF]/60" />
                        </div>
                        {loading ? (
                            <div className="h-8 w-28 bg-[#1A1A1A] animate-pulse rounded-md" />
                        ) : (
                            <div>
                                <div className="text-3xl font-black uppercase tracking-tight">
                                    {stats?.points ?? 0} <span className="text-sm font-medium text-[#6A1A28]">pts</span>
                                </div>
                                <p className="text-xs text-[#EBE6DF]/50 mt-1">
                                    Acumulados por consistência.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest">Impacto Eco</span>
                            <Zap className="w-5 h-5 text-[#6A1A28]" />
                        </div>
                        {loading ? (
                            <div className="h-8 w-28 bg-[#1A1A1A] animate-pulse rounded-md" />
                        ) : (
                            <div>
                                <div className="text-2xl font-black uppercase tracking-tight text-[#EBE6DF]">
                                    {stats?.environmentalImpact ?? "0 kg CO₂"}
                                </div>
                                <p className="text-xs text-[#EBE6DF]/50 mt-1">
                                    Pegada digital evitada.
                                </p>
                            </div>
                        )}
                    </div>

                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <Link
                        href="/feed"
                        prefetch={false}
                        className="group bg-[#121212] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 transition-all flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <span className="font-mono text-xs text-[#6A1A28] font-bold tracking-widest uppercase block mb-2">
                                Ação Direta
                            </span>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Continuar Lendo o Feed</h3>
                            <p className="text-sm text-[#EBE6DF]/50 mt-1">Acesse novas pílulas de conhecimento agora.</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#6A1A28] transition-all">
                            <ArrowUpRight className="w-5 h-5 text-[#EBE6DF]" />
                        </div>
                    </Link>

                    <Link
                        href="/bookmarks"
                        prefetch={false}
                        className="group bg-[#121212] hover:bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 transition-all flex justify-between items-center cursor-pointer"
                    >
                        <div>
                            <span className="font-mono text-xs text-[#EBE6DF]/40 font-bold tracking-widest uppercase block mb-2">
                                Sua Biblioteca
                            </span>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Pílulas Salvas</h3>
                            <p className="text-sm text-[#EBE6DF]/50 mt-1">Consulte seus cards favoritados e resumos.</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center group-hover:scale-110 transition-all">
                            <Bookmark className="w-5 h-5 text-[#EBE6DF]" />
                        </div>
                    </Link>
                </section>

            </div>
        </main>
    );
}