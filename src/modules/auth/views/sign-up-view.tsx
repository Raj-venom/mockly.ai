"use client"

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { FaGithub, FaGoogle } from "react-icons/fa";


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const SignUpView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const handleSignUp = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setIsLoading(true);

        const { } = await authClient.signUp.email(
            {
                email: data.email,
                password: data.password,
                name: data.name,
            },
            {
                onSuccess: () => {
                    router.push("/");
                    setIsLoading(false);
                    setError(null);

                },
                onError: ({ error }) => {
                    setError(error.message);
                    setIsLoading(false);
                },
            },

        )
    }

    const onSocialSignIn = async (provider: "google" | "github") => {
        setError(null);
        setIsLoading(true);

        const { } = await authClient.signIn.social(
            {
                provider,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    setError(null);

                },
                onError: ({ error }) => {
                    setError(error.message);
                    setIsLoading(false);
                },
            },

        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <FormProvider  {...form}>
                        <form onSubmit={form.handleSubmit(handleSignUp)} className="p-6 md:p-8" >
                            <div className="flex flex-col gap-6">

                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-wxl font-bold ">Let&apos;s get started</h1>
                                    <p className="text-muted-foreground text-balance" >Create your account</p>
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="********"
                                                        {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
                                </Button>
                                <div className="relative text-center text-sm">
                                    <div className="absolute inset-x-0 top-1/2 border-t border-border -translate-y-1/2"></div>
                                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => onSocialSignIn("google")}
                                        disabled={isLoading}
                                    >
                                        <FaGoogle />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => onSocialSignIn("github")}
                                        disabled={isLoading}
                                    >
                                        <FaGithub />
                                    </Button>
                                </div>

                                <div className="text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/sign-in">
                                        Sign In
                                    </Link>
                                </div>

                            </div>
                        </form>
                    </FormProvider >
                    <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-[92px] W-[92px]"
                        />
                        <p className="text-2xl font-semibold text-white">
                            Mockly.AI
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                    Privacy Policy
                </Link>

            </div>

        </div>
    )
}
