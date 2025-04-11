"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContext {
    mode: string;
    switchTheme: () => void;
}
interface FiltersContext {
    filterFromContext: string;
    sendFilterToContext: (filter: string) => void;
}

const ThemeContext = createContext({} as ThemeContext);
const FiltersContext = createContext({} as FiltersContext);

export default function GLobalContextProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState("");

    useEffect(() => setMode(localStorage.getItem("theme") || "dark"), []);

    const switchTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        if (newMode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        setMode(newMode);
        localStorage.setItem("theme", newMode);
    };

    const queryParams = useSearchParams();
    const initialQuery = queryParams.get("filter");
    const [filterFromContext, sendFilterToContext] = useState(initialQuery || "");

    return (
        <ThemeContext.Provider value={{ mode, switchTheme }}>
            <FiltersContext.Provider value={{ filterFromContext, sendFilterToContext }}>
                {children}
            </FiltersContext.Provider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (Object.keys(context).length === 0) {
        throw new Error("The useTheme hook must be used within a GLobalContextProvider");
    }
    return context;
}

export function useFilters() {
    const context = useContext(FiltersContext);
    if (Object.keys(context).length === 0) {
        throw new Error("The useFilters hook must be used within a GLobalContextProvider");
    }
    return context;
}

// "use client";

// import { createContext, useContext, useState } from "react";

// interface ThemeContext {
//     mode: string;
//     switchTheme: () => void;
// }

// const ThemeContext = createContext({} as ThemeContext);

// export default function ThemeProvider({ children }: { children: React.ReactNode }) {
//     const [mode, setMode] = useState("");

//     const switchTheme = () => {
//         const old_mode = localStorage.getItem("theme") || "dark";
//         const new_mode = old_mode === "light" ? "dark" : "light";

//         if (new_mode === "dark") document.documentElement.classList.add("dark");
//         else document.documentElement.classList.remove("dark");
//         setMode(new_mode);
//         localStorage.setItem("theme", new_mode);
//     };
//     return <ThemeContext.Provider value={{ mode, switchTheme }}>{children}</ThemeContext.Provider>;
// }

// export function useTheme() {
//     const context = useContext(ThemeContext);
//     if (Object.keys(context).length === 0) {
//         throw new Error("The useTheme hook must be used within a ThemeProvider");
//     }
//     return context;
// }
