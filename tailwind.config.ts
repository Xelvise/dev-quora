// Create a config based on design style guide
// https://www.figma.com/file/2vtjgodtBxTdg0zOUHPvXh/Course-Designs?type=design&node-id=0%3A1&mode=design&t=kE2VnjGXGIiOk2PY-1
import type { Config } from "tailwindcss";

const config = {
    darkMode: "class" as const,
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./Components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                primary: {
                    "100": "#FFF1E6",
                    "500": "#FF7000",
                },
                dark: {
                    "100": "#101012",
                    "200": "#212734",
                    "300": "#151821",
                    "400": "#0F1117",
                    "500": "#000000",
                },
                light: {
                    "400": "#858EAD",
                    "500": "#7B8EC8",
                    "700": "#DCE3F1",
                    "800": "#F4F6F8",
                    "850": "#FDFDFD",
                    "900": "#FFFFFF",
                },
                "accent-blue": "#1DA1F2",
            },
            fontFamily: {
                inter: ["var(--font-inter)"],
                spaceGrotesk: ["var(--font-spaceGrotesk)"],
            },
            boxShadow: {
                "light-100": "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px",
                "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
                "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
                "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
                "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
            },
            backgroundImage: {
                "auth-dark": "url(/assets/images/auth-dark.png)",
                "auth-light": "url(/assets/images/auth-light.png)",
            },
            screens: {
                xs: "420px",
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },

    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config satisfies Config;
