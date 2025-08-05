import { getOrderById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";
export const metadata: Metadata = {
  title: "Order Details",
};

interface IProps {
  params: Promise<{
    id: string;
  }>;
}
const OrderDetailsPage = async ({ params }: IProps) => {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  );
};

export default OrderDetailsPage;
