"use client";

import NextTopLoader from "nextjs-toploader";

export default function RouteLoader() {
    return (
        <NextTopLoader
            color="#D4AF37"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
            zIndex={1600}
            showAtBottom={false}
        />
    );
}
