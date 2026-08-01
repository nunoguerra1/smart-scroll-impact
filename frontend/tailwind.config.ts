import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                organic: {
                    offwhite: "#F7F7F5",
                    petroleum: "#0D2127",
                    impact: "#F47C36",
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            }
        },
    },
    plugins: [],
};
export default config;