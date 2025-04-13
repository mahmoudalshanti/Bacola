"use client";

import { forwardRef, ComponentType, InputHTMLAttributes } from "react";
import { LucideProps } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconDef: ComponentType<LucideProps>;
  iconSec?: ComponentType<LucideProps>;
  className?: string;
  hide?: boolean;
  setHide?: React.Dispatch<React.SetStateAction<boolean>>;
}

const IconInputLarge = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      iconDef: IconDef,
      iconSec: IconSec,
      hide,
      setHide,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative mb-6">
        <input
          ref={ref}
          {...props}
          className={`w-full  pl-5 pr-12 py-2 bg-opacity-50 rounded-lg border border-gray-700 focus:ring-2 text-gray-800 placeholder-gray-400 transition duration-200 outline-none ${className}`}
        />
        <div className="absolute top-[40%] translate-y-[-50%] mt-6 right-3 cursor-pointer">
          <IconDef
            className="size-6 text-gray-800"
            onClick={() => setHide && setHide(false)}
          />
        </div>

        {!hide && IconSec && (
          <div className="absolute top-[40%] translate-y-[-50%] mt-6 right-3 cursor-pointer">
            <IconSec
              className="size-6 text-gray-800"
              onClick={() => setHide && setHide(true)}
            />
          </div>
        )}
      </div>
    );
  }
);

export default IconInputLarge;
