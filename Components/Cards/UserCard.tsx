import { UserDoc } from "@/Backend/Database/user.collection";
import { fetchTopInteractedTags } from "@/Backend/Server-Side/Actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import Tag from "../Generic/Tag";

export default async function UserCard({ user }: { user: UserDoc }) {
    const interactedTags = await fetchTopInteractedTags({ user_id: user.id });
    return (
        <Link
            href={`/profile/${user.clerkId}`}
            className="card-wrapper dark:card-wrapper-dark rounded-2xl max-xs:min-w-full xs:w-[260px]"
        >
            <article className="solid-light-border flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl p-8">
                <Image src={user.picture} alt="Profile picture" width={100} height={100} className="rounded-full" />
                <div className="text-center">
                    <h1 className="h3-bold text-dark400_light900 line-clamp-1">{user.name}</h1>
                    <p className="body-regular text-dark100_light500 mt-1">@{user.username}</p>
                </div>
                <div className="flex items-center gap-2">
                    {interactedTags.map(tag => (
                        <Tag key={tag.id} tag_id={tag.id} name={tag.name} badgeClassNames="subtle-medium uppercase" />
                    ))}
                </div>
            </article>
        </Link>
    );
}
