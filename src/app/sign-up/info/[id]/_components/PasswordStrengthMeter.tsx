"use client";

import { Check, X } from "lucide-react";

interface Criteria {
  label: string;
  met: boolean;
}

const PasswordCriteria = ({
  criteria,
  focus,
}: {
  criteria: Criteria[];
  focus: boolean;
}) => {
  return (
    <div className="mt-2 space-y-1">
      {criteria?.map((item: { label: string; met: boolean }) => (
        <div key={item.label} className="flex items-center text-sm">
          {/* Render a check icon if the criteria is met, or an 'X' if not */}
          {item.met ? (
            <Check className="size-4 text-green-700 mr-2" />
          ) : (
            <X
              className={`size-4  text-gray-500 mr-2 ${
                focus && "text-red-600 font-semibold"
              }`}
            />
          )}
          {/* Show the criteria label with conditional styling */}
          <span
            className={
              item.met
                ? "text-green-700"
                : `text-gray-500 ${focus && "text-red-600 font-semibold"}`
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * PasswordStrengthMeter component renders the strength criteria for the password.
 * It displays a list of password validation rules, showing checkmarks or 'X's
 * depending on whether each rule is met.
 *
 * @param {Object} props - The component props.
 * @param {Criteria[]} props.criteria - An array of criteria to check the password against.
 * @param {boolean} props.focus - A boolean indicating if the input field is focused.
 *
 * @returns {JSX.Element} The rendered PasswordStrengthMeter component.
 */
const PasswordStrengthMeter = ({
  criteria,
  focus,
}: {
  criteria: Criteria[];
  focus: boolean;
}) => {
  return (
    <div className="mt-2">
      {/* Pass the criteria to PasswordCriteria for rendering */}
      <PasswordCriteria criteria={criteria} focus={focus} />
    </div>
  );
};

export default PasswordStrengthMeter;
