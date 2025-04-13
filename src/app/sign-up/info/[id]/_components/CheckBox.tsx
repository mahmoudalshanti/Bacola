"use client";

import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckBox({
  isChecked,
  setIsChecked,
}: {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleCheckedChange = useCallback((checked: boolean) => {
    setIsChecked(checked); // Update the checked state
  }, []);

  return (
    <div className="flex mt-7">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="mr-4 mt-1 w-5 h-5 rounded-sm border-gray-500 checked:bg-black checked:border-black checked:shadow-lg"
      />
      <p className="text-black font-semibold text-md ml-2">
        By continuing, I agree to Shopfaster’s{" "}
        <span className="underline cursor-pointer font-bold">
          Privacy Policy
        </span>{" "}
        and{" "}
        <span className="underline cursor-pointer font-bold">Terms of Use</span>
        .
      </p>
    </div>
  );
}
