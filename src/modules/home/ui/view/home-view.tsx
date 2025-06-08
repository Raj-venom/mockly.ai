"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { useRouter } from 'next/navigation';

export const HomeView = () => {
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()

    const router = useRouter();

    if (isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!isPending && !session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
            </div>
        )
    }



    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Welcome, {session?.user.name}!</h1>
                <p className="mb-4">You are email: {session?.user.email}</p>
                <Button onClick={() => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => router.push("/sign-in"),
                        onError: (error) => console.error("Sign out error:", error)
                    }
                })}>Sign Out</Button>
            </div>

        </div>
    )
}
