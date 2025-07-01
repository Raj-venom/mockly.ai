"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))

    console.log(data.items.map(item => item.name), "meetings data");

    if (!data || data.items.length === 0) {
        return (
            <div>
                <p>No meetings found.</p>
            </div>
        );
    }

    return (
        <div>
            <span>
                {data.items.map((meeting) => (
                    <div key={meeting.id} className="py-2 px-4 border-b">
                        <h3 className="text-lg font-semibold">{meeting.name}</h3>
                    </div>
                ))}
            </span>
        </div>
    )
}


export const MeetingsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="Please wait while we fetch the Meetings."
        />
    )
}

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Error Loading Meetings"
            description="There was an error loading the Meetings. Please try again later."
        />
    )
}
