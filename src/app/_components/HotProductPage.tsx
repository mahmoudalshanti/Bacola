"use client";

import { useEffect, useState } from "react";
import { ProductWithCategory } from "../dashboard/layout/_components/HotProduct";
import {
  actionGetCouponCode,
  actionGetHotProduct,
} from "../dashboard/_actions/actionDashboard";
import { useRouter } from "next/navigation";

function HotProductPage() {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState<number>(100);
  const [coupon, setCoupon] = useState<string>(""); // Initialize as an object
  // const [offerEndTime, setOfferEndTime] = useState<Date | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchHotProduct = async () => {
      try {
        // setLoading(true);
        const response = await actionGetHotProduct();

        setProduct(response?.product as ProductWithCategory);

        // Calculate end time (7 days from createdAt)
        if (response?.createdAt) {
          const createdAt = new Date(response?.createdAt || new Date());
          const endTime = new Date(createdAt);
          endTime.setDate(createdAt?.getDate() + 60);

          // Start the countdown
          startCountdown(endTime);
        }

        // setOfferEndTime(endTime);
      } catch (err) {
        console.error("Something went Error!", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchHotProduct();
  }, []);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const findCoupon = await actionGetCouponCode();
        if (findCoupon && "code" in findCoupon)
          setCoupon(findCoupon?.code ? findCoupon.code : "");
        if (findCoupon && "errMsg" in findCoupon)
          throw new Error(findCoupon.errMsg);
      } catch (err) {
        console.error("Something went Error!", err);
      }
    };
    fetchCoupon();
  }, []);

  const startCountdown = (endTime: Date) => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(0);
        return;
      }

      // Calculate time left
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      // Calculate progress percentage (100% to 0% over 60 days)
      const totalDuration = 60 * 24 * 60 * 60 * 1000; // Changed from 7 to 60 days
      const elapsed = totalDuration - difference;
      const progressPercentage = Math.max(
        0,
        100 - (elapsed / totalDuration) * 100
      );
      setProgress(progressPercentage);
    };

    // Update immediately and then every second
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  };

  return (
    <div
      className="py-1 xl:py-8 space-y-8 cursor-pointer"
      onClick={() => router.push(`/product/${product?.id}`)}
    >
      <div className="space-y-8 ">
        <div>
          <p className="text-lg font-semibold text-gray-800">
            HOT PRODUCT FOR <span className="text-red-500">THIS WEEK</span>
          </p>
          <p className="text-sm text-gray-500">
            Don't miss this opportunity at a special discount just for this
            week.
          </p>
        </div>

        <div className="border border-red-300 rounded-lg px-2 xl:px-10 flex gap-4 items-center">
          <div className="relative w-40 h-40">
            {product?.images?.[0]?.image ? (
              <>
                <div className="absolute flex items-center justify-center w-16 h-16 bg-red-500 text-white font-bold rounded-full -top-2 -left-2">
                  {product.offer && product.price
                    ? `${Math.round(
                        (1 - product.offer / product.price) * 100
                      )}%`
                    : "19%"}
                </div>
                <img
                  src={product.images[0].image}
                  className="h-full w-full object-contain"
                  alt={product.name}
                />
              </>
            ) : (
              <div className="h-full w-full bg-gray-200 animate-pulse" />
            )}
          </div>

          <div className="flex-1">
            <div className="text-gray-400 line-through text-sm">
              ${product?.price?.toFixed(2)}
            </div>
            <div className="text-red-500 text-lg font-bold">
              ${product?.offer?.toFixed(2)}
            </div>
            <div className="text-gray-800 font-medium">{product?.name}</div>

            {/* Countdown Timer */}
            <div className="flex gap-2 mt-2 text-sm">
              <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.days}</span>d
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.hours}</span>h
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.minutes}</span>m
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="font-bold">{timeLeft.seconds}</span>s
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Offer ends in {timeLeft.days} days {timeLeft.hours}h{" "}
              {timeLeft.minutes}m
            </p>
          </div>
        </div>
        {coupon && (
          <div className="bg-red-100 text-red-600 p-4 px-2 xl:px-10 rounded-lg flex justify-between items-center">
            <span>
              Super discount for your <strong>first purchase.</strong>
            </span>

            <div className="border p-2 text-sm rounded-md border-red-500 text-red-500 hover:text-red-500 bg-transparent hover:bg-red-200 transition-colors">
              {coupon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotProductPage;
