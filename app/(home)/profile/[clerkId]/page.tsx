export default async function Profile({ params }: { params: Promise<{ clerkId: string }> }) {
    const { clerkId } = await params;
    return <div></div>;
}
