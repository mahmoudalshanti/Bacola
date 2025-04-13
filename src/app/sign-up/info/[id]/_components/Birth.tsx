"use client";

import Input from "@/components/Input";
import { birthCheck } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function Birth({
  setIsValidDate,
  isValidDate,
  day,
  setDay,
  month,
  setMonth,
  year,
  setYear,
}: {
  isValidDate: boolean;
  setIsValidDate: React.Dispatch<React.SetStateAction<boolean>>;
  day: number | null;
  setDay: React.Dispatch<React.SetStateAction<number | null>>;
  month: number | null;
  setMonth: React.Dispatch<React.SetStateAction<number | null>>;
  year: number | null;
  setYear: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [focus, setFocus] = useState(false); // Track if input is focused
  const [hasInteracted, setHasInteracted] = useState(false); // Track if user has interacted with inputs

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDay(+e.target.value);
    if (e.target.value.length === 2) {
      monthRef.current?.focus(); // Focus the month field when day field is complete
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(+e.target.value);
    if (month)
      if (e.target.value.length === 2) {
        yearRef.current?.focus(); // Focus the year field when month field is complete
      }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(+e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (!/^\d$/.test(key) && key !== "Backspace") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    setIsValidDate(birthCheck(day, month, year));
  }, [year, month, day]);

  return (
    <>
      <p className="mt-7 font-semibold text-sm">Date of Birth</p>
      <div className="flex justify-between">
        {/* Day Input */}
        <Input
          ref={dayRef}
          placeholder="Day"
          className={`mt-2 py-3 w-[95%] ${
            focus && !day?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          } ${
            !isValidDate && day?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          }`}
          maxLength={2}
          onChange={handleDayChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setFocus(true);
            setHasInteracted(true);
          }}
        />

        <Input
          ref={monthRef}
          placeholder="Month"
          className={`mt-2 py-3 w-[93%] mx-[5%] ${
            focus && !month?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          } ${
            !isValidDate && month?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          }`}
          maxLength={2}
          onChange={handleMonthChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setFocus(true);
            setHasInteracted(true);
          }}
        />

        <Input
          ref={yearRef}
          placeholder="Year"
          className={`mt-2 py-3 w-[95%] ml-[10%] ${
            focus && !year?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          } ${
            !isValidDate && year?.toString().length
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          }`}
          maxLength={4}
          onChange={handleYearChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setFocus(true);
            setHasInteracted(true);
          }}
        />
      </div>

      {hasInteracted && !isValidDate && (
        <p className="text-sm ml-2 font-semibold text-red-600">Invalid date</p>
      )}
    </>
  );
}
