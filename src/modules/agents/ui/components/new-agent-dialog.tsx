import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export const NewAgentDialog = ({ isOpen, onOpenChange }: NewAgentDialogProps) => {
    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Create New Agent"
            description="Fill in the details to create a new agent."
        >
            <AgentForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}

            />
        </ResponsiveDialog>
    )
}