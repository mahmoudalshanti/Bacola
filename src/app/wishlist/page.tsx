import React from "react";
import NavigationBar from "../_components/NavigationBar";
import TabelWishlist from "./_components/TabelWishlist";
import { actionGetWishlist } from "./_actions/actionWishlist";
import Link from "next/link";

async function page() {
  let wishlist;

  try {
    wishlist = (await actionGetWishlist()) as unknown as Wishlist[];
  } catch (err) {
    console.error("Something went Error!", err);
    wishlist = null;
  }

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <NavigationBar navigation="wishlist" />
      {wishlist?.length ? (
        <div>
          <TabelWishlist wishlist={wishlist as unknown as Wishlist[]} />
        </div>
      ) : (
        <div className="p-10">
          <div className=" text-start font-semibold text-xl mt-5 text-blue-900">
            Your Wishlist is currently empty.
          </div>
          <Link
            href={"/"}
            className="bg-blue-900 rounded-full flex px-6 p-3 w-fit text-white mt-10 "
          >
            Return to shop
          </Link>
        </div>
      )}
    </div>
  );
}

export default page;
