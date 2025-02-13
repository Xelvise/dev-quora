import Image from "next/image";
import { Button } from "../shadcn/button";
import Link from "next/link";

interface Props {
    title: string;
    desc?: string;
    link?: string;
    linkTitle?: string;
}

export default function NoResultsPage({ title, desc, link, linkTitle }: Props) {
    return (
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4">
            <Image
                src="/assets/images/light-illustration.png"
                alt="No result illustration"
                width={270}
                height={200}
                className="block object-contain dark:hidden"
            />
            <Image
                src="/assets/images/dark-illustration.png"
                alt="No result illustration"
                width={270}
                height={200}
                className="hidden object-contain dark:flex"
            />
            <h1 className="text-dark200_light900 h2-bold">{title}</h1>
            {desc && <p className="text-dark100_light700 paragraph-medium max-w-md text-center">{desc}</p>}
            {link && linkTitle && (
                <Link href={link}>
                    <Button className="primary-gradient flex items-center justify-center rounded-[10px] p-3 text-light-900">
                        {linkTitle}
                    </Button>
                </Link>
            )}
        </div>
    );
}
