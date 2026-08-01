"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDownRight, MoveRight } from "lucide-react";

export default function Hero() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 20, mass: 0.5 });

    const scaleQuebre = useTransform(smoothProgress, [0, 0.2], [1, 0.6]);
    const opacityQuebre = useTransform(smoothProgress, [0, 0.2], [1, 0]);
    const yQuebre = useTransform(smoothProgress, [0, 0.2], [0, -100]);

    const scaleCiclo = useTransform(smoothProgress, [0, 0.3], [1, 15]);
    const opacityCiclo = useTransform(smoothProgress, [0.15, 0.25], [1, 0]);

    const rotateXManifesto = useTransform(smoothProgress, [0.2, 0.4], [60, 0]);
    const yManifesto = useTransform(smoothProgress, [0.2, 0.4], [300, 0]);
    const opacityManifesto = useTransform(smoothProgress, [0.2, 0.35], [0, 1]);
    const scaleManifesto = useTransform(smoothProgress, [0.2, 0.4], [0.8, 1]);

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden" style={{ perspective: "1000px" }}>

                <motion.div style={{ scale: scaleQuebre, opacity: opacityQuebre, y: yQuebre }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                    <h1 className="text-[22vw] md:text-[18vw] font-black tracking-tighter leading-[0.75] uppercase text-[#1A1A1A]">QUEBRE</h1>
                </motion.div>

                <motion.div style={{ scale: scaleCiclo, opacity: opacityCiclo }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                    <h1 className="text-[18vw] md:text-[14vw] font-playfair italic font-medium tracking-tight leading-[0.8] text-[#6A1A28]">o ciclo.</h1>
                </motion.div>

                <motion.div style={{ rotateX: rotateXManifesto, y: yManifesto, opacity: opacityManifesto, scale: scaleManifesto }} className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6 max-w-5xl mx-auto text-center">
                    <h2 className="text-[6vw] md:text-[4vw] font-black tracking-tighter uppercase text-[#1A1A1A] leading-none mb-6">
                        O FEED INFINITO <br /> ESTÁ ROUBANDO <br /> A SUA VIDA.
                    </h2>
                    <p className="text-lg md:text-2xl font-playfair italic text-[#6A1A28] max-w-2xl leading-relaxed">
                        Nós fomos condicionados a consumir o vazio. Rolando telas para esquecer o agora. É hora de recuperar o controle. Transforme a paralisia digital em foco absoluto.
                    </p>
                </motion.div>

                <motion.div className="absolute bottom-10 px-6 w-full max-w-7xl mx-auto flex justify-between items-end z-40 pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border border-[#1A1A1A]/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                            <ArrowDownRight className="w-5 h-5 text-[#6A1A28]" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A1A1A] w-32 leading-relaxed">Continue o scroll</span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}