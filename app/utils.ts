import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BADGE_CRITERIA } from "@/Constants";
import { BadgeCounts, BadgeCriteriaType } from "@/types";

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

export function parseDate(date: Date) {
    // Extract the month and year from the Date object
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Create the joined date string (e.g, "September 2023")
    const joinedDate = `${month} ${year}`;
    return joinedDate;
}

export function findFilterNameByValue(filterArray: { name: string; value: string }[], targetValue: string | undefined) {
    if (!targetValue) return targetValue;
    for (const filter of filterArray) {
        if (filter.value === targetValue) {
            return filter.name;
        }
    }
    return targetValue;
}

export function areArraysEqual(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
}

interface BadgeParam {
    criteria: {
        type: BadgeCriteriaType;
        count: number;
    }[];
}

export const assignBadges = (params: BadgeParam) => {
    // Initialize the badgeCounts with zeroed-out values for GOLD, SILVER, and BRONZE
    const badgeCounts: BadgeCounts = { GOLD: 0, SILVER: 0, BRONZE: 0 };

    // Extract the 'criteria' array from the function parameters
    const { criteria } = params;

    // Loop through each item in 'criteria'
    criteria.forEach(item => {
        // Destructure 'type' and 'count' from the current item
        const { type, count } = item;

        // Retrieve the badge level thresholds from BADGE_CRITERIA using 'type'
        const badgeLevels = BADGE_CRITERIA[type];

        // Loop through each badge level (BRONZE, SILVER, GOLD)
        Object.keys(badgeLevels).forEach(level => {
            // If the user's badge 'count' meets or exceeds the threshold for this level...
            if (count >= badgeLevels[level as keyof BadgeCounts]) {
                // ...increment the corresponding badge count
                badgeCounts[level as keyof BadgeCounts] += 1;
            }
        });
    });
    return badgeCounts;
};
