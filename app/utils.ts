import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// prettier-ignore
export function calcTimeDiff(inputDate: Date) {
    const currentDate = new Date();
    // Convert both dates to UTC and get time difference in milliseconds
    const timeDiff = currentDate.getTime() - inputDate.getTime();
    // Convert milliseconds to days
    const minutes = Math.floor(timeDiff / (1000 * 60));

    if (minutes === 0) return "now";
    else if (minutes === 1) return "a minute ago";
    else if (minutes < 60) return `${minutes} minutes ago`; // if less than an hour
    else if (minutes < 60 * 2) return "1 hour ago"; // if less than 2 hours
    else if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} hours ago`; // if less than 24hrs
    else if (minutes < 60 * 24 * 2) return "yesterday"; // if less than 2 days
    else return inputDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
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
