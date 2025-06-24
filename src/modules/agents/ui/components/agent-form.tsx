import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";




interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();


    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(
                    `Failed to create agent: ${error.message || "Unknown error"}`,
                )
            }
        })
    );

    const UpdateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({}),
                );

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    )
                }

                onSuccess?.();
            },
            onError: (error) => {
                toast.error(
                    `Failed to create agent: ${error.message || "Unknown error"}`,
                )
            }
        })
    );


    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            instructions: initialValues?.instructions || ""
        }
    })

    const isEdit = !!initialValues;
    const isPending = createAgent.isPending || UpdateAgent.isPending;

    const onSubmit = (value: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            UpdateAgent.mutate({ ...value, id: initialValues.id });
        } else {
            createAgent.mutate(value);
        }
    }


    return (
        <Form {...form} >
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} >
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="botttsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <input
                                    className="border rounded-md p-2 w-full"
                                    {...field}
                                    placeholder="e.g. Gym Trainer"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}

                />

                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instruction</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Your are a gym trainer. You help people to get fit and healthy. You are friendly and encouraging."
                                    className="resize-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}

                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}

                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="ml-2"

                    >
                        {isEdit ? "Update Agent" : "Create Agent"}
                    </Button>

                </div>

            </form>

        </Form>
    )

}