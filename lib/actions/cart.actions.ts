"use server";

import { CartItems } from "@/types";
import { convertToPlainObj, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validation/validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// calc cart price
const calcPrice = (items: CartItems[]) => {
  const itemPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = round2(itemPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemPrice);
  const totalPrice = round2(itemPrice + shippingPrice + taxPrice);

  return {
    itemPrice: itemPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

// Merge cart items intelligently
const mergeCartItems = (existingItems: CartItems[], newItems: CartItems[]): CartItems[] => {
  const mergedItems = [...existingItems];
  
  newItems.forEach(newItem => {
    const existingItemIndex = mergedItems.findIndex(item => item.productId === newItem.productId);
    
    if (existingItemIndex !== -1) {
      // Item exists, update quantity
      mergedItems[existingItemIndex].qty += newItem.qty;
    } else {
      // Item doesn't exist, add it
      mergedItems.push(newItem);
    }
  });
  
  return mergedItems;
};

// add item to cart fun
export async function addItemToCart(data: CartItems) {
  try {
    // check cart cookie and get the sessionId
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    // check
    if (!sessionCartId) throw new Error("Can't find cart session");
    // GET session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // GET cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in DB
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product Not found");

    if (!cart) {
      // create new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });
      // revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} Added to cart successfully`,
      };
    } else {
      // check if item already in the cart
      const existItem = (cart.items as CartItems[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // check the stock
        if (product.stock < existItem.qty + 1) {
          throw new Error(`The product sold out coming soon!`);
        }
        // increase QTY
        (cart.items as CartItems[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
      } else {
        // if item dosn't exist in cart
        // check the stock
        if (product.stock < 1) {
          throw new Error("The product sold out coming soon!");
        }
        // add item to cart.items
        cart.items.push(item);
      }
      //   save to DB
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItems[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "Updated in" : "Added to"
        } Cart`,
      };
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getMyCart() {
  // check cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Can't find cart session");

  //   get session and userID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //   GET user cart from DB
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  //   convert decimal and return
  return convertToPlainObj({
    ...cart,
    items: cart.items as CartItems[],
    itemPrice: cart.itemPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Can't find cart session");

    // GET product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    // GET user Cart
    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found!");

    // Check the item if exist
    const exist = (cart.items as CartItems[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    // check if only one product
    if (exist.qty === 1) {
      // Remove
      cart.items = (cart.items as CartItems[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      // Decrease QTY
      (cart.items as CartItems[]).find((x) => x.productId === productId)!.qty =
        exist.qty - 1;
    }
    // update in DB
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItems[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} Was removed from cart successfully!`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// New function to merge guest cart with user cart after registration
export async function mergeGuestCartWithUser(userId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) return { success: true, message: "No guest cart to merge" };

    // Get guest cart
    const guestCart = await prisma.cart.findFirst({
      where: { sessionCartId, userId: null },
    });

    if (!guestCart) return { success: true, message: "No guest cart found" };

    // Get user's existing cart
    const userCart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!userCart) {
      // User has no cart, simply assign guest cart to user
      await prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId },
      });
      return { success: true, message: "Guest cart assigned to user" };
    }

    // Merge cart items
    const mergedItems = mergeCartItems(
      userCart.items as CartItems[],
      guestCart.items as CartItems[]
    );

    // Update user cart with merged items
    await prisma.cart.update({
      where: { id: userCart.id },
      data: {
        items: mergedItems as Prisma.CartUpdateitemsInput[],
        ...calcPrice(mergedItems),
      },
    });

    // Delete guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    return { success: true, message: "Guest cart merged with user cart" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// New function to check if user is authenticated
export async function isUserAuthenticated() {
  const session = await auth();
  return !!session?.user?.id;
}

// New function to get cart item count
export async function getCartItemCount() {
  try {
    const cart = await getMyCart();
    if (!cart) return 0;
    
    return (cart.items as CartItems[]).reduce((acc, item) => acc + item.qty, 0);
  } catch (error) {
    return 0;
  }
}

// New function to clear cart
export async function clearCart() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Can't find cart session");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    await prisma.cart.deleteMany({
      where: userId ? { userId } : { sessionCartId },
    });

    return { success: true, message: "Cart cleared successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
