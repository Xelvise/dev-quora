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
            <Image src={imgURL} alt="icon" width={20} height={20} className="max-sm:h-[15px] max-sm:w-[15px]" />
            {href ? (
                <Link href={href} target="_blank" className="paragraph-medium max-sm:body-regular text-accent-blue">
                    {title}
                </Link>
            ) : (
                <p className="paragraph-medium max-sm:body-regular text-dark200_light700">{title}</p>
            )}
        </div>
    );
}
