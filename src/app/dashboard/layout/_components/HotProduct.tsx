"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  actionGetAllProducts,
  actionUpdateHotProduct,
} from "../../_actions/actionDashboard";
import { DrawerDialog } from "@/components/Drawer";
import { Product } from "@prisma/client";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/RatingStars";
import { capitalizeIfAmpersand } from "@/lib/utils";

export interface ProductWithCategory extends Product {
  category: Category;
  isHot?: boolean;
  images: any;
}

function HotProduct({ product }: { product: ProductWithCategory | null }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [hotProduct, setHotProduct] = useState<ProductWithCategory | null>(
    product
  );

  useEffect(() => {
    console.log(hotProduct);
  }, []);

  const handleGetAllProducts = async () => {
    try {
      setLoading(true);
      const findProducts = await actionGetAllProducts();

      // Preserve the hot product selection when loading new products
      if (Array.isArray(findProducts)) {
        const updatedProducts = findProducts.map((product) => ({
          ...product,
          isHot: hotProduct?.id === product.id,
        }));
        setProducts(updatedProducts);
        setOpen(true);
      }
      if ("errMsg" in findProducts) {
        throw new Error(findProducts.errMsg);
      }
    } catch (err) {
      setOpen(false);
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHotProduct = (productId: string) => {
    // If clicking on the already hot product, unset it
    if (hotProduct?.id === productId) {
      setHotProduct(null);
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          isHot: false,
        }))
      );
      return;
    }

    // Set new hot product
    const newHotProduct = products.find((p) => p.id === productId);
    if (newHotProduct) {
      setHotProduct({ ...newHotProduct, isHot: true });
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          isHot: product.id === productId,
        }))
      );
    }
  };

  const handelUpdateHotProduct = async () => {
    try {
      setLoadingUpdate(true);
      await actionUpdateHotProduct(hotProduct?.id || "");
    } catch (err) {
      console.error("Something went Error!", err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const dialogContent = (
    <div className="space-y-6 h-[500px] overflow-y-scroll">
      <h2 className="text-xl font-semibold">All Products</h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product?.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              {product?.images?.length > 0 && (
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <img
                    src={product?.images[0].image}
                    alt={product?.name}
                    className="object-cover h-full w-full"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{product?.name}</h3>
                <p className="text-sm text-gray-500">
                  {product?.category?.name}
                </p>
                <div className="flex items-center mt-1">
                  <StarRating rate={product?.rate} size={4} />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">
                <span
                  className={`${
                    product.offer ? "line-through" : "no-underline"
                  }`}
                >
                  ${product?.price}
                </span>{" "}
                <br />
                <span> ${product?.offer ? product?.offer : ""}</span>
              </span>
              <Button
                variant={product?.isHot ? "default" : "outline"}
                size="sm"
                onClick={() => toggleHotProduct(product?.id)}
              >
                {product?.isHot ? (
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 fill-current mr-1" />
                    Hot
                  </div>
                ) : (
                  "Make Hot"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="p-6 shadow-xl rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hot Product</h1>
          <p className="text-sm text-gray-500">
            Featured product that's trending
          </p>
        </div>
        <Button
          onClick={handleGetAllProducts}
          className="bg-gray-300 text-slate-700 hover:bg-gray-300"
          disabled={loading}
        >
          {loading ? "Loading..." : "View All Products"}
        </Button>
      </div>

      {hotProduct ? (
        <div className="grid grid-cols-1 gap-4">
          <div className=" rounded-lg p-4 w-[400px]  border mx-auto">
            <div className="relative h-56  mb-3 rounded-md overflow-hidden">
              {hotProduct.images?.length > 0 && (
                <img
                  src={hotProduct?.images[0]?.image}
                  alt={hotProduct?.name}
                  className="object-cover h-full w-full"
                />
              )}
              <Badge className="absolute top-2 left-2 flex items-center">
                <Flame className="h-3 w-3 fill-current mr-1" />
                Hot
              </Badge>
            </div>
            <h3 className="font-medium">
              {capitalizeIfAmpersand(hotProduct?.name || "")}
            </h3>
            <p className="text-sm text-gray-500">
              {capitalizeIfAmpersand(hotProduct?.category?.name || "")}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-gray-500">
                ${hotProduct?.offer ? hotProduct?.offer : hotProduct?.price}
              </span>
              <div className="flex items-center">
                <StarRating rate={hotProduct?.rate} />
              </div>
            </div>
          </div>

          <Button
            onClick={() => handelUpdateHotProduct()}
            disabled={(hotProduct.name ? false : true) || loadingUpdate}
            className="w-fit ml-auto"
          >
            {loadingUpdate ? "Updating.." : "Update hot Product"}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No hot product selected</p>
          <Button
            variant="link"
            className="mt-2"
            onClick={handleGetAllProducts}
          >
            Select Hot Product
          </Button>
        </div>
      )}

      <DrawerDialog content={dialogContent} setOpen={setOpen} open={open} />
    </section>
  );
}

export default HotProduct;
