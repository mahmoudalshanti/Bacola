import { capitalizeIfAmpersand } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export function ToastAddCartSuccess(name: string) {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-in" : "animate-out"
      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5"></div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-white flex">
              <p className="text-sm w-[300px] font-bold mr-2">
                {capitalizeIfAmpersand(name)}
              </p>
            </div>
            <Link href={"/cart"} className="mt-1 text-sm underline text-white">
              View cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  ));
}
export function ToastFormSuccess() {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-in" : "animate-out"
      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5"></div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-white flex">
              <p className="text-sm w-[300px] font-bold mr-2">
                From Update Successfully
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}

export function ToastAddWishlistSuccess(name: string) {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-in" : "animate-out"
      } max-w-md w-full bg-green-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5"></div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-white flex">
              <p className="text-sm w-[300px] font-bold mr-2">
                {capitalizeIfAmpersand(name)}
              </p>
            </div>
            <Link
              href={"/wishlist"}
              className="mt-1 text-sm underline text-white"
            >
              View wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  ));
}
export function ToastFaild(message: string) {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-in" : "animate-out"
      } max-w-md w-full bg-amber-700 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5"></div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-white flex">
              <p className="text-sm w-[300px] font-bold mr-2">
                {capitalizeIfAmpersand(message)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}
