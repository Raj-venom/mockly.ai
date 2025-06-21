
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";




export const AgentView = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    if (!data || data.length === 0) {
        return (
            <div>
                <EmptyState
                    title="No Agents Found"
                    description="You have not created any agents yet. Click the button below to create your first agent."

                />
            </div>
        );
    }

    return (
        <div
            className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4"
        >

            <DataTable
                data={data}
                columns={columns}
            />

        </div>
    )
}


export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="Please wait while we fetch the agents."
        />
    )
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Agents"
            description="There was an error loading the agents. Please try again later."
        />
    )
}
