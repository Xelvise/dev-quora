"use client";

import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import parse from "html-react-parser";

import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-solidity";
import "prismjs/components/prism-json";
import "prismjs/components/prism-dart";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-r";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-go";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-mongodb";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

export default function ContentParser({ content, display }: { content: string; display: "question" | "answer" }) {
    // When display is for an answer, we want to allow toggling between clamped & full view.
    const [isClamped, setIsClamped] = useState(true);
    // This state shows if the content overflows and if we need to show the toggle button.
    const [showToggle, setShowToggle] = useState(false);
    // Create a ref to the content container.
    const contentRef = useRef<HTMLDivElement>(null);

    // Apply Prism syntax highlighting when content changes.
    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    // Check if the content is overflowing once it has been rendered.
    useEffect(() => {
        if (display === "answer" && contentRef.current) {
            // Check if the content's scrollHeight exceeds its clientHeight.
            const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
            setShowToggle(isOverflowing);
        }
    }, [content, display, isClamped]);

    // Toggle the clamping state on button click.
    const toggleClamp = () => {
        setIsClamped(prev => !prev);
    };

    return (
        <>
            <div
                ref={contentRef}
                className={`markdown min-w-full ${display === "answer" && isClamped ? "line-clamp-5" : ""}`}
            >
                {parse(content)}
            </div>
            {display === "answer" && showToggle && (
                <button onClick={toggleClamp} className="mt-2 text-blue-500 focus:outline-none">
                    {isClamped ? "Read more" : "Read less"}
                </button>
            )}
        </>
    );
}
