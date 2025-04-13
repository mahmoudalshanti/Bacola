"use client";

import Input from "@/components/Input";
import { nameCheck } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

const PersonalInfo = ({
  isValidFName,
  setIsValidFName,
  isValidLName,
  setIsValidLName,
  setFName,
  setLName,
  fName,
  lName,
}: {
  isValidFName: boolean;
  setIsValidFName: React.Dispatch<React.SetStateAction<boolean>>;
  isValidLName: boolean;
  setIsValidLName: React.Dispatch<React.SetStateAction<boolean>>;
  setFName: React.Dispatch<React.SetStateAction<string>>;
  setLName: React.Dispatch<React.SetStateAction<string>>;
  fName: string;
  lName: string;
}) => {
  const [touchedFName, setTouchedFName] = useState<boolean>(false);
  const [touchedLName, setTouchedLName] = useState<boolean>(false);

  useEffect(() => {
    setIsValidFName(nameCheck(fName));
  }, [fName, touchedFName, setIsValidFName]);

  useEffect(() => {
    setIsValidLName(nameCheck(lName));
  }, [lName, touchedLName, setIsValidLName]);

  const handleFNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFName(e.target.value);
    },
    [setFName]
  );

  const handleLNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLName(e.target.value);
    },
    [setLName]
  );

  return (
    <div className="flex justify-between">
      {/* First Name Input */}
      <div className="w-[48%]">
        <Input
          placeholder="First Name"
          onFocus={() => setTouchedFName(true)} // Mark field as touched on focus
          onChange={handleFNameChange}
          aria-invalid={!isValidFName}
          className={`mt-7 py-3 w-full border ${
            touchedFName && !isValidFName
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          }`}
        />
        {/* Show error message if first name is invalid and field is touched */}
        {touchedFName && !isValidFName && (
          <p className="text-sm ml-2 font-semibold text-red-600">
            Invalid first name
          </p>
        )}
      </div>

      {/* Last Name Input */}
      <div className="w-[48%] ml-[2%]">
        <Input
          placeholder="Last Name"
          onFocus={() => setTouchedLName(true)} // Mark field as touched on focus
          onChange={handleLNameChange}
          aria-invalid={!isValidLName}
          className={`mt-7 py-3 w-full border ${
            touchedLName && !isValidLName
              ? "border-red-600 ring-red-500 placeholder-red-500"
              : "border-gray-700 ring-gray-500"
          }`}
        />
        {touchedLName && !isValidLName && (
          <p className="text-sm ml-2 font-semibold text-red-600">
            Invalid last name
          </p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
