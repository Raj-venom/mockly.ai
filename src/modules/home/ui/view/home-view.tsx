"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";


export const HomeView = () => {

    const trpc = useTRPC();
    const { data } = useQuery(trpc.hello.queryOptions({ text: "raj" }));



    return (
        <div>
            {data?.greeting ? (
                <h1 className="text-2xl font-bold">

                    {data.greeting}
                </h1>
            ) : (
                <h1 className="text-2xl font-bold">
                    Loading...
                </h1>
            )}

        </div>
    )
}
