import React from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/utils";
import { notFound } from "next/navigation";
import { actionGetFullUserInfo } from "@/app/dashboard/_actions/actionDashboard";
import Checkout from "../_components/Checkout";
import { actionGetProgressShapping } from "@/app/cart/_actions/actionCart";
import { ShoppingCart, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

async function page({ params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    const { id } = await params;
    const token = (await cookies()).get("token")?.value;
    const decoded = await verifyToken(token ? token : "");
    if (decoded.id !== id) return notFound();
    user = await actionGetFullUserInfo(id);
  } catch (err) {
    console.error("Something went Error!", err);
    return notFound();
  }

  let progressShapping;
  try {
    progressShapping = await actionGetProgressShapping();

    if ("errMsg" in progressShapping) {
      if (progressShapping.errMsg)
        throw new Error(progressShapping.errMsg as string);
    }
  } catch (err) {
    console.error("Something went Error!", err);
  }

  const items = (user &&
    "Cart" in user &&
    user.Cart?.items) as unknown as CartItem[];

  const subtotal = items?.reduce(
    (total: number, item: CartItem) =>
      total +
      item.quantity * (item?.product?.offer || item?.product?.price || 0),
    0
  );
  return (
    <div className="md:p-0 mb-0 md:mb-32">
      {"Cart" in user && user.Cart?.items?.length ? (
        <Checkout
          subtotal={subtotal}
          user={user}
          progressShapping={progressShapping as unknown as ProgressShapping}
        />
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full p-8 rounded-lg  text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-cyan-100 mb-4">
              <ShoppingCart className="h-8 w-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              You can't proceed to checkout with an empty cart. Add some items
              to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/product-category"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
