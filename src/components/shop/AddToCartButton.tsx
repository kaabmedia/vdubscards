"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  variantId: string;
  available: boolean;
}

export function AddToCartButton({ variantId, available }: AddToCartButtonProps) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addLine(variantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      disabled={!available}
      className="w-full bg-gray-900 text-white hover:bg-primary hover:text-gray-900 [&_svg]:hover:text-gray-900"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {added ? "Added!" : available ? "Add to cart" : "Sold out"}
    </Button>
  );
}
