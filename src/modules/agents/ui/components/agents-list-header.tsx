"use client";

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react"
import { NewAgentDialog } from "./new-agent-dialog"
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilter } from "./agent-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentLIstHeader = () => {
    const [filter, setFilter] = useAgentsFilters();
    const [isDialogOpen, setDialogOpen] = useState(false);

    const isAnyFilterModified = !!filter.search;

    const onClearFilters = () => {
        setFilter({
            search: "",
            page: DEFAULT_PAGE
        })
    }

    return (
        <>
            <NewAgentDialog
                isOpen={isDialogOpen}
                onOpenChange={setDialogOpen}

            />
            <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Agents</h5>
                    <Button onClick={() => setDialogOpen(true)}>
                        <PlusIcon />
                        New Agent
                    </Button>
                </div>
                <div className="flex items-center gap-x-2 p-1">
                    <AgentsSearchFilter />
                    {
                        isAnyFilterModified && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onClearFilters}
                            >
                                <XCircleIcon />
                                Clear
                            </Button>
                        )
                    }
                </div>
            </div>
        </>
    )
}
