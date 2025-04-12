"use client";

import { useEffect, useState } from "react";
import { Spinner } from "../Shadcn/spinner";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SearchResultFilters from "./SearchResultFilters";
import { fetchGlobalSearchResults, SearchResult } from "@/Backend/Server-Side/Actions/search.action";

interface GlobalSearchResultModalProps {
    className?: string;
    onLinkClick?: (href: string) => void;
}

export default function GlobalSearchResultModal({ className = "", onLinkClick }: GlobalSearchResultModalProps) {
    const searchParams = useSearchParams();
    const globalQuery = searchParams.get("global") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const [result, setResult] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (globalQuery) {
                setResult([]);
                setIsLoading(true);
                try {
                    const results = await fetchGlobalSearchResults({ type, query: globalQuery });
                    setResult(JSON.parse(results));
                } catch (error) {
                    console.log(error);
                    throw new Error("Failed to fetch data");
                } finally {
                    setIsLoading(false);
                }
            }
        })();
    }, [globalQuery, type]);

    const formatLink = ({ id, type }: { id: string; type: string }) => {
        switch (type) {
            case "question":
                return `/question/${id}`;
            case "user":
                return `/profile/${id}`;
            case "answer":
                return `/question/${id}`;
            case "tag":
                return `/tags/${id}`;
            default:
                throw new Error("Type is invalid");
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <SearchResultFilters />
            <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

            <div className="flex flex-col space-y-5 px-3">
                <p className="text-dark200_light900 paragraph-semibold">Top Match</p>

                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <Spinner size="large" className="mb-3 text-primary-500" />
                        <p className="text-dark400_light800 body-regular">Browsing the entire database</p>
                    </div>
                ) : (
                    <div className="no-scrollbar flex max-h-[400px] flex-col overflow-y-scroll">
                        {result.length > 0 ? (
                            result.map(({ id, title, type }) => {
                                const href = formatLink({ type, id });
                                return (
                                    <Link
                                        key={String(id)}
                                        href={href}
                                        onClick={onLinkClick ? () => onLinkClick(href) : undefined}
                                        className="flex w-full cursor-pointer items-start gap-3 rounded-[10px] px-2.5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                                    >
                                        <Image
                                            src="/assets/icons/tag.svg"
                                            alt="tags"
                                            width={18}
                                            height={18}
                                            className="invert-colors mt-1 object-contain"
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-dark400_light800 body-medium line-clamp-1">{title}</p>
                                            <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                                                {type}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                {/* <Image alt="emoji" src="" /> */}
                                <p className="text-dark400_light800 body-regular py-2.5">Oops, no results found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
