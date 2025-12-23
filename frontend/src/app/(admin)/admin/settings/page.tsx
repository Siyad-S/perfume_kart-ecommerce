"use client"

import { Button } from "@/src/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Separator } from "@/src/components/ui/separator"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Platform Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage detailed settings for your e-commerce platform.
                </p>
            </div>
            <Separator />
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                            <CardDescription>
                                Basic details involved in your store and support interactions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="storeName">Store Name</Label>
                                <Input id="storeName" defaultValue="Fragrance Kart" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input id="supportEmail" type="email" defaultValue="support@fragrancekart.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select defaultValue="inr">
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usd">USD ($)</SelectItem>
                                        <SelectItem value="inr">INR (₹)</SelectItem>
                                        <SelectItem value="eur">EUR (€)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save General Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Product Settings */}
                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory & Catalog</CardTitle>
                            <CardDescription>
                                Configure how products are displayed and managed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="lowStock">Low Stock Threshold</Label>
                                <Input id="lowStock" type="number" defaultValue="5" />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Products below this quantity will be flagged as low stock.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="enableReviews" defaultChecked />
                                <Label htmlFor="enableReviews">Enable Product Reviews</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="showOutOfStock" />
                                <Label htmlFor="showOutOfStock">Show Out of Stock Products</Label>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Product Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Order Settings */}
                <TabsContent value="orders" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Processing</CardTitle>
                            <CardDescription>
                                Manage how orders are handled and numbered.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="orderPrefix">Order ID Prefix</Label>
                                <Input id="orderPrefix" defaultValue="ORD-" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="autoConfirm" />
                                <Label htmlFor="autoConfirm">Automatically Confirm New Orders</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="emailInvoices" defaultChecked />
                                <Label htmlFor="emailInvoices">Email Invoices to Customers</Label>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Order Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security & Access</CardTitle>
                            <CardDescription>
                                Manage access controls and platform security.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                <Input id="sessionTimeout" type="number" defaultValue="30" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="maintenanceMode" />
                                <Label htmlFor="maintenanceMode" className="text-destructive">Enable Maintenance Mode</Label>
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Maintenance mode will prevent customers from accessing the store.
                            </p>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button variant="destructive">Save Security Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
