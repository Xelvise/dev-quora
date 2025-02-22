"use client";

import { useTheme } from "@/Context-Providers/ThemeProvider";
import Image from "next/image";

export default function ThemeSwitch() {
    const { mode, switchTheme } = useTheme();

    return (
        <Image
            src={mode === "light" ? "/assets/icons/sun.svg" : "/assets/icons/moon.svg"}
            alt="theme-icon"
            width={20}
            height={20}
            className="active-theme cursor-pointer"
            onClick={switchTheme}
        />
    );
}
