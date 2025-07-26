import { Product } from "@/types";
import ProductCard from "./product-card";

interface IProps {
  data: Product[];
  title: string;
  limit?: number;
}

function ProductList({ data, title, limit }: IProps) {
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.slice(0, limit).map((product: Product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      ) : (
        <div>
          <p>No Proudcts Found!</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
