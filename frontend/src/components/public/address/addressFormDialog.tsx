"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { AddressType } from "@/src/types/user";
import { toast } from "sonner";
import AddressForm from "./addressForm";

interface Props {
    open: boolean;
    onClose: () => void;
    editingAddress: AddressType | null;
    onSave: (updatedList: AddressType[]) => void;
    addressList: AddressType[];
}

export default function AddressFormDialog({
    open,
    onClose,
    editingAddress,
    onSave,
    addressList,
}: Props) {
    const handleSubmit = (values: any) => {
        let updated: AddressType[];

        if (editingAddress) {
            updated = addressList.map((a) =>
                a._id === editingAddress._id ? { ...a, ...values } : a
            );
            toast.success("Address updated");
        } else {
            updated = [...addressList, { ...values }];
            toast.success("Address added");
        }

        onSave(updated);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingAddress ? "Edit Address" : "Add New Address"}
                    </DialogTitle>
                </DialogHeader>

                <AddressForm
                    defaultValues={editingAddress}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
}
