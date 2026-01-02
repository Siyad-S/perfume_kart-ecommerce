"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useTypedSelector } from "@/src/redux/store";
import { useGetAddressesQuery, useUpdateUserMutation } from "@/src/redux/apis/users";
import { toast } from "sonner";
import { AddressType } from "@/src/types/user";
import AddressList from "../address/addressList";
import AddressFormDialog from "../address/addressFormDialog";

interface ShippingAddressType {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

interface AddressSectionProps {
  selectedAddress: ShippingAddressType;
  setSelectedAddress: (value: ShippingAddressType) => void;
}

export default function AddressSection({
  selectedAddress,
  setSelectedAddress,
}: AddressSectionProps) {
  const user = useTypedSelector((state) => state.auth.user);
  const isLoggedIn = !!user?._id;

  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);

  const { data, isLoading, isError } = useGetAddressesQuery(user?._id || "", {
    skip: !isLoggedIn,
  });

  const [updateUser] = useUpdateUserMutation();

  /** Fetch and set addresses */
  useEffect(() => {
    if (data?.data) {
      setAddresses(data.data);
      if (!selectedAddress.fullName && data.data.length > 0) {
        setSelectedAddress(data.data[0]);
      }
    }
  }, [data]);

  /** Update address */
  const updateAddress = (newList: AddressType[]) => {
    setAddresses(newList);

    if (isLoggedIn) {
      updateUser({ id: user!._id, updates: { addresses: newList } }).catch(() =>
        toast.error("Failed to update addresses")
      );
    }
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a._id !== id);
    updateAddress(updated);
    toast.success("Address deleted");
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Delivery Address</h2>

        <AddressList
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          onEdit={(addr) => {
            setEditingAddress(addr);
            setOpenDialog(true);
          }}
          onDelete={handleDeleteAddress}
        />

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setEditingAddress(null);
            setOpenDialog(true);
          }}
        >
          + Add New Address
        </Button>
      </CardContent>

      <AddressFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingAddress={editingAddress}
        onSave={(newList) => updateAddress(newList)}
        addressList={addresses}
      />
    </Card>
  );
}
