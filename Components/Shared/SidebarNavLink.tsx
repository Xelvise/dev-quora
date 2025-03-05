import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

interface Props {
    route: string;
    imgURL: string;
    label: string;
    isSelected: boolean;
    imgSize: number;
    isDesktopView?: boolean;
    sidebarUpdateFn?: (state: boolean) => void;
}

// prettier-ignore
const LinkContent = ({ route, imgURL, label, isSelected, imgSize, isDesktopView, sidebarUpdateFn }: Props) => (
    <Link
        href={route}
        className={`flex items-center justify-start gap-4 bg-transparent p-4 ${
            isSelected ? "primary-gradient rounded-[10px] text-light-900" : "text-dark300_light900"
        }`}
        onClick={sidebarUpdateFn ? () => sidebarUpdateFn(false) : undefined}
    >
        <Image
            src={imgURL}
            alt={label}
            width={imgSize}
            height={imgSize}
            className={isSelected ? "" : "invert-colors"}
        />
        <p
            className={`${isDesktopView ? "max-lg:hidden" : ""} ${isSelected ? (isDesktopView ? "base-bold" : "paragraph-semibold") : isDesktopView ? "base-medium" : "paragraph-medium"}`}
        >
            {label}
        </p>
    </Link>
);

// prettier-ignore
export default function SidebarNavLink({ route, imgURL, label, isSelected, imgSize, isDesktopView, sidebarUpdateFn }: Props) {
    if (label === "Profile") {
        return (
            <SignedIn>
                <LinkContent
                    route={route}
                    imgURL={imgURL}
                    label={label}
                    isSelected={isSelected}
                    imgSize={imgSize}
                    isDesktopView={isDesktopView}
                    sidebarUpdateFn={sidebarUpdateFn}
                />
            </SignedIn>
        );
    }
    return (
        <LinkContent
            route={route}
            imgURL={imgURL}
            label={label}
            isSelected={isSelected}
            imgSize={imgSize}
            isDesktopView={isDesktopView}
            sidebarUpdateFn={sidebarUpdateFn}
        />
    );
}
