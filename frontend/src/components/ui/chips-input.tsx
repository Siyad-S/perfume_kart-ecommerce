"use client";

import * as React from "react";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { X } from "lucide-react";

interface ChipsInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export function ChipsInput({ value, onChange, placeholder }: ChipsInputProps) {
    const [input, setInput] = React.useState("");

    const chips = value || [];

    const addChip = (chip: string) => {
        if (!chip.trim()) return;
        if (!chips.includes(chip)) {
            onChange([...chips, chip]);
        }
        setInput("");
    };

    const removeChip = (chip: string) => {
        onChange(chips.filter((c) => c !== chip));
    };

    return (
        <div className="space-y-2">
            {/* Chips */}
            <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                    <Badge
                        key={chip}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        {chip}
                        <button
                            type="button"
                            onClick={() => removeChip(chip)}
                            className="ml-1 rounded-full hover:bg-gray-200 p-0.5 cursor-pointer"
                        >
                            <X className="h-3 w-3 cursor-pointer" />
                        </button>
                    </Badge>
                ))}
            </div>

            {/* Input */}
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder || "Type and press Enter"}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addChip(input);
                    }
                }}
            />
        </div>
    );
}
