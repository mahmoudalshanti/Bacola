"use client";

import ProductCard from "@/app/_components/ProductCard";
import { useProduct, UserProduct } from "@/app/_context/ProductsProvider";
import CustomLoading from "@/components/CustomLoading";
import PageLoading from "@/components/PageLoading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useMemo } from "react";

function Products({
  loading: loadingFilter,
  gridSort,
  setPagination,
  pagination,
}: {
  loading: boolean;
  gridSort: 1 | 2 | 3;
  setPagination: React.Dispatch<React.SetStateAction<number>>;
  pagination: number;
}) {
  const [isHovered, setIsHovered] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { products, filter } = useProduct();
  // Dynamic grid columns based on gridSort
  const gridColumns = useMemo(() => {
    switch (gridSort) {
      case 1:
        return "grid-cols-1"; // Single column
      case 2:
        return "grid-cols-2"; // Two columns
      case 3:
        return "grid-cols-2 sm:grid-cols-3"; // Two columns on mobile, three on larger screens
      default:
        return "grid-cols-2 sm:grid-cols-3"; // Default to three columns
    }
  }, [gridSort]);

  // Dynamic gap size based on gridSort
  const gridGap = useMemo(() => {
    switch (gridSort) {
      case 1:
        return "gap-8"; // Larger gap for single column
      case 2:
        return "gap-6"; // Medium gap for two columns
      case 3:
        return "gap-4"; // Smaller gap for three columns
      default:
        return "gap-6"; // Default to medium gap
    }
  }, [gridSort]);

  return (
    <div>
      {loadingFilter ? (
        <PageLoading />
      ) : (
        <>
          {/* Product Grid */}
          <div className={`grid ${gridColumns} ${gridGap} relative`}>
            {loading && (
              <div className="absolute bg-gray-200 cursor-wait z-40 bg-opacity-30 w-full h-full left-0 top-0"></div>
            )}
            {products?.map((product: UserProduct) => (
              <ProductCard
                key={product.id}
                loading={loading}
                setLoading={setLoading}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
                product={product}
                gridSort={gridSort} // Pass gridSort to ProductCard for dynamic styling
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center">
            <Button
              disabled={pagination <= 1}
              className="rounded-full w-10 h-10 bg-gray-300 p-2 hover:bg-gray-400 transition-colors"
              onClick={() => setPagination((prev) => --prev)}
            >
              <ChevronLeft className="size-6 text-slate-700" />
            </Button>

            {/* Page numbers */}
            {Array.from(
              { length: filter?.totalPages || 1 },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                className={`mx-1 rounded-full w-10 h-10 p-2 transition-colors ${
                  (filter?.currentPage || pagination) === page
                    ? "bg-blue-500 text-white hover:bg-blue-500 hover:bg-opacity-85"
                    : "bg-gray-300 hover:bg-gray-400 text-slate-800"
                }`}
                onClick={() => setPagination(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              disabled={
                pagination === filter?.totalPages || filter?.totalPages === 0
              }
              className="rounded-full w-10 h-10 bg-gray-300 p-2 hover:bg-gray-400 transition-colors"
              onClick={() => setPagination((prev) => ++prev)}
            >
              <ChevronRight className="size-6 text-slate-700" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
