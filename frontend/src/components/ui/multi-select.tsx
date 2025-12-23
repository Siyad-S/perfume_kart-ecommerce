"use client";

import * as React from "react";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty } from "@/src/components/ui/command";
import { Badge } from "@/src/components/ui/badge";
import { X } from "lucide-react";
import { CommandInput } from "@/src/components/ui/command";

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    placeholder?: string;
}

export function MultiSelect({ value, onChange, options, placeholder }: MultiSelectProps) {

    const handleSelect = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter((v) => v !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <div className="space-y-2">
            {/* Selected values as badges */}
            <div className="flex flex-wrap gap-2">
                {value.map((v) => (
                    <Badge key={v} variant="secondary" className="flex items-center gap-1">
                        {v}
                        <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => onChange(value.filter((val) => val !== v))}
                        />
                    </Badge>
                ))}
            </div>

            {/* Command (combobox) for selecting */}
            <Command shouldFilter={true}>
                <CommandInput placeholder={placeholder || "Search..."} />
                <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                        {options.map((opt) => (
                            <CommandItem
                                key={opt}
                                value={opt}
                                onSelect={() => handleSelect(opt)}
                            >
                                {opt} {value.includes(opt) && "✓"}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
}
