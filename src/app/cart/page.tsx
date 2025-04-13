import React from "react";
import NavigationBar from "../_components/NavigationBar";
import TabelCart from "./_components/TabelCart";
import ProgressCart from "./_components/ProgressCart";
import DetailesCart from "./_components/DetailesCart";
import RemoveAllButton from "./_components/RemoveAllButton";
import {
  actionGetCartUser,
  actionGetProgressShapping,
} from "./_actions/actionCart";
import EmptyCartIcon from "../_components/EmptyCartIcon";
import Link from "next/link";

async function page() {
  let cart;

  try {
    cart = (await actionGetCartUser()) as unknown as Cart;
    if ("errMsg" in cart) {
      if (cart.errMsg) throw new Error(cart.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Error!", err);
    cart = null;
  }

  let progressShapping = {
    compelete: false,
    left_money: 0,
    left_precentage: 0,
    precentage: 0,
    shipping: 0,
  };
  try {
    progressShapping =
      (await actionGetProgressShapping()) as unknown as ProgressShapping;
  } catch (err) {
    console.error("Something went Error!", err);
    progressShapping = {
      compelete: false,
      left_money: 0,
      left_precentage: 0,
      precentage: 0,
      shipping: 0,
    };
  }

  const isEmptyCart = !cart?.items?.length;

  const subtotal = cart?.items?.reduce(
    (total: number, item: CartItem) =>
      total +
      item.quantity * (item?.product?.offer || item?.product?.price || 0),
    0
  );

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <NavigationBar navigation="cart" />
      {isEmptyCart ? (
        <div className="p-10">
          <div className="bg-gray-200 mx-auto w-44 h-44 flex items-center justify-center rounded-full">
            <EmptyCartIcon />
          </div>
          <div
            className="text-center font-semibold text-xl mt-5"
            style={{ color: "#FF0049" }}
          >
            YOUR CART IS CURRENTLY EMPTY.
          </div>
          <Link
            href={"/"}
            className="bg-blue-900 rounded-full flex px-6 p-3 w-fit text-white mx-auto mt-10 "
          >
            Return to shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mt-8 md:px-0 relative">
          <div className="col-span-12 lg:col-span-9 rounded-sm">
            <ProgressCart progressShapping={progressShapping} />
            {cart && <TabelCart cart={cart} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="col-span-1">{/* <CouponCode /> */}</div>
              <div className="col-span-1 flex justify-end">
                <RemoveAllButton />
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 p-4 border mt-6 lg:mt-0">
            <DetailesCart
              subtotal={subtotal || 0}
              compelete={progressShapping?.compelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
