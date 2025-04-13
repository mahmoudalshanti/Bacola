"use client";

import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { actionGetBestSeller } from "../dashboard/_actions/actionDashboard";
import { useProduct, UserProduct } from "../_context/ProductsProvider";
import PageLoading from "@/components/PageLoading";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useUser } from "../_context/UserProvider";

function BestSeller() {
  const [isHovered, setIsHovered] = useState<string>("");
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setProductsBest, getBestSeller } = useProduct();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        setLoadingPage(true);
        const bestProducts = await actionGetBestSeller();
        if (Array.isArray(bestProducts))
          setProductsBest(
            bestProducts.map((product) => ({
              ...product,
              best: true,
            })) as unknown as UserProduct[]
          );

        if ("errMsg" in bestProducts) {
          if (bestProducts.errMsg) throw new Error(bestProducts.errMsg);
        }
      } catch (err) {
        console.log("Something went Error!", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchBestProducts();
  }, []);

  return (
    <div className="mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-slate-900 font-bold text-lg xl:text-xl">
            BEST SELLERS
          </p>
          <p className="text-slate-500 text-sm">
            Do not miss the current offers until the end of March.
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

      {/* Carousel */}
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
        )}
        {loadingPage ? (
          <div className="flex justify-center items-center h-64">
            <PageLoading />
          </div>
        ) : getBestSeller()?.length > 0 ? (
          <Carousel
            className="w-full h-full"
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {getBestSeller().map((product: Product) => (
                <CarouselItem
                  key={product.id}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 basis-1/2 relative"
                  onMouseEnter={() => setIsHovered(product.id)}
                  onMouseLeave={() => setIsHovered("")}
                >
                  <ProductCard
                    product={product as UserProduct}
                    isHovered={isHovered}
                    setIsHovered={setIsHovered}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200" />
            <CarouselNext className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200" />
          </Carousel>
        ) : (
          <p className="text-gray-800 text-base text-center py-12">
            No best selling products found
          </p>
        )}
      </div>
    </div>
  );
}

export default BestSeller;
