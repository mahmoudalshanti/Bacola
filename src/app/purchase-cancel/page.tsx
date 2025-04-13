import React from "react";
import { AlertCircle, ArrowLeft, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

const PurchaseCancellation = () => {
  return (
    <div className="flex flex-col pt-40 md:pt-10 items-center  min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Purchase Cancelled
          </h1>
          <p className="text-gray-500 mt-2">Your order has been cancelled.</p>
        </div>

        {/* Refund Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center">
              <X className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 ml-1">
                Payment method not completed.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <Link
            href={"/product-category"}
            className="flex items-center justify-center w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <Link
            href="/order"
            className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCancellation;
