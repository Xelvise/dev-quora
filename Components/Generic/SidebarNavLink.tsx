import { SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
    route: string;
    imgURL: string;
    label: string;
    imgSize: number;
    isDesktopView?: boolean;
    setOpenFn?: Dispatch<SetStateAction<boolean>>;
}

const LinkContent = ({ route, imgURL, label, imgSize, isDesktopView, setOpenFn }: Props) => {
    const pathname = usePathname();
    const isSelected = pathname === route || pathname.includes(label.toLowerCase());
    return (
        <Link
            href={route}
            className={`flex items-center justify-start gap-4 bg-transparent p-4 ${
                isSelected ? "primary-gradient rounded-[10px] text-light-900" : "text-dark300_light900"
            }`}
            onClick={setOpenFn ? () => setOpenFn(false) : undefined}
        >
            <Image
                src={imgURL}
                alt={label}
                width={imgSize}
                height={imgSize}
                className={isSelected ? "" : "invert-colors"}
            />
            <p
                className={` ${isDesktopView && "max-lg:hidden"} ${
                    isSelected
                        ? isDesktopView
                            ? "base-bold"
                            : "paragraph-semibold"
                        : isDesktopView
                          ? "base-medium"
                          : "paragraph-medium"
                } `}
            >
                {label}
            </p>
        </Link>
    );
};

// prettier-ignore
export default function SidebarNavLink({ route, imgURL, label, imgSize, isDesktopView, setOpenFn }: Props) {
    const { userId: clerkId } = useAuth();

    if (label === "Profile") {
        return (
            <SignedIn>
                <LinkContent
                    route={`${route}/${clerkId}`}
                    imgURL={imgURL}
                    label={label}
                    imgSize={imgSize}
                    isDesktopView={isDesktopView}
                    setOpenFn={setOpenFn}
                />
            </SignedIn>
        );
    }
    return (
        <LinkContent
            route={route}
            imgURL={imgURL}
            label={label}
            imgSize={imgSize}
            isDesktopView={isDesktopView}
            setOpenFn={setOpenFn}
        />
    );
}
