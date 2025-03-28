import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./prism.css";
import GLobalContextProvider from "@/app/GlobalContextProvider";
import { Suspense } from "react";

// prettier-ignore
export const metadata: Metadata = {
    title: "DevQuora",
    description: "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    },
};

const inter = Inter({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-spaceGrotesk",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head suppressHydrationWarning>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                const savedTheme = localStorage.getItem('theme') || 'dark';
                                if (savedTheme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                }
                            })();
                        `,
                    }}
                />
            </head>
            <body className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
                <ClerkProvider
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            formButtonPrimary: "primary-gradient",
                            footerActionLink: "primary-text-gradient hover:text-primary-500",
                        },
                    }}
                >
                    <Suspense>
                        <GLobalContextProvider>{children}</GLobalContextProvider>
                    </Suspense>
                </ClerkProvider>
            </body>
        </html>
    );
}
