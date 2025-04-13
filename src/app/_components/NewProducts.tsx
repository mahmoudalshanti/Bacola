"use client";

import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProductCard from "./ProductCard";
import { useProduct, UserProduct } from "../_context/ProductsProvider";
import { actionGetNewProducts } from "../dashboard/_actions/actionDashboard";
import PageLoading from "@/components/PageLoading";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserProvider";

function NewProducts() {
  const [isHovered, setIsHovered] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const { setProductsNewest, getNewest } = useProduct();
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoadingPage(true);
        const newProducts = await actionGetNewProducts();
        if (Array.isArray(newProducts.products))
          setProductsNewest(
            newProducts.products.map((product) => ({
              ...product,
              newest: true,
            })) as unknown as UserProduct[]
          );

        if (newProducts.errMsg) throw new Error(newProducts?.errMsg);
      } catch (err) {
        console.error("Something went Error!", err);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchNewProducts();
  }, []);

  return (
    <div className="py-8 xl:p-0">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-slate-900 font-bold text-lg xl:text-xl">
            NEW PRODUCTS
          </p>
          <p className="text-slate-500 text-sm">
            New products with updated stocks.
          </p>
        </div>
        <Button
          onClick={() => router.push("/product-category")}
          variant="outline"
          className="rounded-full flex items-center gap-2 text-xs md:text-sm font-medium px-4 md:px-5 text-slate-600 hover:bg-slate-100 hover:text-slate-800 h-9"
        >
          View All
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="mx-auto relative">
        {loading && (
          <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
        )}
        {loadingPage ? (
          <PageLoading />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getNewest()?.length > 0 ? (
              getNewest()?.map((product: UserProduct) => (
                <ProductCard
                  key={product.id}
                  product={product as UserProduct}
                  isHovered={isHovered}
                  setIsHovered={setIsHovered}
                  loading={loading}
                  setLoading={setLoading}
                />
              ))
            ) : (
              <p className="text-gray-800 text-base text-center col-span-full">
                No products found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewProducts;
