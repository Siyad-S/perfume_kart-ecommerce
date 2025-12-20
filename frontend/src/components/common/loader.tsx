'use client';

import { Spinner, SpinnerProps } from "../ui/shadcn-io/spinner";

const variants: SpinnerProps['variant'][] = ['bars'];

const Loader = () => (
    <div className="flex h-screen w-full items-center justify-center">
        {variants.map((variant) => (
            <div
                className="flex flex-col items-center justify-center gap-4"
                key={variant}
            >
                <Spinner variant={variant} />
                <span className="text-muted-foreground text-xs">
                    Loading...
                </span>
            </div>
        ))}
    </div>
);

export default Loader;
