"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

import { useTypedSelector } from "@/src/redux/store";
import {
    useGetAddressesQuery,
    useUpdateUserMutation
} from "@/src/redux/apis/users";

import { AddressType } from "@/src/types/user";
import AddressFormDialog from "@/src/components/user/address/addressFormDialog";
import { ConfirmationModal } from "@/src/components/common/confirmationModal";

export default function ManageAddressesPage() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;

    const { data, isLoading, isError } = useGetAddressesQuery(user?._id || "", {
        skip: !isLoggedIn,
    });

    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

    const [addresses, setAddresses] = useState<AddressType[]>([]);
    const [defaultAddress, setDefaultAddress] = useState<string>("");

    const [openModal, setOpenModal] = useState(false);
    const [editAddress, setEditAddress] = useState<AddressType | null>(null);
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        addressId: "" as string,
        fullName: "" as string
    });

    // Load addresses
    useEffect(() => {
        if (data?.data) {
            setAddresses(data.data);

            const defaultAddr = data.data.find((a) => a.isDefault);
            setDefaultAddress(defaultAddr?._id || "");
        }
    }, [data]);

    // Update on server
    const updateAddressesOnServer = (updated: AddressType[]) => {
        setAddresses(updated);

        updateUser({
            id: user!._id,
            updates: { addresses: updated }
        })
            .unwrap()
            .then(() => toast.success("Updated successfully"))
            .catch(() => toast.error("Failed to update"));
    };

    // Actual delete handler
    const handleDelete = async (id: string) => {
        const updated = addresses.filter((a) => a._id !== id);
        updateAddressesOnServer(updated);

        // Set new default if removed default address
        if (id === defaultAddress) {
            const first = updated[0];
            if (first) {
                first.isDefault = true;
                setDefaultAddress(first._id!);
                updateAddressesOnServer([...updated]);
            }
        }

        toast.success("Address removed");
    };

    if (!isLoggedIn) return <p className="p-6 text-center">Please log in.</p>;

    if (isLoading) return <p className="p-6 text-center">Loading...</p>;
    if (isError) return <p className="p-6 text-center text-red-500">Failed to load.</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Addresses</h1>
                    <p className="text-sm text-gray-600">
                        Manage your saved delivery addresses.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditAddress(null);
                        setOpenModal(true);
                    }}
                >
                    + Add New Address
                </Button>
            </div>

            {/* Address List */}
            <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((addr, index) => (
                    <Card key={addr._id || index} className="p-4 space-y-2 relative">

                        {addr.isDefault && (
                            <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Default
                            </span>
                        )}

                        <p className="font-medium text-lg">{addr.fullName}</p>
                        <p className="text-sm text-gray-700">
                            {addr.street}, {addr.city}, {addr.state}
                        </p>
                        <p className="text-sm text-gray-700">
                            {addr.country} - {addr.postal_code}
                        </p>
                        <p className="text-sm text-gray-700">
                            📞 {addr.phone}
                        </p>

                        <div className="flex gap-2 pt-2">

                            {/* Edit button */}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setEditAddress(addr);
                                    setOpenModal(true);
                                }}
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            {/* Delete button with confirmation modal */}
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    setDeleteModal({
                                        open: true,
                                        addressId: addr._id!,
                                        fullName: addr.fullName
                                    })
                                }
                            >
                                <Trash className="h-4 w-4" />
                            </Button>

                        </div>
                    </Card>
                ))}
            </div>

            {/* Address Form Dialog */}
            <AddressFormDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                editingAddress={editAddress}
                addressList={addresses}
                onSave={(updatedList) => updateAddressesOnServer(updatedList)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                open={deleteModal.open}
                onClose={() => setDeleteModal({
                    open: false,
                    addressId: "",
                    fullName: ""
                })}
                onConfirm={async () => {
                    await handleDelete(deleteModal.addressId);
                }}
                title="Delete Address"
                description="Are you sure you want to delete this address? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="destructive"
                targetLabel=""
                targetValue={""}
            />
        </div>
    );
}
