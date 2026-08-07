"use client";

import { useRef, Suspense } from "react";
import { motion, useScroll } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Brain, Sparkles, BookOpen } from "lucide-react";
import * as THREE from "three";
import Link from "next/link";

function DownloadedModel({ scrollProgress }: { scrollProgress: any }) {
    const { scene } = useGLTF('/telefone.glb');
    const modelRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!modelRef.current) return;

        modelRef.current.rotation.y += delta * 0.2;

        const progress = scrollProgress.get();

        if (progress < 0.33) {
            modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, 1.5, 0.05);
        } else if (progress < 0.66) {
            modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, -1.5, 0.05);
        } else {
            modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, 0, 0.05);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            <primitive object={scene} ref={modelRef} scale={1.5} />
        </Float>
    );
}

export default function Features() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main ref={containerRef} className="relative w-full h-[300vh] bg-[#0A0A0A] selection:bg-[#6A1A28] selection:text-[#EBE6DF]">

            <div className="absolute top-[-1px] left-0 w-full z-50 pointer-events-none">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[60px] md:h-[120px] drop-shadow-2xl" preserveAspectRatio="none">
                    <path d="M0 0L1440 0V60C1440 60 1154 120 720 120C286 120 0 60 0 60V0Z" fill="#EBE6DF" />
                </svg>
            </div>

            <div className="sticky top-0 h-screen w-full z-0 pointer-events-none">
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 45 }}
                    dpr={[1, 1.5]}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                >
                    <Environment preset="city" />
                    <ambientLight intensity={1} />
                    <directionalLight position={[5, 5, 5]} intensity={2} color="#EBE6DF" />
                    <Suspense fallback={null}>
                        <DownloadedModel scrollProgress={scrollYProgress} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="absolute top-0 left-0 w-full z-10 text-[#EBE6DF]">

                <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative pointer-events-none">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-5xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6A1A28]/50 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-6 bg-[#0A0A0A]/50 backdrop-blur-sm">
                            <Brain className="w-4 h-4" /> Desperte sua Mente
                        </div>
                        <h2 className="text-[14vw] md:text-[9vw] font-black tracking-tighter uppercase leading-[0.85] text-[#EBE6DF] mix-blend-difference">O Antídoto.</h2>
                        <p className="mt-8 text-lg font-medium text-[#EBE6DF]/50 max-w-xl mx-auto uppercase tracking-widest text-xs font-mono">
                            Substitua o vício do scroll por conhecimento real.<br /> Role para quebrar o ciclo.
                        </p>
                    </motion.div>
                </section>

                <section className="h-screen flex items-center px-4 md:px-20 pointer-events-none">
                    <div className="w-full md:w-1/2 md:pr-12 pointer-events-auto">
                        <div className="w-16 h-16 rounded-2xl bg-[#6A1A28] text-[#EBE6DF] flex items-center justify-center mb-8 shadow-2xl">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <span className="font-mono text-sm text-[#6A1A28] font-bold tracking-widest uppercase mb-4 block">PASSO // 01</span>
                        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EBE6DF] mb-6">O Fim do Doomscrolling</h3>
                        <p className="text-xl text-[#EBE6DF]/70 font-medium leading-relaxed mb-8">
                            O algoritmo foi desenhado para te prender em um ciclo de ansiedade e conteúdo vazio. Nós ajudamos você a retomar o controle da sua atenção.
                        </p>
                    </div>
                </section>

                <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent -z-10" />
                    <div className="w-20 h-20 rounded-full bg-[#EBE6DF] text-[#0A0A0A] flex items-center justify-center mb-8 pointer-events-auto shadow-[0_0_50px_rgba(235,230,223,0.1)]">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#EBE6DF] mb-6 pointer-events-auto">Expansão Cognitiva</h3>

                    <Link href="/feed" prefetch={false} className="pointer-events-auto group relative px-12 py-6 bg-[#6A1A28] text-[#EBE6DF] overflow-hidden rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-6 hover:scale-105 transition-transform duration-500">
                        <span className="relative z-10 flex items-center gap-3">Começar a Ler Agora</span>
                        <div className="absolute inset-0 bg-[#EBE6DF] text-[#0A0A0A] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0"></div>
                    </Link>

                </section>

            </div>
        </main>
    );
}