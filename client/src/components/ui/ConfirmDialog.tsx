import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    trigger?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    trigger,
    confirmText = "Continue",
    cancelText = "Cancel",
    variant = "default",
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent className="bg-white border-4 border-pink-200 rounded-xl font-sans">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-pink-600 font-bold">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-2 border-gray-200 text-gray-500 font-bold rounded-lg hover:bg-gray-100">
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className={`${variant === "destructive" ? "bg-red-500 hover:bg-red-600" : "bg-pink-500 hover:bg-pink-600"
                            } text-white font-bold rounded-lg border-b-4 ${variant === "destructive" ? "border-red-700" : "border-pink-700"
                            } active:border-b-0 active:translate-y-1 transition-all`}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
