"use client";
import { Button } from "@/components/ui/button";
import { capitalizeIfAmpersand } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "../_context/UserProvider";

function CartBar({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Calculate subtotal
  const subtotal = cart?.items?.reduce(
    (total: number, item: CartItem) =>
      total +
      item.quantity * (item?.product?.offer || item?.product?.price || 0),
    0
  );

  // Calculate total items in the cart
  const totalItems = cart?.items?.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );
  const { user } = useUser();
  return (
    <div
      className="relative flex items-center space-x-6 mt-3 md:mt-0 flex-shrink-0 flex-nowrap"
      role="button"
      tabIndex={0}
      aria-label="Cart"
    >
      {/* User Icon */}
      <div
        className="rounded-full border border-gray-200 p-2 hidden md:flex"
        onClick={() => router.push("/my-account")}
      >
        <User className="cursor-pointer text-gray-700" />
      </div>

      {/* Cart Icon and Subtotal */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex relative items-center space-x-2  flex-nowrap"
      >
        <p className="font-semibold text-gray-800 whitespace-nowrap hidden md:block">
          ${subtotal?.toFixed(2) || "0.00"}
        </p>
        <div
          onClick={() => router.push("/cart")}
          className="p-2 rounded-full cursor-pointer bg-red-50 relative flex-shrink-0"
        >
          <ShoppingBag className="cursor-pointer text-red-500" />
          {user?.email && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems || 0}
            </span>
          )}
        </div>
        {/* Hover Dropdown */}
        {isHovered && (
          <div
            className="absolute z-30 bg-white hidden md:block top-[100%] right-0 w-[300px] border shadow-sm p-5"
            role="menu"
            aria-label="Cart Details"
          >
            {/* Cart Items */}
            <div className="max-h-[200px] overflow-y-auto scrollbar-custom-sheet">
              {cart && cart?.items?.length > 0 ? (
                cart?.items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center mb-4">
                    <img
                      src={item?.product?.images[0]?.image}
                      alt={item?.product?.name}
                      className="w-[70px] h-[70px] object-cover mr-2"
                    />
                    <div>
                      <p className="text-sm text-slate-800">
                        {capitalizeIfAmpersand(item?.product?.name || "")}
                      </p>
                      <p className="text-slate-800 font-semibold text-base">
                        × {item?.quantity} - $
                        {(
                          item?.product?.offer ||
                          item?.product?.price ||
                          0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              )}
            </div>

            {/* Subtotal */}
            <Separator className="my-4" />
            <p className="flex justify-between mt-5 text-gray-500 text-sm items-center font-semibold">
              Subtotal:
              <span className="text-lg text-pink-700 font-semibold">
                ${subtotal?.toFixed(2) || "0.00"}
              </span>
            </p>

            {/* Buttons */}
            <Button
              className="w-full mt-3 hover:bg-gray-100 border bg-white text-slate-800 py-2 rounded-md transition-colors duration-200"
              onClick={() => router.push("/cart")}
            >
              View Cart
            </Button>
            <Button
              className="w-full mt-3 bg-pink-700 hover:bg-pink-800 text-white py-2 rounded-md transition-colors duration-200"
              onClick={() => router.push(`/checkout/${user?.id}`)}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartBar;
