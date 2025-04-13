"use client";

import Input from "@/components/Input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormData, FormErrors } from "./Checkout";
import { capitalizeIfAmpersand } from "@/lib/utils";
import axios from "axios";

const BillingForm = ({
  setFormData,
  formData,
  errors,
}: {
  setFormData: React.Dispatch<SetStateAction<FormData>>;
  formData: FormData;
  errors: FormErrors;
}) => {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("/data/countries.json");
        const countryNames = await response.data
          .map((country: any) => country?.name?.common)
          .filter(Boolean);
        countryNames.sort((a: string, b: string) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="">
      <p className="text-base font-bold mb-4">BILLING DETAILS</p>
      <form className="space-y-4">
        {/* First Name & Last Name */}
        <div className="flex gap-4">
          <div className="w-[50%]">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name *
            </label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={capitalizeIfAmpersand(formData.firstName)}
              onChange={handleChange}
              className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
            />
            {errors.firstName && (
              <p className="text-slate-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="w-[50%]">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name *
            </label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={capitalizeIfAmpersand(formData.lastName)}
              onChange={handleChange}
              className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
            />
            {errors.lastName && (
              <p className="text-slate-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Country / Region */}
        <div>
          <Label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country / Region *
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, country: value }))
            }
          >
            <SelectTrigger
              id="country"
              name="country"
              className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200 p-2 text-left"
            >
              <SelectValue placeholder="Select a Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-slate-600 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
            Street Address *
          </label>
          <Input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
          />
          {errors.street && (
            <p className="text-slate-600 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        {/* Town / City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Town / City *
          </label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
          />
          {errors.city && (
            <p className="text-slate-600 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-medium text-gray-700"
          >
            ZIP Code *
          </label>
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
          />
          {errors.zipCode && (
            <p className="text-slate-600 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone *
          </label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
          />
          {errors.phone && (
            <p className="text-slate-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </Label>
          <Input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200"
          />
          {errors.email && (
            <p className="text-slate-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Order Notes (Optional) */}
        <div>
          <Label
            htmlFor="orderNotes"
            className="block text-sm font-medium text-gray-700"
          >
            Order Notes (Optional)
          </Label>
          <Textarea
            id="orderNotes"
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleChange}
            placeholder="Add any additional instructions or comments here..."
            className="mt-1 block w-full rounded-sm ring-offset-0 ring-white border-none bg-gray-200 p-2"
          />
        </div>

        {/* Submit Button */}
        {/* <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Order
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default BillingForm;
