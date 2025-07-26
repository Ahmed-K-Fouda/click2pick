"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface IProps {
  images: string[];
}
const ProductImages = ({ images }: IProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <div className="space-y-4">
      <Image
        src={images[currentIdx]}
        alt="Product Image"
        width={1000}
        height={1000}
        className="min-h-[300] object-center object-cover"
      />
      <div className="flex">
        {images.map((image, idx) => (
          <div
            key={image}
            onClick={() => setCurrentIdx(idx)}
            className={cn(
              "border-2  mr-2 cursor-pointer hover:border-orange-600",
              currentIdx === idx && "border-orange-500"
            )}
          >
            <Image src={image} alt="Image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
