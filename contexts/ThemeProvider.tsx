"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContext {
    mode: string;
    switchTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", mode);
    }, [mode]);

    const switchTheme = () => setMode((initial) => (initial === "dark" ? "light" : "dark"));
    return <ThemeContext.Provider value={{ mode, switchTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (Object.keys(context).length === 0) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
