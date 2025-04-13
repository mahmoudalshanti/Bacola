import React from "react";
import { actionGetCategories } from "../dashboard/_actions/actionDashboard";
import Link from "next/link";
import { capitalizeIfAmpersand } from "@/lib/utils";

const CategoriesFooter = async () => {
  let categories: Category[] = [];
  try {
    categories = (await actionGetCategories()) as Category[];

    if ("errMsg" in categories)
      if (categories.errMsg) throw new Error(categories.errMsg as string);
  } catch (err) {
    console.error("Something went wrong", err);
  }

  // Split categories into featured (first 3) and regular
  const featuredCategories = categories.slice(0, 3);
  const regularCategories = categories.slice(3);

  return (
    <div className="mx-auto py-12 px-4 max-w-7xl">
      <h2 className="text-3xl font-bold text-slate-700 text-center mb-12">
        Our Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {featuredCategories.map((category, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-xl shadow-lg ${
              index === 1 ? "md:row-span-2 h-full" : "h-64"
            }`}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white">
                {capitalizeIfAmpersand(category.name)}
              </h3>
              <p className="text-white/80 text-sm">Shop Now</p>
            </div>
            <Link
              href={`/product-category/${category.name}`}
              className="absolute inset-0 z-10"
            />
          </div>
        ))}
      </div>

      {/* Regular Categories - Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {regularCategories.map((category, index) => (
          <div
            key={index + featuredCategories.length}
            className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <h3 className="text-white font-medium text-center px-2 py-1 bg-black/50 rounded-md">
                {capitalizeIfAmpersand(category.name)}
              </h3>
            </div>
            <Link
              href={`/product-category/${category.name}`}
              className="absolute inset-0 z-10"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesFooter;
