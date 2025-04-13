"use client";

import { Separator } from "@/components/ui/separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripe } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { capitalizeIfAmpersand } from "@/lib/utils";
import { FormData } from "./Checkout";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";

interface OrderViewProps {
  user: User;
  subtotal: number;
  handleSubmit: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formData: FormData;
  loading: boolean;

  discountCoupon: {
    discountPercentage: number;
    discountAmount: number;
    newTotal: number;
  } | null;

  compelete?: boolean;
}

function OrderView({
  user,
  subtotal,
  handleSubmit,
  setFormData,
  formData,
  loading,
  discountCoupon,
  compelete,
}: OrderViewProps) {
  return (
    <div>
      {/* Order Summary Heading */}
      <div className="text-base font-bold">
        <p className="mb-3">YOUR ORDER</p>
        <Separator />
      </div>

      {/* Product List */}
      <div>
        <div className="flex justify-between py-3">
          <p className="text-sm text-gray-500 font-bold">Product</p>
          <p className="text-sm text-gray-500 font-bold">Subtotal</p>
        </div>
        <Separator />
        <div className="">
          {user?.Cart?.items?.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-slate-800 py-3"
            >
              <p className="w-[60%]">
                {capitalizeIfAmpersand(item?.product?.name || "")}{" "}
                <span className="font-bold">× {item?.quantity}</span>
              </p>
              <p>${item?.totalPrice.toFixed(2)}</p>
            </div>
          ))}
          <Separator />
        </div>
      </div>

      {/* Subtotal */}
      <div>
        <div className="flex justify-between py-3">
          <p className="text-sm text-gray-500 font-bold">Subtotal</p>
          <p className="text-sm text-slate-800">${subtotal.toFixed(2)}</p>
        </div>
        <Separator />
      </div>

      {/* Shipping */}
      <div>
        <div className="flex justify-between items-center py-3">
          <p className="text-sm text-gray-500 font-bold">Shipping</p>
          <div>
            <p className="text-sm text-slate-800">
              {compelete ? "Free" : "Flate rate $5.00"}
            </p>
          </div>
        </div>
        <Separator />
      </div>

      {/* Total */}
      <div>
        <div className="flex justify-between py-3">
          <p className="text-sm text-gray-500 font-bold">Total</p>
          <div className="text-slate-800 text-lg font-bold flex items-center">
            {discountCoupon?.newTotal && (
              <Badge className="bg-slate-100 mr-1 text-xs hover:bg-slate-100 text-slate-800">
                %{discountCoupon.discountPercentage} Off
              </Badge>
            )}

            <p>
              $
              {discountCoupon?.newTotal
                ? discountCoupon?.newTotal.toFixed(2)
                : subtotal.toFixed(2)}
            </p>
          </div>
        </div>
        <Separator />
      </div>

      {/* Payment Methods */}
      <div className="py-3">
        <p className="text-base text-gray-500 font-bold mb-2">
          Use payment method
        </p>
        {/* Stripe */}

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                payment: "stripe",
              }))
            }
            className={`flex-1 p-4 border  cursor-pointer ${
              formData.payment === "stripe"
                ? "border-blue-600 "
                : "border-gray-200"
            } hover:border-blue-600 rounded-lg transition-all hover:shadow-md flex items-center justify-center`}
          >
            <FontAwesomeIcon
              icon={faStripe}
              className="text-blue-600 size-14"
            />
          </div>
          {/* PayPal */}
          {/* <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                payment: "paypal",
              }))
            }
            className={`flex-1 p-4 border ${
              formData.payment === "paypal"
                ? "border-blue-600 "
                : "border-gray-200"
            } cursor-pointer hover:border-blue-600 rounded-lg transition-all  hover:shadow-md flex items-center justify-center`}
          >
            <FontAwesomeIcon
              icon={faPaypal}
              className="text-blue-600 size-14"
            />
          </div> */}

          {/* Cash on Delivery */}
          <div
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                payment: "cash",
              }))
            }
            className={`flex-1 ${
              formData.payment === "cash"
                ? "border-blue-600 "
                : "border-gray-200"
            } p-4 border cursor-pointer hover:border-blue-600 rounded-lg transition-all  hover:shadow-md flex items-center justify-center`}
          >
            <p className="text-gray-700 font-bold text-center">
              Cash on Delivery
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="text-sm text-slate-800">
        Your personal data will be used to process your order, support your
        experience throughout this website, and for other purposes described in
        our{" "}
        <span className="text-pink-700 font-semibold underline">
          privacy policy
        </span>
        .
      </div>

      {/* Terms and Conditions */}
      <div className="flex mt-3">
        <div className="mr-2">
          <input
            type="checkbox"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                terms: e.target.checked,
              }));
            }}
          />
        </div>
        <p className="text-sm">
          I have read and agree to the website{" "}
          <span className="text-pink-700 font-semibold underline">
            terms and conditions
          </span>
        </p>
      </div>

      {/* Place Order Button */}
      <Button
        disabled={loading}
        onClick={handleSubmit}
        className="w-full mt-3 bg-pink-700 hover:bg-pink-800 text-white py-2 rounded-md transition-colors duration-200"
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  );
}

export default OrderView;
