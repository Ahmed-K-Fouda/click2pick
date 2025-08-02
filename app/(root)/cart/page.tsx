import CartTable from "./cart-table";
import { getMyCart, isUserAuthenticated, getCartItemCount } from "@/lib/actions/cart.actions";
import AuthPrompt from "@/components/shared/checkout/auth-prompt";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();
  const isAuthenticated = await isUserAuthenticated();
  const itemCount = await getCartItemCount();

  // If no cart or empty cart, show empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <CartTable cart={cart} />
      </div>
    );
  }

  // If user is not authenticated and has items in cart, show auth prompt
  if (!isAuthenticated && cart.items.length > 0) {
    return (
      <div>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="md:col-span-3">
            <CartTable cart={cart} showCheckoutButton={false} />
          </div>
          <div className="md:col-span-1">
            <AuthPrompt 
              itemCount={itemCount} 
              totalPrice={formatCurrency(cart.totalPrice)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show normal cart
  return (
    <div>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
