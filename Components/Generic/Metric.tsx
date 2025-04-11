import Image from "next/image";
import Link from "next/link";

interface Props {
    imgPath: string;
    imgSize?: number;
    metricValue?: string | number;
    metricName?: string | number;
    href?: string;
    isAuthor?: boolean;
    textStyles?: string;
}

const MetricContent = ({ imgPath, imgSize, metricValue, metricName, isAuthor, textStyles }: Props) => (
    <div className="flex items-center gap-1.5">
        <Image
            src={imgPath}
            width={imgSize}
            height={imgSize}
            alt={`${metricName}`}
            className={isAuthor ? "rounded-full object-contain" : "invert-colors"}
        />
        {/* prettier-ignore */}
        <div className={`flex ${isAuthor ? "gap-2" : "gap-1"} flex-nowrap items-center`}>
            {metricValue && (
                <p className={`${isAuthor ? "body-regular" : "small-regular"} text-dark200_light800 whitespace-nowrap ${textStyles}`}>
                    {metricValue}
                </p>
            )}
            {metricName && (
                <p className={`${isAuthor ? "max-md:hidden" : ""} small-regular text-dark200_light800 cursor-text whitespace-nowrap ${textStyles}`}>
                    {metricName}
                </p>
            )}
        </div>
    </div>
);

// prettier-ignore
export default function Metric({ imgPath, imgSize = 16, metricValue, metricName, href, isAuthor, textStyles = "" }: Props) {
    if (href) {
        return (
            <Link href={href}>
                <MetricContent
                    imgPath={imgPath}
                    imgSize={imgSize}
                    metricValue={metricValue}
                    metricName={metricName}
                    isAuthor={isAuthor}
                    textStyles={textStyles}
                />
            </Link>
        );
    }
    return (
        <MetricContent
            imgPath={imgPath}
            imgSize={imgSize}
            metricValue={metricValue}
            metricName={metricName}
            isAuthor={isAuthor}
            textStyles={textStyles}
        />
    );
}
