"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Edit, Trash, Plus, MapPin, Phone, Home } from "lucide-react";
import { toast } from "sonner";

import { useTypedSelector } from "@/src/redux/store";
import {
    useGetAddressesQuery,
    useUpdateUserMutation
} from "@/src/redux/apis/users";

import { AddressType } from "@/src/types/user";
import AddressFormDialog from "@/src/components/public/address/addressFormDialog";
import { ConfirmationModal } from "@/src/components/common/confirmationModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/src/lib/utils";

export default function ManageAddressesPage() {
    const user = useTypedSelector((state) => state.auth.user);
    const isLoggedIn = !!user?._id;
    const containerRef = useRef<HTMLDivElement>(null);

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

    useGSAP(() => {
        if (addresses.length > 0) {
            gsap.fromTo(
                ".address-card",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: "power2.out", clearProps: "all" }
            );
        }
    }, { scope: containerRef, dependencies: [addresses] });

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

    if (!isLoggedIn) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-500">Please log in to manage your addresses.</p>
        </div>
    );

    if (isLoading) return (
        <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    if (isError) return <p className="p-6 text-center text-red-500">Failed to load addresses.</p>;

    return (
        <div className="w-full" ref={containerRef}>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your delivery locations.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditAddress(null);
                        setOpenModal(true);
                    }}
                    className="bg-black hover:bg-gray-800 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                </Button>
            </div>

            {/* Empty State */}
            {addresses.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                        <MapPin className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">No addresses saved</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                        You haven't added any shipping addresses yet. Add one to checkout faster.
                    </p>
                </div>
            )}

            {/* Address List */}
            <div className="grid sm:grid-cols-2 gap-6">
                {addresses.map((addr, index) => (
                    <Card
                        key={addr._id || index}
                        className={cn(
                            "address-card p-6 relative group transition-all duration-300 border",
                            addr.isDefault
                                ? "border-black shadow-md bg-white ring-1 ring-black/5"
                                : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 bg-white"
                        )}
                    >
                        {addr.isDefault && (
                            <span className="absolute top-4 right-4 bg-black text-white text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">
                                Default
                            </span>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                addr.isDefault ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                            )}>
                                <Home className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{addr.fullName}</h3>
                                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <Phone className="w-3 h-3" /> {addr.phone}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 leading-relaxed pl-14">
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state}</p>
                            <p>{addr.country} - {addr.postal_code}</p>
                        </div>

                        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

                            {/* Edit button */}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 hover:bg-gray-100 text-gray-600"
                                onClick={() => {
                                    setEditAddress(addr);
                                    setOpenModal(true);
                                }}
                            >
                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                            </Button>

                            {/* Delete button with confirmation modal */}
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 hover:bg-red-50 text-red-500 hover:text-red-600"
                                onClick={() =>
                                    setDeleteModal({
                                        open: true,
                                        addressId: addr._id!,
                                        fullName: addr.fullName
                                    })
                                }
                            >
                                <Trash className="h-3.5 w-3.5 mr-1" /> Delete
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
