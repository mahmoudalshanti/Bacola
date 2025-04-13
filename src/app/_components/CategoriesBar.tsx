"use client";

import Link from "next/link";
import CategoryIcon from "./CategoreyIcon";
import { useState } from "react";
import { capitalizeIfAmpersand, decodeUrlString } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Building,
  Heart,
  Home,
  Mail,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

function CategoriesBar({ categories }: { categories?: Category[] }) {
  const [hover, setHover] = useState<string>("");
  const pathname = usePathname();

  const getActiveState = () => {
    if (pathname === "/") return "/";
    if (pathname === "/contact") return "contact";
    if (pathname === "/about-us") return "about-us";
    if (pathname === "/order_tracking") return "order_tracking";
    if (pathname === "/my-account") return "my-account";
    if (pathname === "/wishlist") return "wishlist";
    if (pathname === "/cart") return "cart";
    const category = pathname.split("/")[2];
    return category ? decodeUrlString(category) : "";
  };

  const active = getActiveState();

  return (
    <div className="items-center xl:flex block">
      <Link
        href="/"
        className={`rounded-3xl xl:mb-0  mb-3 text-sm font-semibold cursor-pointer py-3 px-5 mr-1 flex items-center ${
          active === "/" ? "bg-cyan-50 text-cyan-500" : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <Home className="size-5 mr-1 block xl:hidden" /> <span>HOME</span>
      </Link>

      {categories?.slice(0, 3)?.map((category: Category) => (
        <Link
          href={`/product-category/${category.name}`}
          key={category.id}
          onMouseMove={() => setHover(category.name)}
          onMouseLeave={() => setHover("")}
          className={`rounded-3xl whitespace-nowrap xl:mb-0 mb-3 flex cursor-pointer items-center py-3 mr-1 text-sm px-5 font-semibold ${
            active === category.name
              ? "bg-cyan-50 text-cyan-500"
              : "bg-none text-gray-700"
          } hover:bg-cyan-50 hover:text-cyan-500`}
        >
          <CategoryIcon
            categoryName={category.name}
            hover={active === category.name ? active : hover}
            smallSpace={true}
          />
          {capitalizeIfAmpersand(category.name)}
        </Link>
      ))}

      <Link
        href="/contact"
        className={`rounded-3xl whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "contact"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <Mail className="size-5 mr-1 block xl:hidden " />
        <span>CONTACT</span>
      </Link>

      <Link
        href="/about-us"
        className={`rounded-3xl  xl:hidden whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "about-us"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <Building className="size-5 mr-1  block xl:hidden" />
        <span>ABOUT US</span>
      </Link>

      <Link
        href="/wishlist"
        className={`rounded-3xl  xl:hidden whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "wishlist"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <Heart className="size-5 mr-1 block xl:hidden " />
        <span>Wishlist</span>
      </Link>
      <Link
        href="/cart"
        className={`rounded-3xl  xl:hidden whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "cart"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <ShoppingBag className="size-5 mr-1 block xl:hidden " />
        <span> My Cart</span>
      </Link>
      <Link
        href="/order_tracking"
        className={`rounded-3xl  xl:hidden whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "order_tracking"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <Truck className="size-5 mr-1 block xl:hidden " />
        <span>ORDER TRACKING</span>
      </Link>

      <Link
        href="/my-account"
        className={`rounded-3xl  xl:hidden whitespace-nowrap xl:mb-0 mb-3 text-sm font-semibold flex cursor-pointer items-center py-3 mr-1 px-5 ${
          active === "my-account"
            ? "bg-cyan-50 text-cyan-500"
            : "bg-none text-gray-700"
        } hover:bg-cyan-50 hover:text-cyan-500`}
      >
        <User className="size-5 mr-1 block xl:hidden" />
        <span>My Account</span>
      </Link>
    </div>
  );
}

export default CategoriesBar;
