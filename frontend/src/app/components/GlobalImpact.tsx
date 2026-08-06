"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate, useMotionValue, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Users, Smartphone, Clock, BookOpen, TreePine, Globe } from "lucide-react";

interface CommunityStats {
    totalUsers: number;
    totalMicroLearningsAvailable: number;
    totalTreesPlanted: number;
    totalReelsAvoided: number;
    totalFocusHoursSaved: number;
}

const AnimatedNumber = ({ value }: { value: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (inView && nodeRef.current) {
            const controls = animate(0, value, {
                duration: 3,
                ease: [0.16, 1, 0.3, 1],
                onUpdate(currentValue) {
                    if (nodeRef.current) {
                        nodeRef.current.textContent = Math.floor(currentValue).toLocaleString('pt-BR');
                    }
                },
            });
            return () => controls.stop();
        }
    }, [value, inView]);

    return <span ref={nodeRef}>0</span>;
};

const SpotlightCard = ({ children, className, glowColor = "rgba(255, 255, 255, 0.1)" }: { children: React.ReactNode, className?: string, glowColor?: string }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className={`group relative overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#121212] ${className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-30"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            ${glowColor},
                            transparent 80%
                        )
                    `,
                }}
            />
            {children}
        </div>
    );
};

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
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
                const response = await fetch(`${baseUrl}/analytics/global`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
                const data = await response.json();
                if (data?.communityStats) setStats(data.communityStats);
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
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 80, rotateX: 15, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 60, damping: 20, mass: 1.5 }
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen bg-[#0A0A0A] py-32 px-4 md:px-8 overflow-hidden selection:bg-[#6A1A28] selection:text-[#EBE6DF]" style={{ perspective: "1000px" }}>

            <motion.div
                style={{ y: bgY }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-[#6A1A28]/10 rounded-full blur-[150px] pointer-events-none z-0"
            />

            <div className="max-w-7xl mx-auto relative z-10" ref={containerRef}>

                <motion.div
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                    transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                    className="mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6A1A28]/30 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-6 bg-black/50 backdrop-blur-md">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                                <Globe className="w-4 h-4" />
                            </motion.div>
                            Dados em Tempo Real
                        </div>
                        <h2 className="text-[12vw] md:text-[7vw] font-black tracking-tighter uppercase leading-[0.85] text-[#EBE6DF]">
                            Impacto <br /> Coletivo.
                        </h2>
                    </div>
                    <p className="text-lg font-medium text-[#EBE6DF]/40 max-w-md uppercase tracking-widest text-xs font-mono md:text-right leading-relaxed">
                        A matemática da resistência. <br />
                        Isto é o que acontece quando retomamos o controle do nosso foco.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <motion.div variants={itemVariants} className="md:col-span-8 h-full">
                        <SpotlightCard glowColor="rgba(235, 230, 223, 0.08)" className="h-full p-8 md:p-12 flex flex-col justify-between min-h-[340px]">
                            <div className="absolute -right-10 -bottom-10 opacity-5">
                                <Smartphone className="w-96 h-96 text-[#EBE6DF]" />
                            </div>
                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <span className="font-mono text-sm text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Conteúdo Tóxico Evitado</span>
                                <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center text-[#EBE6DF]">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-[15vw] md:text-[8vw] font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                    {loading ? "..." : <AnimatedNumber value={stats.totalReelsAvoided} />}
                                </div>
                                <p className="text-xl text-[#EBE6DF]/50 mt-4 font-playfair italic">vídeos curtos banidos do seu córtex.</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4 h-full">
                        <SpotlightCard glowColor="rgba(106, 26, 40, 0.3)" className="h-full p-8 md:p-12 flex flex-col justify-between min-h-[340px] bg-gradient-to-br from-[#26070d] to-[#0a0203] border-[#6A1A28]/30">
                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <span className="font-mono text-sm uppercase tracking-widest font-bold text-[#EBE6DF]/60">Mentes Despertas</span>
                                <Users className="w-6 h-6 text-[#6A1A28]" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-[12vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                    {loading ? "-" : <AnimatedNumber value={stats.totalUsers} />}
                                </div>
                                <p className="text-lg text-[#EBE6DF]/50 mt-4 font-medium">indivíduos na resistência.</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                        <SpotlightCard className="p-8 flex flex-col justify-between min-h-[280px]">
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Foco Recuperado</span>
                                <Clock className="w-5 h-5 text-[#EBE6DF]/30" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-6xl font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                    {loading ? "-" : <AnimatedNumber value={stats.totalFocusHoursSaved} />}<span className="text-3xl text-[#EBE6DF]/20 ml-1">H</span>
                                </div>
                                <p className="text-sm text-[#EBE6DF]/40 mt-4">Horas de atenção absoluta resgatadas.</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                        <SpotlightCard className="p-8 flex flex-col justify-between min-h-[280px]">
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs text-[#EBE6DF]/40 uppercase tracking-widest font-bold">Acervo Neural</span>
                                <BookOpen className="w-5 h-5 text-[#EBE6DF]/30" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-6xl font-black uppercase tracking-tighter leading-none text-[#EBE6DF]">
                                    {loading ? "-" : <AnimatedNumber value={stats.totalMicroLearningsAvailable} />}
                                </div>
                                <p className="text-sm text-[#EBE6DF]/40 mt-4">Pílulas de sabedoria prontas no banco.</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                        <SpotlightCard glowColor="rgba(16, 185, 129, 0.15)" className="p-8 flex flex-col justify-between min-h-[280px] bg-gradient-to-br from-[#050f09] to-[#020503] border-emerald-900/20">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none" />
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs text-emerald-500/50 uppercase tracking-widest font-bold">Impacto Global</span>
                                <TreePine className="w-5 h-5 text-emerald-500/80" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-6xl font-black uppercase tracking-tighter leading-none text-emerald-400">
                                    {loading ? "-" : <AnimatedNumber value={stats.totalTreesPlanted} />}
                                </div>
                                <p className="text-sm text-emerald-500/40 mt-4">Árvores plantadas na vida real.</p>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}