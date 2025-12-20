"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

interface ProductCardProps {
  title: string;
  description: string;
  price: number | string;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductCard({ title, description, price, imageUrl, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full w-full max-w-full pt-0">
      <Image
        src={imageUrl || "https://via.placeholder.com/400x300"}
        alt={title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>{description}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">${price}</p>
      </CardContent>
      <CardFooter className="mt-auto gap-2 flex justify-end">
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
