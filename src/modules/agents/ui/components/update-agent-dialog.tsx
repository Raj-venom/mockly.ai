import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    initialValues: AgentGetOne;
};

export const UpdateAgentDialog = ({ isOpen, onOpenChange, initialValues }: UpdateAgentDialogProps) => {
    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Update Agent"
            description="Update the details of your agent."
        >
            <AgentForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}