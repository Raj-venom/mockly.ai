"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DasboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {

    const { state, toggleSidebar, isMobile } = useSidebar();
    const [commandOpen, setCommandOpen] = useState(false);


    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setCommandOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <DasboardCommand
                open={commandOpen}
                setOpen={setCommandOpen}
            />

            <nav className="flex px-4 gap-x-2 py-3 items-center border-b bg-background">
                <Button className="size-9" variant="outline" onClick={toggleSidebar}>
                    {(state === "collapsed" || isMobile) ? <PanelLeftIcon className="size-4" /> :
                        <PanelLeftCloseIcon className="size-4" />
                    }
                </Button>
                <Button
                    className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground"
                    variant="outline"
                    size="sm"
                    onClick={() => setCommandOpen((prev) => !prev)}
                >
                    <SearchIcon />
                    Search
                    <kbd className="ml-auto text-xs pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted text-[10px] font-medium text-muted-foreground">
                        <span className="ml-auto">Ctrl</span>
                        <span className="ml-1">+</span>
                        <span className="ml-1">K</span>
                    </kbd>
                </Button>
            </nav>
        </>
    )
}
