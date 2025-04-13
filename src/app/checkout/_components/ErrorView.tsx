"use client";
import React from "react";
import { FormErrors } from "./Checkout";

function ErrorView({ errors }: { errors: FormErrors }) {
  return (
    <div>
      <div className="items-center p-4 border">
        {errors.firstName && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing First name is a required field.
          </p>
        )}
        {errors.lastName && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Last name is a required field.
          </p>
        )}
        {errors.street && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Street address is a required field.
          </p>
        )}
        {errors.city && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Town / City is a required field.
          </p>
        )}
        {errors.zipCode && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing ZIP Code is a required field.
          </p>
        )}
        {errors.phone && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Phone is a required field.
          </p>
        )}
        {errors.email && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Email is a required field.
          </p>
        )}
        {errors.country && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Billing Country is a required field.
          </p>
        )}
        {errors.terms && (
          <p className="hover:underline text-cyan-600 font-semibold cursor-pointer text-sm mb-1 ">
            Please read and accept the terms and conditions to proceed with your
            order.
          </p>
        )}
      </div>
    </div>
  );
}

export default ErrorView;
