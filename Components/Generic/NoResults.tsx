import Image from "next/image";
import { Button } from "../Shadcn/button";
import Link from "next/link";

interface Props {
    title: string;
    desc?: string;
    link?: string;
    linkTitle?: string;
}

export default function NoResults({ title, desc, link, linkTitle }: Props) {
    return (
        <div className="mt-5 flex w-full flex-col items-center justify-center gap-5">
            <Image
                src="/assets/images/light-illustration.png"
                alt="light illustration"
                width={270}
                height={200}
                className="block object-contain dark:hidden max-sm:h-[150px] max-sm:w-[220px]"
            />
            <Image
                src="/assets/images/dark-illustration.png"
                alt="dark illustration"
                width={270}
                height={200}
                className="hidden object-contain dark:block max-sm:h-[150px] max-sm:w-[220px]"
            />
            <h1 className="text-dark200_light900 h3-bold max-sm:paragraph-semibold text-center">{title}</h1>
            {desc && (
                <p className="text-dark100_light700 paragraph-medium max-sm:body-regular max-w-md text-center max-sm:max-w-sm">
                    {desc}
                </p>
            )}
            {link && linkTitle && (
                <Link href={link}>
                    <Button className="primary-gradient max-sm:small-medium flex items-center justify-center rounded-[10px] p-3 text-light-900">
                        {linkTitle}
                    </Button>
                </Link>
            )}
        </div>
    );
}
