import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative mb-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
        <input
          ref={ref}
          {...props}
          className={` pl-5 pr-5 py-2 bg-opacity-50 rounded-lg border border-gray-700 focus:ring-2 text-gray-800 placeholder-gray-400 transition duration-200 outline-none ${className}`}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
