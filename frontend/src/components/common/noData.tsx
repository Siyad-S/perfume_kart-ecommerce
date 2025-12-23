"use client";

import { PackageOpen } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface NoDataProps {
    title?: string;
    description?: string;
    onAddClick?: () => void;
    addLabel?: string;
}

export function NoData({
    title = "No Records Found",
    description = "There’s nothing to show here yet. Start by adding a new item.",
    onAddClick,
    addLabel = "Add New",
}: NoDataProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl">
            <PackageOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
                {description}
            </p>

            {onAddClick && (
                <Button onClick={onAddClick} className="mt-6">
                    {addLabel}
                </Button>
            )}
        </div>
    );
}
