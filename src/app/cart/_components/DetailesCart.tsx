"use client";
import { useUser } from "@/app/_context/UserProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

function DetailesCart({
  subtotal,
  compelete,
}: {
  subtotal: number;
  compelete?: boolean;
}) {
  const router = useRouter();
  const { user } = useUser();
  return (
    <div className="bg-white  rounded-lg shadow-sm ">
      {/* Cart Totals Heading */}
      <p className="font-bold text-base  text-slate-800 mb-4">CART TOTALS</p>
      <Separator orientation="horizontal" className="bg-gray-300 mb-4" />

      {/* Subtotal Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-slate-800 text-sm mb-2">Subtotal</p>
          <p className="text-sm text-slate-800 ">${subtotal?.toFixed(2)}</p>
        </div>

        <Separator orientation="horizontal" className="bg-gray-300 mb-4" />
      </div>

      {/* Shipping Section */}
      <div className="mb-4 flex justify-between">
        <p
          className="font-semibold
         text-slate-800 text-sm mb-3"
        >
          Shipping
        </p>
        <div className="space-y-3 text-sm text-slate-800">
          {/* Flat Rate Option */}
          {compelete ? "Free" : "Flate rate $5.00"}
        </div>
      </div>
      <Separator orientation="horizontal" className="bg-gray-300 mb-4" />

      {/* Total Section */}
      <div className="flex justify-between mb-6">
        <p className="font-semibold text-slate-800 text-sm">Total</p>
        <p className="font-semibold text-lg text-slate-800">
          ${subtotal?.toFixed(2)}
        </p>
      </div>

      {/* Proceed to Checkout Button */}
      <Button
        onClick={() => router.push(`/checkout/${user?.id}`)}
        className="w-full bg-pink-700 hover:bg-pink-800 text-white py-2 rounded-md transition-colors duration-200"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}

export default DetailesCart;
