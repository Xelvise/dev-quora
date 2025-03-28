export default function Divider({ className = "" }: { className?: string }) {
    return <div className={`w-full border-b-[1px] border-b-light-700 dark:border-b-dark-200 ${className}`} />;
}
