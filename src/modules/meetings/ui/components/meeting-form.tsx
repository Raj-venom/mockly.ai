import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useDebounce } from "@/hooks/use-debounce";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState<string>("");
    const debouncedAgentSearch = useDebounce(agentSearch, 100);

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: debouncedAgentSearch,
        }),
    )

    console.log(agents.data?.items.map((agent) => agent.name), "agents");

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(
                    `Failed to create agent: ${error.message || "Unknown error"}`,
                )
            }
        })
    );

    const UpdateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({}),
                );

                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                    )
                }

                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(
                    `Failed to create agent: ${error.message || "Unknown error"}`,
                )
            }
        })
    );


    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name || "",
            agentId: initialValues?.agentId || "",
        }
    })

    const isEdit = !!initialValues;
    const isPending = createMeeting.isPending || UpdateMeeting.isPending;

    const onSubmit = (value: z.infer<typeof meetingsInsertSchema>) => {
        if (isEdit) {
            UpdateMeeting.mutate({ ...value, id: initialValues.id });
        } else {
            createMeeting.mutate(value);
        }
    }


    return (
        <>
            <NewAgentDialog
                isOpen={openNewAgentDialog}
                onOpenChange={setOpenNewAgentDialog}
            />
            <Form {...form} >
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} >

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
                                        placeholder="e.g. Gym talk"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />

                    <FormField
                        name="agentId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options={(agents.data?.items || []).map(agent => ({
                                            id: agent.id,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar
                                                        seed={agent.name}
                                                        variant="botttsNeutral"
                                                        className="border size-6"
                                                    />
                                                    <span>{agent.name}</span>
                                                </div>
                                            )
                                        }))}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder="Select an agent"

                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you&apos;re looking for?
                                    <Button
                                        className="ml-[-10px]"
                                        variant="link"
                                        type="button"
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create new agent
                                    </Button>
                                </FormDescription>
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
                            {isEdit ? "Update Meeting" : "Create Meeting"}
                        </Button>

                    </div>

                </form>

            </Form>
        </>

    )

}