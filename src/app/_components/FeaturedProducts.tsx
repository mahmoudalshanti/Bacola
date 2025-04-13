"use clinet";

import React from "react";
import { actionGetFeaturedProducts } from "../dashboard/_actions/actionDashboard";
import { capitalizeIfAmpersand } from "@/lib/utils";
import Link from "next/link";

async function FeaturedProducts() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = (await actionGetFeaturedProducts()) as Product[];
    if ("errMsg" in featuredProducts)
      if (featuredProducts.errMsg)
        throw new Error(featuredProducts?.errMsg as string);
  } catch (err) {
    console.error(err);
  }

  return (
    <div>
      <p className="text-slate-900 font-bold text-sm mt-12">
        FEATURED PRODUCTS
      </p>

      <ProductBanner products={featuredProducts} />
    </div>
  );
}

const ProductBanner = ({ products }: { products: Product[] }) => {
  return (
    <div className="w-full bg-white border rounded-sm border-slate-300 p-4 mt-2  ">
      {products?.map((product: Product) => (
        <div key={product?.id} className="flex items-center mb-10">
          <img
            src={product?.images[0].image}
            alt={product?.name}
            className="w-12 h-12 object-cover  sm:w-14 sm:h-14 md:w-24 md:h-24 lg:w-12 xl:h-12"
          />
          <div className="ml-3">
            <Link
              href={`/product/${product.id}`}
              className="text-sm block font-medium sm:text-base xl:text-sm text-gray-900 truncate w-[160px] sm:w-[190px] md:w-full lg:w-[130px] xl:w-[160px] cursor-pointer hover:text-blue-700"
            >
              {capitalizeIfAmpersand(product?.name)}
            </Link>
            <div className="flex items-center space-x-2">
              {product?.offer !== 0 && (
                <p className="text-xs text-gray-400 line-through">
                  {product?.offer}
                </p>
              )}

              <p className="text-sm text-pink-700  font-semibold">
                {product?.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
