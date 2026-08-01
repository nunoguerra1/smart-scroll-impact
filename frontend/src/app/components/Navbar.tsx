import Link from "next/link";
import { Leaf } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50">
            <Link href="/" className="flex items-center gap-2 text-organic-petroleum font-bold text-xl tracking-tighter">
                <Leaf className="text-organic-impact" />
                ImpactScroll
            </Link>

            <div className="flex gap-4">
                <Link href="/login" className="px-6 py-2 rounded-full border border-organic-petroleum/20 hover:bg-organic-petroleum hover:text-organic-offwhite transition-all duration-300">
                    Entrar
                </Link>
            </div>
        </nav>
    );
}