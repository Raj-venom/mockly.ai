import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useRouter } from "next/navigation";
import { MeetingForm } from "./meeting-form";

interface NewMeetingDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export const NewMeetingDialog = ({ isOpen, onOpenChange }: NewMeetingDialogProps) => {
    const router = useRouter();

    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="New Meeting"
            description="Fill in the details to create a new meeting."
        >
            <MeetingForm
                onSuccess={(id) => {
                    router.push(`/meetings/${id}`)
                    onOpenChange(false)
                }}
                onCancel={() => onOpenChange(false)}

            />
        </ResponsiveDialog>
    )
}