"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
  quantityAvailable?: number | null;
}

export function AddToCartButton({
  variantId,
  available,
  quantityAvailable,
}: AddToCartButtonProps) {
  const { addLine, removeLine, lines } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = lines.find((l) => l.variantId === variantId)?.quantity ?? 0;
  const atMax =
    quantityAvailable != null &&
    quantityAvailable > 0 &&
    inCart >= quantityAvailable;

  const handleAdd = () => {
    addLine(variantId, 1, quantityAvailable ?? undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleRemove = () => removeLine(variantId);

  if (inCart > 0 && atMax) {
    return (
      <Button
        size="lg"
        onClick={handleRemove}
        variant="outline"
        className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Remove from bag
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleAdd}
      disabled={!available}
      className="w-full bg-gray-900 text-white hover:bg-primary hover:text-gray-900 [&_svg]:hover:text-gray-900"
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {added
        ? "Added!"
        : available
          ? "Add to bag"
          : "Sold out"}
    </Button>
  );
}
