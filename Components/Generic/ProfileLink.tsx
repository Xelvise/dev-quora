import Image from "next/image";
import Link from "next/link";

interface Props {
    imgURL: string;
    href?: string;
    title: string;
}

export default function ProfileLink({ imgURL, href, title }: Props) {
    return (
        <div className="flex items-center gap-2">
            <Image src={imgURL} alt="icon" width={20} height={20} />
            {href ? (
                <Link href={href} target="_blank" className="paragraph-medium text-accent-blue">
                    {title}
                </Link>
            ) : (
                <p className="paragraph-medium text-dark200_light700">{title}</p>
            )}
        </div>
    );
}
