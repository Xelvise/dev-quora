export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-light850_dark500 flex min-h-screen w-full flex-col items-center justify-center">
            {children}
        </main>
    );
}
