"use client";

import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext({});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState(() => {
        // Default to "dark" during SSR
        if (typeof window === "undefined") return "dark";
        // During CSR, retrieve the mode from localStorage or default to "dark"
        const savedMode = localStorage.getItem("theme");
        return savedMode || "dark";
    });

    // Save the mode to localStorage whenever it changes
    useEffect(() => {
        // Only during CSR should localStorage be accessed and written into
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", mode);
        }
    }, [mode]);

    const handleThemeChange = () => setMode(initial => (initial === "light" ? "dark" : "light"));

    return <ThemeContext.Provider value={{ mode, handleThemeChange }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (Object.keys(context).length === 0) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
