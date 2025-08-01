"use client";

import { Button } from "@/components/ui/button";
import { Cart, CartItems } from "@/types";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { Plus, Minus, Loader } from "lucide-react";
import { useTransition } from "react";
interface IProps {
  item: CartItems;
  cart?: Cart;
}

const AddToCart = ({ item, cart }: IProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      // error handle
      if (!res?.success) {
        toast.error(res?.message, {
          className:
            "bg-red-500 text-white w-full p-3 flex items-center justify-start gap-4 rounded-md shadow-md",
          unstyled: true,
        });
        return;
      }
      // success

      toast.success(res.message, {
        // unstyled: true,
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  // handleRemoveFromCart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      try {
        const res = await removeItemFromCart(item.productId);

        if (!res || typeof res.success === "undefined") {
          toast.error("Something went wrong while removing the item.");
          return;
        }

        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    });
  };

  // Check if item in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="animate-spin w-4 h-4" />
        ) : (
          <Minus className=" h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer"
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="animate-spin w-4 h-4" />
        ) : (
          <Plus className=" h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full mt-4 cursor-pointer"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="animate-spin w-4 h-4" />
      ) : (
        <Plus className=" h-4 w-4 cursor-pointer" />
      )}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
