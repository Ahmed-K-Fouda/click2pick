import ProductList from "@/components/shared/products/product-list";
import { getLatestProduct } from "@/lib/actions/product.actions";
const page = async () => {
  const latestProduct = await getLatestProduct();
  return (
    <>
      <ProductList data={latestProduct} title="Newest Arrivals" />
    </>
  );
};

export default page;
