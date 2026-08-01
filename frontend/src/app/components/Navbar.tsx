"use client";

import { motion } from "framer-motion";

export default function Navbar() {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
            className="fixed top-6 left-0 w-full z-[90] flex justify-center px-4 mix-blend-difference text-[#EBE6DF]"
        >
            <nav className="w-full max-w-7xl flex items-center justify-between">
                <button
                    onClick={() => scrollTo("hero")}
                    className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                >
                    <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center group-hover:bg-[#EBE6DF] group-hover:text-[#1A1A1A] transition-colors">
                        <span className="text-[10px] font-bold block">IS</span>
                    </div>
                    <span className="font-bold tracking-tight text-lg">ImpactScroll</span>
                </button>

                <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
                    <button
                        onClick={() => scrollTo("manifesto")}
                        className="hover:opacity-50 transition-opacity cursor-pointer focus:outline-none"
                    >
                        Manifesto
                    </button>
                    <button
                        onClick={() => scrollTo("lab")}
                        className="hover:opacity-50 transition-opacity cursor-pointer focus:outline-none"
                    >
                        The Lab
                    </button>
                </div>

                <button
                    onClick={() => scrollTo("footer")}
                    className="text-sm font-bold uppercase tracking-widest border-b border-current pb-1 hover:opacity-50 transition-opacity cursor-pointer focus:outline-none"
                >
                    Entrar
                </button>
            </nav>
        </motion.header>
    );
}