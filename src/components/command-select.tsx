import { ReactNode, useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandResponsiveDialog,
} from "./ui/command";
import { CommandList } from "cmdk";


interface CommandSelectProps {
    options: Array<{
        id: string;
        value: string;
        children: ReactNode;
    }>;
    onSelect: (value: string) => void;
    onSearch?: (query: string) => void;
    value: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an agent",
    className,
}: CommandSelectProps) => {

    const [open, setOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    return (
        <>
            <Button
                type="button"
                variant="outline"
                className={cn("h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className
                )}
                onClick={() => setOpen(true)}
            >
                <div>
                    {selectedOption?.children ?? placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>

            <CommandResponsiveDialog
                shouldFilter={!onSearch}
                open={open}
                onOpenChange={setOpen}
            >
                <CommandInput placeholder="Search agents..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty>
                        <span
                            className="text-muted-foreground text-sm"
                        >
                            No option found
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            value={option.value}
                            onSelect={() => {
                                onSelect(option.value)
                                setOpen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}

                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}