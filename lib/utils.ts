import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getTimestamp(inputDate: Date): number {
    const currentDate = new Date();
    // Convert both dates to UTC and get time difference in milliseconds
    const timeDiff = currentDate.getTime() - inputDate.getTime();
    // Convert milliseconds to days
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

export function formatNumber(num: number) {
    const format = (n: number, suffix: string) => {
        const formattedNum = n.toFixed(1);
        return formattedNum.endsWith(".0") ? `${Math.round(n)}${suffix}` : `${formattedNum}${suffix}`;
    };

    if (num < 1000000000000 && num >= 1000000000) {
        return format(num / 1000000000, "b");
    } else if (num < 1000000000 && num >= 1000000) {
        return format(num / 1000000, "m");
    } else if (num < 1000000 && num >= 1000) {
        return format(num / 1000, "k");
    } else {
        return num.toString();
    }
}
