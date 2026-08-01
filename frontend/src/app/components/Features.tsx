"use client";

import { useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll as useDreiScroll, Environment, Float, useGLTF } from "@react-three/drei";
import { Brain, Globe, Sparkles, BookOpen } from "lucide-react";
import * as THREE from "three";

function DownloadedModel() {
    const { scene } = useGLTF('/telefone.glb');
    const modelRef = useRef<THREE.Group>(null);
    const scroll = useDreiScroll();

    useFrame((state, delta) => {
        if (!modelRef.current) return;

        modelRef.current.rotation.y += delta * 0.2;

        const r2 = scroll.range(0, 0.33);
        const r3 = scroll.range(0.33, 0.66);

        if (r2 < 1) {
            modelRef.current.position.x = THREE.MathUtils.lerp(modelRef.current.position.x, 1.5, 0.05);
        } else if (r3 < 1) {
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

function HtmlOverlay() {
    return (
        <div className="w-full text-[#EBE6DF]">

            <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#6A1A28]/50 text-[#6A1A28] text-xs font-mono font-bold tracking-widest uppercase mb-6 bg-[#0A0A0A]/50 backdrop-blur-sm">
                        <Brain className="w-4 h-4" /> Desperte sua Mente
                    </div>
                    <h2 className="text-[14vw] md:text-[9vw] font-black tracking-tighter uppercase leading-[0.85] text-[#EBE6DF] mix-blend-difference">
                        O Antídoto.
                    </h2>
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
                    <div className="flex gap-4">
                        <span className="px-4 py-2 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-mono text-[#EBE6DF]/50">DESCONEXÃO ATIVA</span>
                    </div>
                </div>
            </section>

            <section className="h-screen flex items-center justify-end px-4 md:px-20 text-right pointer-events-none">
                <div className="w-full md:w-1/2 md:pl-12 flex flex-col items-end pointer-events-auto">
                    <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#EBE6DF] flex items-center justify-center mb-8">
                        <Globe className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-sm text-[#6A1A28] font-bold tracking-widest uppercase mb-4 block">PASSO // 02</span>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#EBE6DF] mb-6">Curadoria Direcionada</h3>
                    <p className="text-xl text-[#EBE6DF]/70 font-medium leading-relaxed mb-8">
                        Substitua o lixo digital por conteúdo que agrega. Mergulhe em notícias reais, ciência, história e curiosidades que expandem sua visão de mundo.
                    </p>
                    <div className="w-full max-w-md h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-[#6A1A28]"></div>
                    </div>
                    <span className="text-xs font-mono text-[#EBE6DF]/40 mt-4">REPERTÓRIO CULTURAL: EXPANDINDO</span>
                </div>
            </section>

            <section className="h-screen flex flex-col justify-center items-center text-center px-4 relative pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent -z-10" />

                <div className="w-20 h-20 rounded-full bg-[#EBE6DF] text-[#0A0A0A] flex items-center justify-center mb-8 pointer-events-auto shadow-[0_0_50px_rgba(235,230,223,0.1)]">
                    <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-[#EBE6DF] mb-6 pointer-events-auto">Expansão Cognitiva</h3>
                <p className="text-xl text-[#EBE6DF]/70 font-medium leading-relaxed max-w-2xl mb-12 pointer-events-auto">
                    Menos ansiedade, mais repertório. Transforme horas perdidas na tela em conhecimento valioso e tangível para o seu dia a dia.
                </p>

                <button className="pointer-events-auto group relative px-12 py-6 bg-[#6A1A28] text-[#EBE6DF] overflow-hidden rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-6 hover:scale-105 transition-transform duration-500">
                    <span className="relative z-10 flex items-center gap-3">
                        Começar a Ler Agora
                    </span>
                    <div className="absolute inset-0 bg-[#EBE6DF] text-[#0A0A0A] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.76,0,0.24,1] z-0"></div>
                </button>
            </section>

        </div>
    );
}

export default function Features() {
    return (
        <main className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden selection:bg-[#6A1A28] selection:text-[#EBE6DF]">

            <div className="absolute top-[-1px] left-0 w-full z-50 pointer-events-none">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-[60px] md:h-[120px] drop-shadow-2xl"
                    preserveAspectRatio="none"
                >
                    <path d="M0 0L1440 0V60C1440 60 1154 120 720 120C286 120 0 60 0 60V0Z" fill="#EBE6DF" />
                </svg>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Environment preset="city" />
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={2} color="#EBE6DF" />

                <ScrollControls pages={4} damping={0.15}>
                    <Suspense fallback={null}>
                        <DownloadedModel />
                    </Suspense>
                    <Scroll html style={{ width: '100%' }}>
                        <HtmlOverlay />
                    </Scroll>
                </ScrollControls>
            </Canvas>
        </main>
    );
}