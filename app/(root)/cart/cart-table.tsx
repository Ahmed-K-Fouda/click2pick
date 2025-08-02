"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface IProps {
  cart?: Cart;
  showCheckoutButton?: boolean;
}

const CartTable = ({ cart, showCheckoutButton = true }: IProps) => {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdd = async (item: Cart["items"][0]) => {
    setLoadingItemId(item.productId);
    const res = await addItemToCart(item);
    if (!res.success) {
      toast.error(res.message);
    }
    setLoadingItemId(null);
    router.refresh();
  };

  const handleRemove = async (productId: string) => {
    setLoadingItemId(productId);
    const res = await removeItemFromCart(productId);
    if (!res.success) {
      toast.error(res.message);
    }
    setLoadingItemId(null);
    router.refresh();
  };

  return (
    <div>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            width={150}
            height={150}
            className="opacity-70"
          />
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-gray-500">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            <span>Go Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    {/* ITEM INFO */}
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>

                    {/* QUANTITY */}
                    <TableCell className="flex-center gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        type="button"
                        disabled={loadingItemId === item.productId}
                        onClick={() => handleRemove(item.productId)}
                      >
                        {loadingItemId === item.productId ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>

                      <span>{item.qty}</span>

                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        type="button"
                        disabled={loadingItemId === item.productId}
                        onClick={() => handleAdd(item)}
                      >
                        {loadingItemId === item.productId ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>

                    {/* PRICE */}
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart.items.reduce((acc, cur) => acc + cur.qty, 0)}):
                <span className="font-bold">
                  {formatCurrency(cart.itemPrice)}
                </span>
              </div>
              {showCheckoutButton && (
                <Button
                  className="w-full cursor-pointer"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => {
                      router.push("/shipping-address");
                    })
                  }
                >
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}{" "}
                  Proceed to checkout
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable;
