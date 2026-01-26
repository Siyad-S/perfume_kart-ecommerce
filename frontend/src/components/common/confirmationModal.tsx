"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "default" | "destructive";
    loadingText?: string;
    targetLabel?: string; // e.g., "Order ID", "User", "Service"
    targetValue?: string | number;
}

export function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "destructive",
    loadingText = "Processing...",
    targetLabel,
    targetValue,
}: ConfirmationModalProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {targetLabel && targetValue && (
                    <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">{targetLabel}:</span>{" "}
                        <span className="text-gray-500">{targetValue}</span>
                    </div>
                )}

                <DialogFooter className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? loadingText : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
