import React from "react";
import ProductDetails from "../_components/Product";
import NavigationBar from "@/app/_components/NavigationBar";
import {
  actionGetProuct,
  actionGetRating,
} from "@/app/dashboard/_actions/actionDashboard";
import { notFound } from "next/navigation";
import { UserProduct } from "@/app/_context/ProductsProvider";
import type { Metadata } from "next";
import { capitalizeIfAmpersand } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const product = await actionGetProuct(id);

    if (!product) {
      return {
        title: "Product Not Found | Bacola",
        description: "This product is no longer available",
        icons: { icon: "/cart-logo-bacola.png" },
      };
    }

    if ("name" in product) {
      const title = `${capitalizeIfAmpersand(
        product.name
      )} | ${capitalizeIfAmpersand(product.category.name)} | Bacola`;
      const description = `${
        product.description ||
        `Buy ${product.name} online at Bacola. ${product.category.name} available now.`
      }`;
      const keywords = [
        product.name,
        product.category.name,
        "Bacola",
        "online shopping",
        "groceries",
        ...(product.name || []),
      ];

      return {
        title,
        description,
        keywords: keywords.join(", "),
        icons: { icon: "/cart-logo-bacola.png" },
      };
    }

    return {
      title: "Product Page | Bacola",
      description: "View product details on Bacola",
      icons: { icon: "/cart-logo-bacola.png" },
    };
  } catch (error) {
    return {
      title: "Product Page | Bacola",
      description: "View product details on Bacola",
      icons: { icon: "/cart-logo-bacola.png" },
    };
  }
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  let product = null;
  let rates = null;

  try {
    const { id } = await params;
    product = (await actionGetProuct(id)) as Product;

    if ("errMsg" in product) {
      if (product.errMsg) throw new Error(product.errMsg as string);
    }
  } catch (err) {
    console.log("Something went wrong!", err);
  }

  try {
    rates = await actionGetRating(product?.id || "");

    if (rates && "errMsg" in rates) {
      if (rates.errMsg) throw new Error(rates.errMsg);
    }
  } catch (err) {
    console.log("Something went wrong!", err);
  }

  if (!product) return notFound();

  return (
    <div className="bg-gray-100 py-[130px] md:p-0 ">
      <div className="p-4 xl:px-20 pb-0 md:pb-32">
        <div className="mb-5">
          <NavigationBar navigation={`Product / ${product?.id}`} />
        </div>

        <ProductDetails
          product={product as unknown as UserProduct}
          rates={rates as Rates}
        />
      </div>
    </div>
  );
}

export default Page;
