"use client";
import * as React from "react";
import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useContactSupportMutation } from "@/src/redux/apis/support";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function HelpDialog() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [contactSupport, { isLoading }] = useContactSupportMutation();

    // Simple state management for the form
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await contactSupport(formData).unwrap();
            toast.success("Support request sent successfully");
            setIsOpen(false);
            setFormData({ name: "", email: "", message: "" }); // Reset form
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send request");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Help</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Need Help?</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we’ll get back to you shortly.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="name"
                        >
                            Your Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="email"
                        >
                            Your Email
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="message"
                        >
                            Message
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Describe your issue..."
                            required
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
