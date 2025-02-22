"use client";

import { createContext, useContext, useState } from "react";

interface ThemeContext {
    mode: string;
    switchTheme: () => void;
}

const ThemeContext = createContext({} as ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState("");

    const switchTheme = () => {
        const old_mode = localStorage.getItem("theme") || "dark";
        const new_mode = old_mode === "light" ? "dark" : "light";

        if (new_mode === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        setMode(new_mode);
        localStorage.setItem("theme", new_mode);
    };
    return <ThemeContext.Provider value={{ mode, switchTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (Object.keys(context).length === 0) {
        throw new Error("The useTheme hook must be used within a ThemeProvider");
    }
    return context;
}
