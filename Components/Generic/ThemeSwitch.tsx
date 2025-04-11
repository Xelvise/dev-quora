"use client";

import { useTheme } from "@/app/GlobalContextProvider";
import Image from "next/image";

export default function ThemeSwitch() {
    const { mode, switchTheme } = useTheme();

    if (mode) {
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
    return null;
}
