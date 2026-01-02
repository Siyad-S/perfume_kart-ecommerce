import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Edit, Trash } from "lucide-react";
import { AddressType } from "@/src/types/user";

interface Props {
    addresses: AddressType[];
    selectedAddress: any;
    setSelectedAddress: (v: any) => void;
    onEdit: (addr: AddressType) => void;
    onDelete: (id: string) => void;
}

export default function AddressList({
    addresses,
    selectedAddress,
    setSelectedAddress,
    onEdit,
    onDelete,
}: Props) {
    return (
        <RadioGroup
            value={selectedAddress.fullName || ""}
            onValueChange={(value) => {
                const found = addresses.find((a) => a.fullName === value);
                if (found) setSelectedAddress(found);
            }}
        >
            {addresses.map((addr, i) => (
                <div
                    key={addr._id || i}
                    className="flex items-center justify-between border p-3 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value={addr.fullName} id={addr._id || `a_${i}`} />
                        <Label htmlFor={addr._id || `a_${i}`}>
                            <p className="font-medium">{addr.fullName}</p>
                            <p className="text-sm text-gray-600">
                                {addr.street}, {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">📞 {addr.phone}</p>
                        </Label>
                    </div>

                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(addr)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(addr._id || "")}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </RadioGroup>
    );
}
