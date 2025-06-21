
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"

export const AgentView = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    if (!data || data.length === 0) {
        return (
            <div>
                <h1>No Agents Found</h1>
                <p>There are currently no agents available.</p>
            </div>
        );
    }

    return (
        <div>

            <h1>Agents</h1>
            <ul>
                {data.map(agent => (
                    <li key={agent.id}>
                        {agent.name} - {agent.instructions}
                        <br />
                        <strong>Created at:</strong> {new Date(agent.createdAt).toString()}
                    </li>
                ))}
            </ul>

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
