import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center h-screen">
            <h1 className="mb-2">Welcome to Home page</h1>
            <Link href="/users" className="text-blue-500">
                Go to Users page
            </Link>
            <ProductCard />
        </main>
    );
}
