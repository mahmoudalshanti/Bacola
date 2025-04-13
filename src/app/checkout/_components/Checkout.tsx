"use client";

import NavigationBar from "@/app/_components/NavigationBar";
import CouponCode from "./CouponCode";
import ErrorView from "./ErrorView";
import ProgressCart from "@/app/cart/_components/ProgressCart";
import BillingForm from "./BillingForm";
import OrderView from "./OrderView";
import { useEffect, useRef, useState } from "react";
import { actionCreateCheckoutSession } from "../_actions/actionCheckout";

export interface FormData {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  country: string;
  orderNotes: string;
  terms: boolean; // Ensure `terms` is included
  payment: "stripe" | "paypal" | "cash";
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  country?: string;
  terms?: string;
  payment?: string;
}

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { ToastFaild } from "@/components/Toasts";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function Checkout({
  user,
  subtotal,
  progressShapping,
}: {
  user: any;
  subtotal: number;
  progressShapping?: {
    left_money: number;
    precentage: number;
    left_precentage: number;
    shipping: number;
    compelete: boolean;
  };
}) {
  const [coupon, setCoupon] = useState<Coupon | null>(null); // Initialize as an object
  const [discountCoupon, setDiscountCoupon] = useState<{
    discountPercentage: number;
    discountAmount: number;
    newTotal: number;
    code: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: user.fName,
    lastName: user.lName,
    street: "",
    city: "",
    zipCode: "",
    phone: "",
    email: user.email,
    country: "",
    orderNotes: "",
    terms: false,
    payment: "stripe",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const errorViewRef = useRef<HTMLDivElement>(null); // Create a ref
  const discountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async () => {
    let newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Billing First name is a required field.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Billing Last name is a required field.";
    }
    if (!formData.street.trim()) {
      newErrors.street = "Billing Street address is a required field.";
    }
    if (!formData.city.trim()) {
      newErrors.city = "Billing Town / City is a required field.";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Billing ZIP Code is a required field.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Billing Phone is a required field.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Billing Email is a required field.";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Please select a Country / Region.";
    }
    if (!formData.terms) {
      newErrors.terms =
        "Please read and accept the terms and conditions to proceed with your order.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (errorViewRef.current) {
        errorViewRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return; // Stop submission if there are errors
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const data = await actionCreateCheckoutSession(
          formData,
          discountCoupon?.code || ""
        );
        const stripe = await stripePromise;
        if (data?.id)
          await stripe?.redirectToCheckout({
            sessionId: data.id,
          });
        if (data?.redirect) {
          router.push(data.redirect);
        }
        if (data?.errMsg) {
          throw new Error(data.errMsg);
        }
      } catch (err) {
        console.error("Something went Error!", err);
        ToastFaild("Something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (discountRef.current) {
      discountRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [discountCoupon?.newTotal]);

  return (
    <div className="py-[130px] md:p-0 mb-0 md:mb-32">
      <NavigationBar navigation="checkout" />

      <div className="mt-8 md:px-0">
        {/* Coupon Code */}
        <div className="mb-5" ref={errorViewRef}>
          <CouponCode
            coupon={coupon}
            setCoupon={setCoupon}
            setDiscountCoupon={setDiscountCoupon}
          />
        </div>

        {/* Error View */}

        <div className="mb-5">
          {Object.keys(errors).some(
            (key) => errors[key as keyof FormErrors]
          ) && <ErrorView errors={errors} />}
        </div>

        {/* Progress Cart */}
        <div className="mb-5">
          <ProgressCart progressShapping={progressShapping} />
        </div>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Billing Form (Left Column) */}
          <div className="col-span-12 lg:col-span-8 border p-4 rounded-lg">
            <BillingForm
              setFormData={setFormData}
              formData={formData}
              errors={errors}
            />
          </div>

          {/* Order View (Right Column) */}
          <div
            ref={discountRef}
            className="col-span-12 lg:col-span-4 border p-4 rounded-lg border-pink-500"
          >
            <OrderView
              user={user}
              subtotal={subtotal}
              handleSubmit={handleSubmit}
              setFormData={setFormData} // Pass `setFormData` to handle `terms`
              formData={formData}
              loading={loading}
              discountCoupon={discountCoupon}
              compelete={progressShapping?.compelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
