"use client";

import {
  actionApplyCouponCode,
  actionGetCouponCode,
} from "../../dashboard/_actions/actionDashboard";

import { Puzzle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";

function CouponCode({
  coupon,
  setCoupon,
  setDiscountCoupon,
}: {
  coupon: Coupon | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  setDiscountCoupon: React.Dispatch<
    React.SetStateAction<{
      discountPercentage: number;
      discountAmount: number;
      newTotal: number;
      code: string;
    } | null>
  >;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const getCoupon = async () => {
      try {
        const findCoupon = await actionGetCouponCode();
        if (findCoupon && "code" in findCoupon) setCoupon(findCoupon);
        if (findCoupon && "code" in findCoupon) {
          setInputValue(findCoupon.code);
        } else {
          setCoupon(null);
        }
        if (findCoupon && "errMsg" in findCoupon) {
          throw new Error(findCoupon?.errMsg);
        }
      } catch (err) {
        console.error("Error in fetch coupon code", err);
        setCoupon(null);
      }
    };
    getCoupon();
  }, []);

  const handleApplyCoupon = async () => {
    try {
      setLoading(true);
      const appliedCoupon = await actionApplyCouponCode(inputValue); // Use inputValue instead of coupon?.code
      setDiscountCoupon({
        discountAmount: appliedCoupon?.discountAmount || 0,
        discountPercentage: appliedCoupon?.discountPercentage || 0,
        newTotal: appliedCoupon?.newTotal || 0,
        code: coupon?.code || "",
      });

      if (appliedCoupon?.errMsg) {
        throw new Error(appliedCoupon.errMsg);
      }
      setCoupon(null);
      setInputValue(""); // Clear the input value
      setSuccess(true);
      setErr(false);
    } catch (err) {
      setSuccess(false);
      setErr(true);
      console.error("Something went Error!", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border rounded-lg">
          <div className="flex flex-col md:flex-row items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <Puzzle className="text-blue-700 mr-2" />
            <p className="text-sm font-medium text-gray-700">Have a coupon?</p>
            <AccordionTrigger className="ml-auto">
              <span className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                Click here to enter your code
              </span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="p-4">
            <div className="flex gap-2">
              <div>
                <Input
                  type="text"
                  value={inputValue} // Use inputValue instead of coupon?.code
                  onChange={(e) => setInputValue(e.target.value)} // Update inputValue directly
                  placeholder="Enter coupon code"
                  className="flex-1 text-emerald-800"
                />
                {coupon?.discountPercentage ? (
                  <p className="text-emerald-600 text-xs mt-1">
                    Apply Coupon and Get OF %{coupon?.discountPercentage}.
                  </p>
                ) : (
                  <p className="text-emerald-600 text-xs mt-1">
                    Apply Coupon code.{" "}
                    {err && <span className="text-red-500">Invalid code</span>}
                  </p>
                )}
              </div>
              <Button
                disabled={success || loading || !inputValue} // Disable if no input value
                onClick={handleApplyCoupon}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                {!loading ? "Apply" : "Applying.."}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default CouponCode;
