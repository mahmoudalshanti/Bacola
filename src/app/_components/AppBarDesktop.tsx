import React from "react";
import LogoBar from "./LogoBar";
import CategoriesBar from "./CategoriesBar";
import CategoriesMenuDesktop from "./CategoriesMenu";
import TopBar from "./TopBar";
import SearchBar from "./SearchBar";
import CartBar from "./CartBar";
import {
  actionGetCategories,
  actionGetText,
} from "../dashboard/_actions/actionDashboard";
import { actionGetCartUser } from "../cart/_actions/actionCart";

async function AppBarDesktop() {
  let categories: Category[] = [];
  let cart = null;
  let textAppbar: string = "";

  try {
    categories = (await actionGetCategories()) as Category[];

    if ("errMsg" in categories)
      if (categories.errMsg) throw new Error(categories.errMsg as string);
  } catch (err) {
    console.error("Something went wrong!", err);
  }

  try {
    cart = await actionGetCartUser();
    if (cart && "errMsg" in cart)
      if (cart.errMsg) throw new Error(cart.errMsg as string);
  } catch (err) {
    console.error("Something went wrong!", err);
  }

  try {
    textAppbar = (await actionGetText()) as string;
    if (!textAppbar) throw new Error("Failed to fetch text for AppBar");
  } catch (err) {
    console.error("Something went wrong!", err);
  }

  return (
    <>
      <div className="w-full border-b  border-gray-200 md:pb-3 pb-0 shadow-sm sticky md:relative ">
        {/* Notice Banner */}
        <p className="bg-blue-900 p-2.5 text-xs font-medium text-white text-center">
          {textAppbar}
        </p>

        {/* Top Bar */}
        <TopBar />

        {/* Main Navigation Bar */}
        <div className="flex flex-row justify-between items-center gap-x-8 p-4 xl:px-20">
          <LogoBar categories={categories} />

          <SearchBar />

          <CartBar cart={cart as unknown as Cart} />
        </div>

        {/* Categories and Navigation Links */}
        <div className=" px-4 xl:px-20 mx-auto cursor-pointer flex justify-between">
          <CategoriesMenuDesktop categories={categories} />
          <div className="hidden xl:block">
            <CategoriesBar categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default AppBarDesktop;
