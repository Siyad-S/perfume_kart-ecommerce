import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    href?: string;
    onViewAll?: () => void;
    actionText?: string;
    className?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    href,
    onViewAll,
    actionText = "View All",
    className,
}: SectionHeaderProps) {
    const ActionWrapper = href ? Link : "button";
    const actionProps = href ? { href } : { onClick: onViewAll };

    return (
        <div className={`flex flex-col md:flex-row justify-between items-start mb-8 md:mb-12 ${className || ""}`}>
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-3 text-neutral-500 text-lg md:text-xl font-light">
                        {subtitle}
                    </p>
                )}
            </div>

            {onViewAll && (
                // @ts-ignore - Link vs button typing issue (simplified for this snippet)
                <ActionWrapper
                    {...actionProps}
                    className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors mt-4 md:mt-0 pb-1 border-b border-neutral-200 hover:border-neutral-900"
                >
                    {actionText}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ActionWrapper>
            )}
        </div>
    );
}
