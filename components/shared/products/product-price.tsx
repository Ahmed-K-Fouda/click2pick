import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //   Ensure two decimal places
  const stringValue = value.toFixed(2); // 55 => 55,00

  //   Get the int/float and destruct ==> [int,float] = stringValue.split('.') ==> 55.15 ==> 55:int, 15:float
  const [int, float] = stringValue.split(".");
  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {int}
      <span className="text-xs align-super">.{float}</span>
    </p>
  );
};

export default ProductPrice;
