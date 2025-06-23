import { auth } from '@/lib/auth';
import { AgentLIstHeader } from '@/modules/agents/ui/components/agents-list-header';
import { AgentsViewError, AgentsViewLoading, AgentView } from '@/modules/agents/ui/views/agent-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react'
import { ErrorBoundary } from "react-error-boundary";

import type { SearchParams } from 'nuqs';
import { loadSearchParams } from '@/modules/agents/params';
interface Props {
    searchParams: Promise<SearchParams>
}

const AgentPage = async ({ searchParams }: Props) => {

    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters // filter with search and page
    }));

    return (
        <>
            <AgentLIstHeader />
            <HydrationBoundary state={dehydrate(queryClient)} >
                <Suspense fallback={<AgentsViewLoading />}>
                    <ErrorBoundary fallback={<AgentsViewError />}>
                        <AgentView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    )
}


export default AgentPage;