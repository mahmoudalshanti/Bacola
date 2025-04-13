import { ShieldCheck } from "lucide-react";
import Link from "next/link";

function TopBar() {
  return (
    <div>
      <div className="border-b border-gray-200 p-2 hidden xl:block">
        <div className="text-sm flex justify-between max-w-6xl mx-auto">
          <div className="flex text-gray-700 space-x-5">
            <Link
              href={"/about-us"}
              className="cursor-pointer hover:text-cyan-500 transition-colors"
            >
              About Us
            </Link>
            <Link
              href={"/my-account"}
              className="cursor-pointer hover:text-cyan-500 transition-colors"
            >
              My account
            </Link>
            <Link
              href={"/wishlist"}
              className="cursor-pointer hover:text-cyan-500 transition-colors"
            >
              Wishlist
            </Link>
            <Link
              href={"/order_tracking"}
              className="cursor-pointer hover:text-cyan-500 transition-colors"
            >
              Order Tracking
            </Link>
          </div>
          <div className="flex text-gray-700 space-x-5">
            <p className="flex items-center border-r border-gray-200 pr-2">
              <ShieldCheck className="size-5 mr-2" /> 100% Secure delivery
              without contacting the courier
            </p>
            <p className="border-r border-gray-200 pr-2">
              Need help? Call Us:{" "}
              <span className="text-cyan-500  cursor-pointer hover:underline">
                + 0020 500
              </span>
            </p>
            <p className="font-semibold">USD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
