import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import UserButton from "./user-button";
import CartIndicator from "./cart-indicator";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant={"ghost"}>
          <Link href="/cart" className="relative">
            <CartIndicator />
            <span className="ml-2">Cart</span>
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart" className="relative">
                  <CartIndicator />
                  <span className="ml-2">Cart</span>
                </Link>
              </Button>
              <UserButton />
              <SheetDescription></SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default Menu;
